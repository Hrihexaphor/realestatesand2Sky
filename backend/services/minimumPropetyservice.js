import pool from '../config/db.js'

export async function getMinimalProperties(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
  
    try {
      const result = await pool.query(`
        SELECT 
          p.id,
          p.title,
          pd.project_name,
          pd.location,
          pd.locality,
          pd.city,
          p.expected_price,
          pd.built_up_area,
          p.price_per_sqft,
          pd.carpet_area,
          pd.bedrooms,
          pd.bathrooms,
          pd.furnished_status,
          pd.available_from,
          d.name AS developer_name,
  
          (
            SELECT pi.image_url
            FROM property_images pi
            WHERE pi.property_id = p.id
            ORDER BY pi.id ASC
            LIMIT 1
          ) AS primary_image
  
        FROM property p
        LEFT JOIN property_details pd ON p.id = pd.property_id
        LEFT JOIN developer d ON p.developer_id = d.id
        ORDER BY p.id DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
  
      return result.rows;
    } catch (error) {
      console.error("Error getting minimal property data:", error);
      throw new Error(`Failed to get minimal properties: ${error.message}`);
    }
  }
  