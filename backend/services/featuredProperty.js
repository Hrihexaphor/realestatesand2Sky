import pool from '../config/db.js'

export async function addToFeatured(property_id) {
    const result = await pool.query(`INSERT INTO featured_properties (property_id) VALUES ($1) RETURNING *`, [property_id]);
    return result.rows[0];
}

export async function removeFromFeatured(property_id) {
    const result = await pool.query(`DELETE FROM featured_properties WHERE property_id = $1 RETURNING *`, [property_id]);
    return result.rows[0];
}

export async function getAllFeaturedIds() {
    const result = await pool.query(`SELECT property_id FROM featured_properties`);
    return result.rows.map(row => row.property_id); // Return array of IDs
}

export async function checkIfFeatured(property_id) {
    const result = await pool.query(`SELECT * FROM featured_properties WHERE property_id = $1`, [property_id]);
    return result.rows[0]; // Returns the row if found, undefined if not
}

export async function getFeaturedPropertiesWithDetails(){
    try{
        const result = await db.query(`
            SELECT 
              p.*, 
              pd.*, 
              pl.latitude, pl.longitude, pl.address,
              d.id AS developer_id, d.name AS developer_name, d.company_name AS developer_company_name,
              pc.name AS property_category_name,
              psc.name AS property_subcategory_name,
      
              (
                SELECT json_agg(pi.*) 
                FROM property_images pi 
                WHERE pi.property_id = p.id
              ) AS images,
      
              (
                SELECT json_agg(json_build_object('id', a.id, 'name', a.name, 'icon', a.icon)) 
                FROM property_amenity pa 
                JOIN amenity a ON pa.amenity_id = a.id 
                WHERE pa.property_id = p.id
              ) AS amenities,
      
              (
                SELECT json_agg(json_build_object('id', nt.id, 'name', nt.name, 'distance_km', pnt.distance_km)) 
                FROM property_nearest_to pnt 
                JOIN nearest_to nt ON pnt.nearest_to_id = nt.id 
                WHERE pnt.property_id = p.id
              ) AS nearest_to,
      
              (
                SELECT json_agg(json_build_object('id', pd.id, 'type', pd.type, 'file_url', pd.file_url)) 
                FROM property_documents pd 
                WHERE pd.property_id = p.id
              ) AS documents
      
            FROM property p
            LEFT JOIN featured_properties fp ON fp.property_id = p.id
            LEFT JOIN property_details pd ON p.id = pd.property_id
            LEFT JOIN property_location pl ON p.id = pl.property_id
            LEFT JOIN developer d ON p.developer_id = d.id
            LEFT JOIN property_category pc ON p.category_id = pc.id
            LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
            WHERE fp.property_id IS NOT NULL
            ORDER BY p.id DESC
          `);
          return result.rows;
    }catch (error) {
        console.error("Error getting featured properties:", error);
        throw new Error(`Failed to get featured properties: ${error.message}`);
      }
}