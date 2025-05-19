import pool from '../config/db.js'
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
    await client.query('BEGIN');

    const galleryResult = await client.query(
      `INSERT INTO project_gallery (property_id, gallery_from, gallery_to)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [property_id, gallery_from, gallery_to]
    );

    await client.query('COMMIT');
    return galleryResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
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
    result.rows.forEach(row => {
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
        image_url
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
          images: []
        };
      }

      grouped[property_id].images.push(image_url);
    });

    return Object.values(grouped); // return as array
  } catch (error) {
    console.error("Error fetching gallery properties:", error);
    throw new Error(`Failed to fetch active gallery properties: ${error.message}`);
  }
}

export async function removeFromGallery(property_id) {
  const result = await pool.query(
    `DELETE FROM project_gallery WHERE property_id = $1 RETURNING *`,
    [property_id]
  );
  return result.rows[0]; // returns deleted entry or undefined if not found
}