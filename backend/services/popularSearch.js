import pool from '../config/db.js'

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
  const { rows } = await pool.query(
    `
    SELECT 
      p.id,
      p.title,
      pd.project_name,
      pd.city,
      pd.locality,
      COUNT(ph.id) AS hit_count,
      pd.super_built_up_area,
      pd.carpet_area,
      pd.bedrooms,
      pd.bathrooms,
      pd.balconies,
      pd.furnished_status,
      p.expected_price AS price,
      p.price_per_sqft,
      d.name AS developer_name,
      pc.name AS category_name,
      psc.name AS subcategory_name,
      (
        SELECT pi.image_url
        FROM property_images pi
        WHERE pi.property_id = p.id AND pi.is_primary = true
        LIMIT 1
      ) AS primary_image

    FROM property_hits ph
    JOIN property p ON ph.property_id = p.id
    LEFT JOIN property_details pd ON pd.property_id = p.id
    LEFT JOIN developer d ON p.developer_id = d.id
    LEFT JOIN property_category pc ON p.category_id = pc.id
    LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id

    GROUP BY p.id, pd.project_name, pd.city, pd.locality, pd.super_built_up_area, 
             pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies,
             pd.furnished_status, p.expected_price, p.price_per_sqft, 
             d.name, pc.name, psc.name

    ORDER BY hit_count DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return rows;
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