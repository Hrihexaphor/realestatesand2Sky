import pool from "../config/db.js";

// listing all property with minimum details
export async function getMinimalProperties(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
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

      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      GROUP BY p.id, pd.project_name, pd.location, pd.locality, pd.city, pd.super_built_up_area,
               pd.carpet_area, pd.bedrooms, pd.bathrooms,pd.balconies, pd.furnished_status, pd.available_from,
               d.id, d.name, pc.name, psc.name, p.price_per_sqft

      ORDER BY p.id DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    return result.rows;
  } catch (error) {
    console.error("Error getting minimal property data:", error);
    throw new Error(`Failed to get minimal properties: ${error.message}`);
  }
}

// new project minimum details services

export const getNewProjectsSummary = async (limit = 10, offset = 0) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
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

      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      WHERE pd.property_status = 'active' AND pd.transaction_types = 'New property'

      GROUP BY 
        p.id, pd.project_name, pd.location, pd.city, pd.locality, pd.super_built_up_area,
        pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
        d.id, d.name, pc.name, psc.name, p.price_per_sqft

      ORDER BY p.id DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch new project summaries:", error);
    throw new Error(`Failed to fetch new project summaries: ${error.message}`);
  }
};

// get minimun details for Resale property

export const getResaleProjectsSummary = async (limit = 10, offset = 0) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
        pd.project_name,
        pd.city,
        pd.locality,
        p.expected_price AS price,
        pd.built_up_area,
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

      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      WHERE pd.transaction_types = $1

      GROUP BY p.id, pd.project_name, pd.city, pd.locality, pd.built_up_area,
               d.name, pc.name, psc.name

      ORDER BY p.id DESC
      LIMIT $2 OFFSET $3
    `,
      ["Resale", limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch resale property summaries:", error);
    throw new Error(
      `Failed to fetch resale property summaries: ${error.message}`
    );
  }
};

// ready to move property with minimum details
export const getReadyToMoveProjectsSummary = async (limit = 10, offset = 0) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
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

      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      WHERE p.possession_status = $1

      GROUP BY 
        p.id, pd.project_name, pd.location, pd.city, pd.locality, pd.super_built_up_area,
        pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
        d.id, d.name, pc.name, psc.name, p.price_per_sqft

      ORDER BY p.id DESC
      LIMIT $2 OFFSET $3
    `,
      ["Ready to Move", limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch ready-to-move project summaries:", error);
    throw new Error(
      `Failed to fetch ready-to-move project summaries: ${error.message}`
    );
  }
};

//  get the property which is in between 1cr to 2cr
export const getPropertiesInPriceRangeSummaryOnetotwo = async (
  limit = 10,
  offset = 0
) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT 
          p.id,
          p.title,
          pd.project_name,
          pd.city,
          pd.locality,
          p.expected_price AS price,
          pd.built_up_area,
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
        ) AS is_featured
        FROM property p
        LEFT JOIN property_details pd ON pd.property_id = p.id
        LEFT JOIN developer d ON p.developer_id = d.id
        LEFT JOIN property_category pc ON p.category_id = pc.id
        LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
        WHERE p.expected_price BETWEEN $1 AND $2
        ORDER BY p.id DESC
        LIMIT $3 OFFSET $4
      `,
      [10000000, 20000000, limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch properties in price range:", error);
    throw new Error(
      `Failed to fetch properties in price range: ${error.message}`
    );
  }
};

// services to get property from top project from top builder
export const getTopProjectsFromTopBuilders = async (limitBuilders = 5) => {
  try {
    const { rows } = await pool.query(
      `
      WITH top_builders AS (
        SELECT d.id AS developer_id, d.name AS developer_name, COUNT(p.id) AS property_count
        FROM developer d
        JOIN property p ON p.developer_id = d.id
        GROUP BY d.id
        ORDER BY property_count DESC
        LIMIT $1
      )
      SELECT 
        p.id,
        p.title,
        pd.project_name,
        pd.city,
        pd.locality,
        p.expected_price AS price,
        pd.built_up_area,
        d.id AS developer_id,
        d.name AS developer_name,
        pc.name AS category_name,
        psc.name AS subcategory_name,
        (
          SELECT pi.image_url
          FROM property_images pi
          WHERE pi.property_id = p.id
          ORDER BY pi.id ASC
          LIMIT 1
        ) AS primary_image,
        EXISTS (
          SELECT 1 FROM featured_properties fp 
          WHERE fp.property_id = p.id
        ) AS is_featured,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'bhk_type', config.bhk_type,
              'bedrooms', config.bedrooms,
              'bathrooms', config.bathrooms,
              'super_built_up_area', config.super_built_up_area,
              'carpet_area', config.carpet_area,
              'balconies', config.balconies
            )
          ) FILTER (WHERE config.id IS NOT NULL), '[]'
        ) AS configurations
      FROM property p
      JOIN top_builders tb ON p.developer_id = tb.developer_id
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id
      WHERE p.id IN (
        SELECT DISTINCT ON (p2.developer_id) p2.id
        FROM property p2
        WHERE p2.developer_id IN (SELECT developer_id FROM top_builders)
        ORDER BY p2.developer_id, p2.id DESC
      )
      GROUP BY p.id, pd.project_name, pd.city, pd.locality, pd.built_up_area,
               d.id, d.name, pc.name, psc.name
      ORDER BY p.id DESC;
    `,
      [limitBuilders]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch top projects from top builders:", error);
    throw new Error(`Failed to fetch top projects: ${error.message}`);
  }
};

// services for project gallary

export const getLatestPropertiesWithImages = async (limit = 5) => {
  try {
    const { rows: properties } = await pool.query(
      `
        SELECT 
          p.id,
          p.title,
          p.expected_price AS price,
          pd.project_name,
          pd.city,
          pd.locality,
            EXISTS (
          SELECT 1 FROM featured_properties fp 
          WHERE fp.property_id = p.id
        ) AS is_featured
        FROM property p
        LEFT JOIN property_details pd ON pd.property_id = p.id
        ORDER BY p.id DESC
        LIMIT $1
      `,
      [limit]
    );

    // Collect all property IDs
    const propertyIds = properties.map((p) => p.id);

    // Fetch all images in one query
    const { rows: allImages } = await pool.query(
      `
        SELECT id, property_id, image_url
        FROM property_images
        WHERE property_id = ANY($1::int[])
        ORDER BY id ASC
      `,
      [propertyIds]
    );

    // Attach images to each property
    const propertiesWithImages = properties.map((property) => ({
      ...property,
      images: allImages.filter((img) => img.property_id === property.id),
    }));

    return propertiesWithImages;
  } catch (error) {
    console.error("Failed to fetch latest properties with images:", error);
    throw new Error(`Fetch error: ${error.message}`);
  }
};

//  Get all localities with property count
export async function getAllLocalitiesWithCount() {
  const result = await pool.query(`
    SELECT locality, COUNT(*) AS property_count
    FROM property_details
    WHERE locality IS NOT NULL AND locality <> ''
    GROUP BY locality
    ORDER BY property_count DESC
  `);
  return result.rows;
}

//  Get properties in a specific locality
export const getPropertiesByLocality = async (
  localityName,
  limit = 10,
  offset = 0
) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
        pd.project_name,
        pd.city,
        pd.locality,
        p.expected_price AS price,
        pd.built_up_area,
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
              'bhk_type', config.bhk_type,
              'bedrooms', config.bedrooms,
              'bathrooms', config.bathrooms,
              'super_built_up_area', config.super_built_up_area,
              'carpet_area', config.carpet_area,
              'balconies', config.balconies
            )
          ) FILTER (WHERE config.id IS NOT NULL), '[]'
        ) AS configurations
      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id
      WHERE pd.locality ILIKE $1
      GROUP BY p.id, pd.project_name, pd.city, pd.locality, pd.built_up_area,
               d.name, pc.name, psc.name
      ORDER BY p.id DESC
      LIMIT $2 OFFSET $3
    `,
      [localityName, limit, offset]
    );

    return rows;
  } catch (error) {
    console.error("Failed to fetch properties by locality:", error);
    throw new Error(`Failed to fetch properties by locality: ${error.message}`);
  }
};

// get property by developer id
export const getPropertiesByDeveloperId = async (
  developerId,
  limit = 10,
  offset = 0
) => {
  const query = `
    SELECT 
      p.id,
      p.title,
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
      pd.available_from,
      d.name AS developer_name,
      d.developer_logo,
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
        json_agg(DISTINCT jsonb_build_object(
          'id', config.id,
          'bhk_type', config.bhk_type,
          'bedrooms', config.bedrooms,
          'bathrooms', config.bathrooms,
          'super_built_up_area', config.super_built_up_area,
          'carpet_area', config.carpet_area,
          'balconies', config.balconies
        )) FILTER (WHERE config.id IS NOT NULL), '[]'
      ) AS configurations

    FROM property p
    LEFT JOIN property_details pd ON p.id = pd.property_id
    LEFT JOIN developer d ON p.developer_id = d.id
    LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
    LEFT JOIN property_configurations config ON config.property_id = p.id

    WHERE d.id = $3

    GROUP BY p.id, pd.project_name, pd.location, pd.locality, pd.city, pd.super_built_up_area,
             pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status, pd.available_from,
             d.name, d.developer_logo, psc.name

    ORDER BY p.id DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset, developerId]);
  return result.rows;
};

// a services to get the popular option

export async function getPopularSearchOptions() {
  try {
    const { rows } = await pool.query(`
      SELECT 
      pd.bedrooms,
      p.property_type,
      pd.city,
      COUNT(*) AS total
    FROM 
      property p
    JOIN 
      property_details pd ON p.id = pd.property_id
    WHERE 
      p.transaction_type ILIKE 'sale'
      AND pd.city IS NOT NULL
      AND p.property_type IS NOT NULL
      AND pd.bedrooms IS NOT NULL
    GROUP BY 
      pd.bedrooms, p.property_type, pd.city
    ORDER BY total DESC
    LIMIT 20;
    `);

    return rows;
  } catch (err) {
    console.error("Error in getPopularSearchOptions:", err);
    throw err;
  }
}
// services for get only old project
export async function getOldProjects(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
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
        pd.available_from,
        d.id AS developer_id,
        d.name AS developer_name,
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

      FROM property p
      LEFT JOIN property_details pd ON pd.property_id = p.id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      LEFT JOIN property_configurations config ON config.property_id = p.id

      WHERE pd.property_status = 'inactive'

      GROUP BY p.id, pd.project_name, pd.location, pd.locality, pd.city, pd.super_built_up_area,
               pd.carpet_area, pd.bedrooms, pd.bathrooms, pd.balconies, pd.furnished_status,
               pd.available_from, d.id, d.name, psc.name, p.price_per_sqft

      ORDER BY p.id DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    return result.rows;
  } catch (error) {
    console.error("Error getting old/inactive project data:", error);
    throw new Error(`Failed to get old projects: ${error.message}`);
  }
}
