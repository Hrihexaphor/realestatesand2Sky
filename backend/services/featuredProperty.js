import pool from '../config/db.js'

export async function addToFeatured(property_id, start_date, end_date, cities = []) {
  // Begin a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert into the main featured_properties table
    const featuredResult = await client.query(
      `INSERT INTO featured_properties (property_id, featured_from, featured_to) 
       VALUES ($1, $2, $3) RETURNING *`,
      [property_id, start_date, end_date]
    );
    
    // If cities are provided, insert them into a relationship table
    if (cities && cities.length > 0) {
      for (const cityId of cities) {
        await client.query(
          `INSERT INTO featured_property_cities (featured_property_id, city_id) 
           VALUES ($1, $2)`,
          [featuredResult.rows[0].id, cityId]
        );
      }
    }
    
    await client.query('COMMIT');
    return featuredResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
// edit functionality for the featured properties
export async function updateFeaturedProperty(featured_property_id, start_date, end_date, cities = []) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update featured property dates
    await client.query(
      `UPDATE featured_properties 
       SET featured_from = $1, featured_to = $2 
       WHERE id = $3`,
      [start_date, end_date, featured_property_id]
    );

    // Clear previous city links
    await client.query(
      `DELETE FROM featured_property_cities 
       WHERE featured_property_id = $1`,
      [featured_property_id]
    );

    // Re-insert city links if provided
    if (cities && cities.length > 0) {
      for (const cityId of cities) {
        await client.query(
          `INSERT INTO featured_property_cities (featured_property_id, city_id) 
           VALUES ($1, $2)`,
          [featured_property_id, cityId]
        );
      }
    }

    await client.query('COMMIT');
    return { message: "Featured property updated successfully" };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// only featured details get services
export async function getFeaturedPropertyDetails(featured_property_id) {
  const client = await pool.connect();
  try {
    // Fetch featured property main info
    const { rows: featuredRows } = await client.query(
      `SELECT id, featured_from, featured_to 
       FROM featured_properties 
       WHERE id = $1`,
      [featured_property_id]
    );

    if (featuredRows.length === 0) {
      return null;
    }

    // Fetch associated cities
    const { rows: cityRows } = await client.query(
      `SELECT city_id FROM featured_property_cities 
       WHERE featured_property_id = $1`,
      [featured_property_id]
    );

    const cityIds = cityRows.map(row => row.city_id);

    return {
      id: featured_property_id,
      start_date: featuredRows[0].featured_from,
      end_date: featuredRows[0].featured_to,
      cities: cityIds
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function removeFromFeatured(property_id) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get the featured property ID first
    const featuredProperty = await client.query(
      `SELECT id FROM featured_properties WHERE property_id = $1`,
      [property_id]
    );
    
    if (featuredProperty.rows.length > 0) {
      const featuredId = featuredProperty.rows[0].id;
      
      // Remove any city relationships if they exist
      await client.query(
        `DELETE FROM featured_property_cities WHERE featured_property_id = $1`,
        [featuredId]
      );
    }
    
    // Delete the main featured property record
    const result = await client.query(
      `DELETE FROM featured_properties WHERE property_id = $1 RETURNING *`, 
      [property_id]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getAllFeaturedIds() {
  const result = await pool.query(`SELECT property_id FROM featured_properties`);
  return result.rows.map(row => row.property_id); // Return array of IDs
}


export async function checkIfFeatured(property_id) {
  const result = await pool.query(
    `SELECT * FROM featured_properties WHERE property_id = $1`,
    [property_id]
  );
  return result.rows.length > 0;
}

export async function getFeaturedProperties(cityIds = []) {
  let query = `
    SELECT 
      p.*, 
      fp.id AS feature_id, 
      fp.featured_from, 
      fp.featured_to 
    FROM property p
    JOIN featured_properties fp ON p.id = fp.property_id
  `;

  // If cities are specified, filter by those cities
  if (cityIds && cityIds.length > 0) {
    query += `
      JOIN featured_property_cities fpc ON fp.id = fpc.featured_property_id
      WHERE fpc.city_id IN (${cityIds.join(',')})
    `;
  }

  const result = await pool.query(query);
  return result.rows;
}
// export async function getFeaturedPropertiesWithDetails(){
//     try{
//       const { rows: featuredRows } = await pool.query(`
//         SELECT p.*, 
//                d.name AS developer_name, d.company_name AS developer_company_name,
//                pc.name AS property_category_name,
//                psc.name AS property_subcategory_name
//         FROM property p
//         INNER JOIN featured_properties fp ON fp.property_id = p.id
//         LEFT JOIN developer d ON p.developer_id = d.id
//         LEFT JOIN property_category pc ON p.category_id = pc.id
//         LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
//         ORDER BY p.id DESC
//       `);
  
//       const properties = [];
  
//       for (const basic of featuredRows) {
//         const propertyId = basic.id;
  
//         const [{ rows: detailsRows }, { rows: locationRows }, { rows: imageRows },
//                { rows: documentRows }, { rows: amenitiesRows }, { rows: nearestRows }] = await Promise.all([
//           pool.query(`SELECT * FROM property_details WHERE property_id = $1`, [propertyId]),
//           pool.query(`SELECT latitude, longitude, address FROM property_location WHERE property_id = $1`, [propertyId]),
//           pool.query(`SELECT * FROM property_images WHERE property_id = $1`, [propertyId]),
//           pool.query(`SELECT id, type, file_url FROM property_documents WHERE property_id = $1`, [propertyId]),
//           pool.query(`SELECT a.id, a.name, a.icon
//                       FROM property_amenity pa
//                       JOIN amenity a ON pa.amenity_id = a.id
//                       WHERE pa.property_id = $1`, [propertyId]),
//           pool.query(`SELECT nt.id, nt.name, pnt.distance_km
//                       FROM property_nearest_to pnt
//                       JOIN nearest_to nt ON pnt.nearest_to_id = nt.id
//                       WHERE pnt.property_id = $1`, [propertyId])
//         ]);
  
//         properties.push({
//           basic,
//           details: detailsRows[0] || null,
//           location: locationRows[0] || null,
//           images: imageRows,
//           documents: documentRows,
//           amenities: amenitiesRows,
//           nearest_to: nearestRows
//         });
//       }
  
//           return properties;
//     }catch (error) {
//         console.error("Error getting featured properties:", error);
//         throw new Error(`Failed to get featured properties: ${error.message}`);
//       }
// }
export async function getActiveFeaturedPropertiesLite() {
  try {
    // Using a prepared statement with parameterized query
    const result = await pool.query(`
      SELECT
        p.id,
        pd.project_name,
        p.title,
        pd.city,
        pd.locality,
        p.expected_price,
        d.name AS developer_name,
        pi.image_url AS primary_image,
        fp.featured_from,
        psc.name AS subcategory_name,
        fp.featured_to
      FROM featured_properties fp
      INNER JOIN property p ON fp.property_id = p.id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM property_images
        WHERE property_id = p.id
        ORDER BY id ASC
        LIMIT 1
      ) pi ON true
      WHERE fp.featured_from IS NOT NULL
        AND fp.featured_to IS NOT NULL
        AND CURRENT_DATE BETWEEN fp.featured_from AND fp.featured_to
      ORDER BY fp.featured_from DESC;
    `);
    
    return result.rows;
  } catch (error) {
    console.error("Error fetching lite featured properties:", error);
    throw new Error(`Failed to fetch active featured properties: ${error.message}`);
  }
}
