import pool from "../config/db.js";
export async function checkIfInGallery(property_id) {
  const result = await pool.query(
    `SELECT * FROM project_gallery 
     WHERE property_id = $1 AND gallery_to >= CURRENT_DATE`,
    [property_id]
  );
  return result.rows.length > 0;
}

export async function addToGallery(property_id, gallery_from, gallery_to) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const galleryResult = await client.query(
      `INSERT INTO project_gallery (property_id, gallery_from, gallery_to)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [property_id, gallery_from, gallery_to]
    );

    await client.query("COMMIT");
    return galleryResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getActiveGalleryImages() {
  try {
    const result = await pool.query(`
      SELECT
        p.id AS property_id,
        pd.project_name,
        p.title,
        pd.city,
        pd.locality,
        p.expected_price,
        d.name AS developer_name,
        pi.image_url,
        pg.gallery_from,
        pg.gallery_to
      FROM project_gallery pg
      INNER JOIN property p ON pg.property_id = p.id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_images pi ON pi.property_id = p.id
      WHERE CURRENT_DATE BETWEEN pg.gallery_from AND pg.gallery_to
      ORDER BY pg.gallery_from DESC, pi.id ASC;
    `);

    // Group images by property_id
    const grouped = {};
    result.rows.forEach((row) => {
      const {
        property_id,
        project_name,
        title,
        city,
        locality,
        expected_price,
        developer_name,
        gallery_from,
        gallery_to,
        image_url,
      } = row;

      if (!grouped[property_id]) {
        grouped[property_id] = {
          property_id,
          project_name,
          title,
          city,
          locality,
          expected_price,
          developer_name,
          gallery_from,
          gallery_to,
          images: [],
        };
      }

      grouped[property_id].images.push(image_url);
    });

    return Object.values(grouped); // return as array
  } catch (error) {
    console.error("Error fetching gallery properties:", error);
    throw new Error(
      `Failed to fetch active gallery properties: ${error.message}`
    );
  }
}

export async function removeFromGallery(property_id) {
  const result = await pool.query(
    `DELETE FROM project_gallery WHERE property_id = $1 RETURNING *`,
    [property_id]
  );
  return result.rows[0]; // returns deleted entry or undefined if not found
}

// get activegallary details
export async function getActiveGalleryPropertiesDetails() {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
        p.possession_status,
        pd.project_name,
        pd.location,
        pd.locality,
        pd.city,
        p.expected_price,
        pd.super_built_up_area,
        p.price_per_sqft,
        pd.carpet_area,
        pd.bedrooms,
        pd.bathrooms,
        pd.balconies,
        pd.furnished_status,
        pd.transaction_types,
        pd.available_from,
        d.id AS developer_id,
        d.name AS developer_name,
        pc.name AS category_name,
        psc.name AS subcategory_name,

        (
          SELECT pi.image_url
          FROM property_images pi
          WHERE pi.property_id = p.id AND pi.is_primary = true
          LIMIT 1
        ) AS primary_image,

        EXISTS (
          SELECT 1 FROM featured_properties fp 
          WHERE fp.property_id = p.id
        ) AS is_featured,

        COALESCE(
          json_agg(
            jsonb_build_object(
              'id', config.id,
              'bhk_type', config.bhk_type,
              'bedrooms', config.bedrooms,
              'bathrooms', config.bathrooms,
              'super_built_up_area', config.super_built_up_area,
              'carpet_area', config.carpet_area,
              'balconies', config.balconies
            )
          ) FILTER (WHERE config.id IS NOT NULL), '[]'
        ) AS configurations

      FROM project_gallery pg
      INNER JOIN property p ON pg.property_id = p.id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      WHERE CURRENT_DATE BETWEEN pg.gallery_from AND pg.gallery_to

      GROUP BY p.id, pd.project_name, pd.location, pd.locality, pd.city, pd.super_built_up_area, pd.transaction_types,
               pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
               d.id, d.name, pc.name, psc.name, p.price_per_sqft, p.possession_status

      ORDER BY p.id DESC
      `
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching active gallery property details:", error);
    throw new Error(
      `Failed to get active gallery properties: ${error.message}`
    );
  }
}
