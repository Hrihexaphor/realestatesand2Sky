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
      fp.featured_to,
      ARRAY_AGG(c.name) AS city_names,
      ARRAY_AGG(c.id) AS city_ids
    FROM property p
    JOIN featured_properties fp ON p.id = fp.property_id
    JOIN featured_property_cities fpc ON fp.id = fpc.featured_property_id
    JOIN cities c ON fpc.city_id = c.id
  `;

  // If cities are specified, filter by those cities
  if (cityIds && cityIds.length > 0) {
    query += `
      WHERE fpc.city_id IN (${cityIds.join(',')})
    `;
  }

  query += `
    GROUP BY p.id, fp.id, fp.featured_from, fp.featured_to
  `;

  const result = await pool.query(query);
  return result.rows;
}
// get active featured  property details cardf
export async function getActiveFeaturedPropertiesLite() {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.possession_status,
        pd.project_name,
        pd.location,
        pd.city,
        pd.locality,
        p.expected_price AS price,
        p.price_per_sqft,
        pd.super_built_up_area,
        pd.carpet_area,
        pd.bedrooms,
        pd.bathrooms,
        pd.balconies,
        pd.transaction_types,
        pd.furnished_status,
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
        ) AS configurations,

        fp.featured_from,
        fp.featured_to,

        ARRAY_AGG(DISTINCT c.name) AS city_names,
        ARRAY_AGG(DISTINCT c.id) AS city_ids

      FROM featured_properties fp
      INNER JOIN property p ON fp.property_id = p.id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id
      LEFT JOIN featured_property_cities fpc ON fp.id = fpc.featured_property_id
      LEFT JOIN cities c ON fpc.city_id = c.id

      WHERE fp.featured_from IS NOT NULL
        AND fp.featured_to IS NOT NULL
        AND CURRENT_DATE BETWEEN fp.featured_from AND fp.featured_to
        AND pd.property_status = 'active'
        AND pd.transaction_types = 'New property'

      GROUP BY 
        p.id, pd.project_name, pd.location, pd.city, pd.locality, pd.super_built_up_area, pd.transaction_types,
        pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
        d.id, d.name, pc.name, psc.name, p.price_per_sqft,
        fp.featured_from, fp.featured_to, possession_status

      ORDER BY fp.featured_from DESC
    `);

    return result.rows;
  } catch (error) {
    console.error("Error fetching lite featured properties:", error);
    throw new Error(`Failed to fetch active featured properties: ${error.message}`);
  }
}
