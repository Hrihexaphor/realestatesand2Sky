import pool from "../config/db.js";

// post the maximum hit property
export async function logPropertyHit({ propertyId, ipAddress, userAgent }) {
  await pool.query(
    `INSERT INTO property_hits (property_id, ip_address, user_agent) VALUES ($1, $2, $3)`,
    [propertyId, ipAddress, userAgent]
  );
}

// Save locality view
export async function logLocalityHit({ city, locality, ipAddress, userAgent }) {
  await pool.query(
    `INSERT INTO locality_hits (city, locality, ip_address, user_agent) VALUES ($1, $2, $3, $4)`,
    [city, locality, ipAddress, userAgent]
  );
}

// get the property hits
export const getMostDemandedProperties = async (limit = 10, offset = 0) => {
  try {
    const { rows } = await pool.query(
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

        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object(
                'id', c.id,
                'bhk_type', c.bhk_type,
                'bedrooms', c.bedrooms,
                'bathrooms', c.bathrooms,
                'super_built_up_area', c.super_built_up_area,
                'carpet_area', c.carpet_area,
                'balconies', c.balconies
              )
            ), '[]'
          )
          FROM property_configurations c
          WHERE c.property_id = p.id
        ) AS configurations,

        COUNT(ph.id) AS hit_count

      FROM property_hits ph
      JOIN property p ON ph.property_id = p.id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id

      GROUP BY p.id, pd.project_name, pd.location, pd.locality, pd.city, pd.super_built_up_area, pd.transaction_types,
               pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
               d.id, d.name, pc.name, psc.name, p.price_per_sqft, p.possession_status

      HAVING COUNT(ph.id) > 0

      ORDER BY hit_count DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Error fetching most demanded properties:", error);
    throw new Error(`Failed to get most demanded properties: ${error.message}`);
  }
};

// get the locality
export const getTopLocalities = async (limit = 10) => {
  const { rows } = await pool.query(
    `
    SELECT 
      city,
      locality,
      COUNT(*) AS hit_count
    FROM locality_hits
    GROUP BY city, locality
    ORDER BY hit_count DESC
    LIMIT $1
    `,
    [limit]
  );

  return rows;
};
