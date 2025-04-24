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
      const { rows: featuredRows } = await pool.query(`
        SELECT p.*, 
               d.name AS developer_name, d.company_name AS developer_company_name,
               pc.name AS property_category_name,
               psc.name AS property_subcategory_name
        FROM property p
        INNER JOIN featured_properties fp ON fp.property_id = p.id
        LEFT JOIN developer d ON p.developer_id = d.id
        LEFT JOIN property_category pc ON p.category_id = pc.id
        LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
        ORDER BY p.id DESC
      `);
  
      const properties = [];
  
      for (const basic of featuredRows) {
        const propertyId = basic.id;
  
        const [{ rows: detailsRows }, { rows: locationRows }, { rows: imageRows },
               { rows: documentRows }, { rows: amenitiesRows }, { rows: nearestRows }] = await Promise.all([
          pool.query(`SELECT * FROM property_details WHERE property_id = $1`, [propertyId]),
          pool.query(`SELECT latitude, longitude, address FROM property_location WHERE property_id = $1`, [propertyId]),
          pool.query(`SELECT * FROM property_images WHERE property_id = $1`, [propertyId]),
          pool.query(`SELECT id, type, file_url FROM property_documents WHERE property_id = $1`, [propertyId]),
          pool.query(`SELECT a.id, a.name, a.icon
                      FROM property_amenity pa
                      JOIN amenity a ON pa.amenity_id = a.id
                      WHERE pa.property_id = $1`, [propertyId]),
          pool.query(`SELECT nt.id, nt.name, pnt.distance_km
                      FROM property_nearest_to pnt
                      JOIN nearest_to nt ON pnt.nearest_to_id = nt.id
                      WHERE pnt.property_id = $1`, [propertyId])
        ]);
  
        properties.push({
          basic,
          details: detailsRows[0] || null,
          location: locationRows[0] || null,
          images: imageRows,
          documents: documentRows,
          amenities: amenitiesRows,
          nearest_to: nearestRows
        });
      }
  
          return properties;
    }catch (error) {
        console.error("Error getting featured properties:", error);
        throw new Error(`Failed to get featured properties: ${error.message}`);
      }
}