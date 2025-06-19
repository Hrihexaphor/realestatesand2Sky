import pool from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false, // STARTTLS (Brevo) - don't use SSL here
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
/**
 * Insert a new property into the database
 * @param {Object} property - The property basic information
 * @returns {Object} - The inserted property
 */

export async function insertProperty(property) {
  const {
    title,
    property_type,
    transaction_type,
    possession_status,
    expected_price,
    price_per_sqft,
    developer_id,
    category_id, // Add category_id to the function parameters
  } = property;
  const subcategory_id = property_type;
  try {
    const result = await pool.query(
      `
      INSERT INTO property (
        title, 
        property_type, 
        transaction_type, 
        possession_status, 
        expected_price, 
        price_per_sqft, 
        developer_id,
        category_id,
         subcategory_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *`,
      [
        title,
        property_type,
        transaction_type,
        possession_status,
        expected_price,
        price_per_sqft,
        developer_id,
        category_id,
        subcategory_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting property:", error);
    throw new Error(`Failed to insert property: ${error.message}`);
  }
}
/**
 * Insert property details into the database
 * @param {number} property_id - The ID of the property
 * @param {Object} details - The property details
 */
export async function insertPropertyDetails(property_id, details) {
  try {
    const fields = [
      "project_area",
      "num_of_units",
      "project_rera_id",
      "city",
      "location",
      "locality",
      "bedrooms",
      "balconies",
      "bathrooms",
      "total_floors",
      "facing",
      "furnished_status",
      "covered_parking",
      "plot_area",
      "built_up_area",
      "carpet_area",
      "plot_length",
      "description",
      "about_location",
      "plot_breadth",
      "project_name",
      "floor",
      "no_of_flat",
      "overlooking",
      "booking_amount",
      "no_of_tower",
      "maintenance_charge",
      "transaction_types",
      "available_from",
      "youtube_link",
      "no_of_house",
      "super_built_up_area",
      "corner_plot",
      "other_rooms",
      "rental_return",
      "property_status",
    ];

    // Filter out undefined fields
    const existingFields = fields.filter(
      (field) => details[field] !== undefined && details[field] !== null
    );

    if (existingFields.length === 0) {
      console.log("No property details to insert");
      return;
    }

    const values = existingFields.map((f) => details[f]);
    const placeholders = values.map((_, i) => `$${i + 2}`).join(", ");

    const query = `INSERT INTO property_details (property_id, ${existingFields.join(
      ", "
    )}) VALUES ($1, ${placeholders})`;
    await pool.query(query, [property_id, ...values]);
  } catch (error) {
    console.error("Error inserting property details:", error);
    throw new Error(`Failed to insert property details: ${error.message}`);
  }
}
export async function insertPropertyConfigurations(
  property_id,
  configurations
) {
  try {
    if (!configurations || configurations.length === 0) {
      return;
    }

    for (let config of configurations) {
      await pool.query(
        `
        INSERT INTO property_configurations (
          property_id, bhk_type, bedrooms, bathrooms, 
          super_built_up_area, carpet_area, balconies, file_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          property_id,
          config.bhk_type,
          config.bedrooms,
          config.bathrooms,
          config.super_built_up_area,
          config.carpet_area,
          config.balconies,
          config.file_url || null, // Optional: pass null if not provided
        ]
      );
    }
  } catch (error) {
    console.error("Error inserting property configurations:", error);
    throw new Error(
      `Failed to insert property configurations: ${error.message}`
    );
  }
}
/**
 * Insert property location into the database
 * @param {number} property_id - The ID of the property
 * @param {Object} location - The property location data
 */
export async function insertLocation(property_id, location) {
  try {
    const { latitude, longitude, address } = location;

    if (!latitude || !longitude) {
      throw new Error("Latitude and longitude are required");
    }

    await pool.query(
      `
     INSERT INTO property_location (property_id, latitude, longitude, address)
     VALUES ($1, $2, $3, $4)`,
      [property_id, latitude, longitude, address || ""]
    );
  } catch (error) {
    console.error("Error inserting location:", error);
    throw new Error(`Failed to insert location: ${error.message}`);
  }
}

/**
 * Insert property images into the database
 * @param {number} property_id - The ID of the property
 * @param {Array} images - The array of image objects
 */
export async function insertImages(property_id, images) {
  try {
    if (!images || images.length === 0) {
      return;
    }

    // If there are images, set the first one as primary if none is set
    let hasPrimary = images.some((img) => img.is_primary);
    if (!hasPrimary && images.length > 0) {
      images[0].is_primary = true;
    }

    for (let img of images) {
      await pool.query(
        `
       INSERT INTO property_images (property_id, image_url, is_primary)
       VALUES ($1, $2, $3)`,
        [property_id, img.image_url, img.is_primary || false]
      );
    }
  } catch (error) {
    console.error("Error inserting images:", error);
    throw new Error(`Failed to insert images: ${error.message}`);
  }
}

export async function updateImages(property_id, newImages, existingImageIds) {
  try {

    if (existingImageIds.length > 0) {
      const dltQuery = `DELETE FROM property_images WHERE property_id = $1 AND id NOT IN (${existingImageIds.map((_, i) => `$${i + 2}`).join(', ')})`
      await pool.query(dltQuery,[property_id, ...existingImageIds]);
    } else {
      await pool.query(`DELETE FROM property_images WHERE property_id = $1`, [property_id]);
    }

     if(newImages.length < 1) return;

    const values = [];
    const params = [];

    newImages.forEach((img, i) => {
      const idx = i * 3;
      values.push(`($${idx + 1}, $${idx + 2}, $${idx + 3})`);
      params.push(property_id, img.image_url, img.is_primary || false);
    });

    console.log("Values to insert:", values, params);

    const query = `INSERT INTO property_images (property_id, image_url, is_primary) VALUES ${values.join(', ')}`;

    await pool.query(query, params);

  } catch (error) {
    console.error("Error updating images:", error);
    throw new Error(`Failed to updating images: ${error.message}`);
  }
}

export async function updateDocuments(property_id, newDocuments, existingDocumentIds) {
  try {
    if (existingDocumentIds.length > 0) {
      const dltQuery = `DELETE FROM property_documents WHERE property_id = $1 AND id NOT IN (${existingDocumentIds.map((_, i) => `$${i + 2}`).join(', ')})`
      await pool.query(dltQuery,[property_id, ...existingDocumentIds]);
    } else {
      await pool.query(`DELETE FROM property_documents WHERE property_id = $1`, [property_id]);
    }

    if(newDocuments.length < 1) return;

    const values = [];
    const params = [];
    newDocuments.forEach((doc, i) => {
      const idx = i * 3;
      values.push(`($${idx + 1}, $${idx + 2}, $${idx + 3})`);
      params.push(property_id, doc.type || null, doc.file_url || null);
    });

    console.log("Values to insert:", values, params);

    const query = `INSERT INTO property_documents (property_id, type, file_url) VALUES ${values.join(', ')}`;
    await pool.query(query, params);
  } catch (error) {
    console.error("Error deleting existing documents:", error);
    throw new Error(`Failed to delete existing documents: ${error.message}`);
  }

}

// insert property documents
export async function insertPropertyDocuments(property_id, documents) {
  try {
    if (!documents || documents.length === 0) {
      return;
    }

    for (let doc of documents) {
      await pool.query(
        `
        INSERT INTO property_documents (property_id, type, file_url)
        VALUES ($1, $2, $3)
      `,
        [property_id, doc.type || null, doc.file_url || null]
      );
    }
  } catch (error) {
    console.error("Error inserting property documents:", error);
    throw new Error(`Failed to insert documents: ${error.message}`);
  }
}

/**
 * Insert property nearest places into the database
 * @param {number} property_id - The ID of the property
 * @param {Array} nearest_list - The array of nearest place objects
 */
export async function insertNearestTo(property_id, nearest_list) {
  try {
    if (!nearest_list || nearest_list.length === 0) {
      return;
    }

    for (let n of nearest_list) {
      if (!n.nearest_to_id || !n.distance_km) {
        console.log("Skipping invalid nearest_to entry:", n);
        continue;
      }

      await pool.query(
        `
       INSERT INTO property_nearest_to (property_id, nearest_to_id, distance_km)
       VALUES ($1, $2, $3)`,
        [property_id, n.nearest_to_id, n.distance_km]
      );
    }
  } catch (error) {
    console.error("Error inserting nearest places:", error);
    throw new Error(`Failed to insert nearest places: ${error.message}`);
  }
}

/**
 * Insert property amenities into the database
 * @param {number} property_id - The ID of the property
 * @param {Array} amenities - The array of amenity IDs
 */
export async function insertAmenities(property_id, amenities) {
  try {
    if (!amenities || amenities.length === 0) {
      return;
    }

    for (let amenity_id of amenities) {
      await pool.query(
        `
       INSERT INTO property_amenity (property_id, amenity_id)
       VALUES ($1, $2)`,
        [property_id, amenity_id]
      );
    }
  } catch (error) {
    console.error("Error inserting amenities:", error);
    throw new Error(`Failed to insert amenities: ${error.message}`);
  }
}
// keyfeature services
export async function insertKeyfeature(property_id, keyfeature) {
  try {
    if (!keyfeature || keyfeature.length === 0) {
      return;
    }

    for (let key_feature_id of keyfeature) {
      await pool.query(
        `
       INSERT INTO property_key_feature(property_id, key_feature_id)
       VALUES ($1, $2)`,
        [property_id, key_feature_id]
      );
    }
  } catch (error) {
    console.error("Error inserting keyfeature:", error);
    throw new Error(`Failed to insert keyfeature: ${error.message}`);
  }
}
/**
 * Get all properties from the database
 * @returns {Array} - List of properties
 */
export async function getAllProperties() {
  try {
    const result = await pool.query(`
      SELECT 
        p.*, 
        pd.*, 
        pl.latitude, pl.longitude, pl.address,
        d.id AS developer_id, 
        d.name AS developer_name, 
        d.developer_logo,
        d.company_name AS developer_company_name,
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
        ) AS documents,

        (
          SELECT json_agg(json_build_object('id', kf.id, 'name', kf.name))
          FROM property_key_feature pk
          JOIN key_feature kf ON pk.key_feature_id = kf.id
          WHERE pk.property_id = p.id
        ) AS key_features,
        
        (
          SELECT json_agg(json_build_object(
            'id', pc.id, 
            'bhk_type', pc.bhk_type, 
            'bedrooms', pc.bedrooms, 
            'bathrooms', pc.bathrooms, 
            'super_built_up_area', pc.super_built_up_area, 
            'carpet_area', pc.carpet_area, 
            'balconies', pc.balconies, 
            'file_url', pc.file_url
          ))
          FROM property_configurations pc
          WHERE pc.property_id = p.id
        ) AS bhk_configurations
      FROM property p
      LEFT JOIN property_details pd ON p.id = pd.property_id
      LEFT JOIN property_location pl ON p.id = pl.property_id
      LEFT JOIN developer d ON p.developer_id = d.id
      LEFT JOIN property_category pc ON p.category_id = pc.id
      LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
      ORDER BY p.id DESC
    `);

    // Ensure arrays are never null for each property
    return result.rows.map((property) => ({
      ...property,
      images: property.images || [],
      documents: property.documents || [],
      amenities: property.amenities || [],
      key_features: property.key_features || [],
      nearest_to: property.nearest_to || [],
      bhk_configurations: property.bhk_configurations || [],
    }));
  } catch (error) {
    console.error("Error getting all properties:", error);
    throw new Error(`Failed to get properties: ${error.message}`);
  }
}

/**
 * Update a property by ID
 * @param {number} id - The property ID
 * @param {Object} data - The updated property data
 * @returns {Object} - The updated property
 */
export async function updatePropertyById(id, data) {
  try {
    const {
      basic,
      details,
      location,
      nearest_to,
      amenities,
      keyfeature,
      bhk_configurations,
    } = data;

    // 1. Update basic property info
    if (basic) {
      const fields = Object.keys(basic);
      const values = Object.values(basic);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(", ");
      await pool.query(`UPDATE property SET ${setClause} WHERE id = $1`, [
        id,
        ...values,
      ]);
    }

    // 2. Update property details
    if (details) {
      const fields = Object.keys(details);
      const values = Object.values(details);
      const placeholders = fields.map((_, idx) => `$${idx + 2}`);
      const setClause = fields
        .map((field, idx) => `${field} = $${idx + 2}`)
        .join(", ");

      const check = await pool.query(
        `SELECT 1 FROM property_details WHERE property_id = $1`,
        [id]
      );
      if (check.rowCount > 0) {
        await pool.query(
          `UPDATE property_details SET ${setClause} WHERE property_id = $1`,
          [id, ...values]
        );
      } else {
        await pool.query(
          `INSERT INTO property_details (property_id, ${fields.join(
            ", "
          )}) VALUES ($1, ${placeholders.join(", ")})`,
          [id, ...values]
        );
      }
    }

    // 3. Update location
    if (location) {
      const { latitude, longitude, address } = location;
      await pool.query(
        `UPDATE property_location SET latitude = $2, longitude = $3, address = $4 WHERE property_id = $1`,
        [id, latitude, longitude, address]
      );
    }

    // 4. Update amenities
    if (Array.isArray(amenities)) {
      await pool.query(`DELETE FROM property_amenity WHERE property_id = $1`, [
        id,
      ]);
      for (const amenityId of amenities) {
        await pool.query(
          `INSERT INTO property_amenity (property_id, amenity_id) VALUES ($1, $2)`,
          [id, amenityId]
        );
      }
    }

    // 5. Update key features
    if (Array.isArray(keyfeature)) {
      await pool.query(
        `DELETE FROM property_key_feature WHERE property_id = $1`,
        [id]
      );
      for (const featureId of keyfeature) {
        await pool.query(
          `INSERT INTO property_key_feature (property_id, key_feature_id) VALUES ($1, $2)`,
          [id, featureId]
        );
      }
    }

    // 6. Update nearest_to
    if (Array.isArray(nearest_to)) {
      await pool.query(
        `DELETE FROM property_nearest_to WHERE property_id = $1`,
        [id]
      );
      for (const { nearest_to_id, distance_km } of nearest_to) {
        await pool.query(
          `INSERT INTO property_nearest_to (property_id, nearest_to_id, distance_km) VALUES ($1, $2, $3)`,
          [id, nearest_to_id, distance_km]
        );
      }
    }
    // 7. Update configurations
    if (Array.isArray(bhk_configurations)) {
      await pool.query(
        `DELETE FROM property_configurations WHERE property_id = $1`,
        [id]
      );
      for (const config of bhk_configurations) {
        await pool.query(
          `INSERT INTO property_configurations (property_id, bhk_type, bedrooms, bathrooms, super_built_up_area, carpet_area, balconies, file_name) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            id,
            config.bhk_type,
            config.bedrooms,
            config.bathrooms,
            config.super_built_up_area,
            config.carpet_area,
            config.balconies,
            config.file_name,
          ]
        );
      }
    }
    return { success: true, message: "Property updated successfully" };
  } catch (err) {
    console.error("Error updating property:", err);
    throw err;
  }
}

/**
 * Delete a property by ID
 * @param {number} id - The property ID
 * @returns {boolean} - Success status
 */
export async function deletePropertyById(id) {
  try {
    // Check if property exists
    const property = await pool.query(`SELECT id FROM property WHERE id = $1`, [
      id,
    ]);
    if (property.rows.length === 0) {
      return false;
    }

    // Use transaction to ensure atomicity
    await pool.query("BEGIN");

    // Delete related records in this specific order to avoid foreign key constraint errors
    await pool.query(`DELETE FROM property_amenity WHERE property_id = $1`, [
      id,
    ]);
    await pool.query(
      `DELETE FROM property_key_feature WHERE property_id = $1`,
      [id]
    );
    await pool.query(`DELETE FROM property_nearest_to WHERE property_id = $1`, [
      id,
    ]);
    await pool.query(`DELETE FROM property_images WHERE property_id = $1`, [
      id,
    ]);
    await pool.query(`DELETE FROM property_location WHERE property_id = $1`, [
      id,
    ]);
    await pool.query(`DELETE FROM property_details WHERE property_id = $1`, [
      id,
    ]);
    await pool.query(`DELETE FROM property WHERE id = $1`, [id]);

    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error deleting property:", error);
    throw new Error(`Failed to delete property: ${error.message}`);
  }
}
// search property function

// Service file (propertyService.js)
// Updated propertyService.js with corrected table references
export const searchProperty = async (filters) => {
  const {
    property_type,
    bhk,
    min_price,
    max_price,
    city,
    locality,
    furnished_status,
    possession_status,
  } = filters;

  // Join the property and property_details tables
  let query = `
    SELECT p.*, d.*
    FROM property p
    JOIN property_details d ON p.id = d.property_id
    WHERE 1=1
  `;

  let params = [];
  let paramIndex = 1;

  // Filter by property type (likely in property table)
  if (property_type) {
    query += ` AND p.property_type = $${paramIndex++}`;
    params.push(property_type);
  }

  // Filter by BHK (bedrooms - likely in property_details table)
  if (bhk) {
    query += ` AND d.bedrooms = $${paramIndex++}`;
    params.push(bhk);
  }

  // Filter by price range (expected_price - likely in property table)
  if (min_price) {
    query += ` AND p.expected_price >= $${paramIndex++}`;
    params.push(min_price);
  }

  if (max_price) {
    query += ` AND p.expected_price <= $${paramIndex++}`;
    params.push(max_price);
  }

  // Filter by city (in property_details table)
  if (city) {
    query += ` AND d.city ILIKE $${paramIndex++}`;
    params.push(`%${city.trim()}%`);
  }

  // Filter by locality (in property_details table, not property)
  if (locality) {
    query += ` AND d.locality ILIKE $${paramIndex++}`; // Changed from p.locality to d.locality
    params.push(`%${locality.trim()}%`);
  }

  // Filter by furnished status (check which table it's in)
  if (furnished_status) {
    // Assuming it's in property table, but change if necessary
    query += ` AND p.furnished_status = $${paramIndex++}`;
    params.push(furnished_status);
  }

  // Filter by possession status (check which table it's in)
  if (possession_status) {
    // Assuming it's in property table, but change if necessary
    query += ` AND p.possession_status = $${paramIndex++}`;
    params.push(possession_status);
  }

  // Add sorting options
  const sortBy = filters.sort_by || "expected_price";
  const sortOrder = filters.sort_order || "ASC";

  // Determine if sort column is in property or property_details table
  const propertyColumns = [
    "id",
    "expected_price",
    "property_type",
    "possession_status",
    "furnished_status",
  ];
  const detailsColumns = [
    "bedrooms",
    "bathrooms",
    "built_up_area",
    "city",
    "locality",
  ];

  let sanitizedSortBy = "p.expected_price"; // default

  if (propertyColumns.includes(sortBy)) {
    sanitizedSortBy = `p.${sortBy}`;
  } else if (detailsColumns.includes(sortBy)) {
    sanitizedSortBy = `d.${sortBy}`;
  }

  const validSortOrders = ["ASC", "DESC"];
  const sanitizedSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
    ? sortOrder
    : "ASC";

  query += ` ORDER BY ${sanitizedSortBy} ${sanitizedSortOrder}`;

  // Add pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;

  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  try {
    const { rows } = await pool.query(query, params);

    // Get total count for pagination
    const countQuery = query
      .split("ORDER BY")[0]
      .replace("SELECT p.*, d.*", "SELECT COUNT(*)");
    const countParams = params.slice(0, -2); // Remove LIMIT and OFFSET params
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      properties: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    console.error("Database query error:", err);
    throw new Error("Failed to fetch properties");
  }
};
//  get properyt by id function

export const getpropertyById = async (propertyId) => {
  try {
    // 1. Basic + developer + category + subcategory
    const { rows: basicRows } = await pool.query(
      `SELECT 
          p.*, 
          d.name AS developer_name,
           d.developer_logo,
          d.company_name AS developer_company_name,
          c.name AS property_category_name,
          s.name AS property_subcategory_name
        FROM property p
        LEFT JOIN developer d ON p.developer_id = d.id
        LEFT JOIN property_category c ON p.category_id = c.id
        LEFT JOIN property_subcategory s ON p.subcategory_id = s.id
        WHERE p.id = $1`,
      [propertyId]
    );
    if (basicRows.length === 0) return null;
    const basic = basicRows[0];

    // 2. Details
    const { rows: detailsRows } = await pool.query(
      `SELECT * FROM property_details WHERE property_id = $1`,
      [propertyId]
    );

    // property configurtion
    const { rows: bhkRows } = await pool.query(
      `SELECT id, bhk_type, bedrooms, bathrooms, super_built_up_area, carpet_area, balconies,file_url
        FROM property_configurations
        WHERE property_id = $1`,
      [propertyId]
    );
    // 3. Location
    const { rows: locationRows } = await pool.query(
      `SELECT latitude, longitude, address FROM property_location WHERE property_id = $1`,
      [propertyId]
    );

    // 4. Images
    const { rows: imageRows } = await pool.query(
      `SELECT * FROM property_images WHERE property_id = $1`,
      [propertyId]
    );

    // 5. Documents
    const { rows: documentRows } = await pool.query(
      `SELECT id, type, file_url FROM property_documents WHERE property_id = $1`,
      [propertyId]
    );
    // 6. AmenitiesAdd commentMore actions
    const { rows: amenitiesRows } = await pool.query(
      `SELECT a.id, a.name, a.icon
         FROM property_amenity pa
         JOIN amenity a ON pa.amenity_id = a.id
         WHERE pa.property_id = $1`,
      [propertyId]
    );
    // 7.key feature
    const { rows: keyfeatureRows } = await pool.query(
      `SELECT kf.id, kf.name, kf.description
   FROM property_key_feature pk
   JOIN key_feature kf ON pk.key_feature_id = kf.id
   WHERE pk.property_id = $1`,
      [propertyId]
    );
    // 8. Nearest To
    const { rows: nearestRows } = await pool.query(
      `SELECT nt.id, nt.name, pnt.distance_km
         FROM property_nearest_to pnt
         JOIN nearest_to nt ON pnt.nearest_to_id = nt.id
         WHERE pnt.property_id = $1`,
      [propertyId]
    );
    // 9. FAQsAdd commentMore actions
    const { rows: faqRows } = await pool.query(
      `SELECT id, question, answer FROM faqs WHERE property_id = $1 ORDER BY created_at ASC`,
      [propertyId]
    );
    return {
      basic,
      details: detailsRows[0] || null,
      location: locationRows[0] || null,
      images: imageRows,
      documents: documentRows,
      amenities: amenitiesRows,
      keyfeature: keyfeatureRows,
      nearest_to: nearestRows,
      faqs: faqRows,
      bhk_configurations: bhkRows,
    };
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw new Error(`Failed to fetch property by ID: ${error.message}`);
  }
};

// ready to move property services

export const getReadyToMoveProperties = async () => {
  try {
    const { rows: propertyRows } = await pool.query(
      `
    SELECT 
      p.*, 
      d.name AS developer_name, d.company_name AS developer_company_name,
      pc.name AS property_category_name,
      psc.name AS property_subcategory_name
    FROM property p
    LEFT JOIN developer d ON p.developer_id = d.id
    LEFT JOIN property_category pc ON p.category_id = pc.id
    LEFT JOIN property_subcategory psc ON p.subcategory_id = psc.id
    WHERE p.possession_status = $1
    ORDER BY p.id DESC
  `,
      ["Ready to Move"]
    );

    const readyProperties = [];

    for (const property of propertyRows) {
      const id = property.id;

      const [
        { rows: detailsRows },
        { rows: imagesRows },
        { rows: locationRows },
        { rows: nearestRows },
        { rows: amenitiesRows },
        { rows: documentRows },
      ] = await Promise.all([
        pool.query(`SELECT * FROM property_details WHERE property_id = $1`, [
          id,
        ]),
        pool.query(`SELECT * FROM property_images WHERE property_id = $1`, [
          id,
        ]),
        pool.query(
          `SELECT latitude, longitude, address FROM property_location WHERE property_id = $1`,
          [id]
        ),
        pool.query(
          `SELECT nt.id, nt.name, pnt.distance_km
                  FROM property_nearest_to pnt
                  JOIN nearest_to nt ON pnt.nearest_to_id = nt.id
                  WHERE pnt.property_id = $1`,
          [id]
        ),
        pool.query(
          `SELECT a.id, a.name, a.icon
                  FROM property_amenity pa
                  JOIN amenity a ON pa.amenity_id = a.id
                  WHERE pa.property_id = $1`,
          [id]
        ),
        pool.query(
          `SELECT id, type, file_url FROM property_documents WHERE property_id = $1`,
          [id]
        ),
      ]);

      readyProperties.push({
        basic: property,
        details: detailsRows[0] || null,
        location: locationRows[0] || null,
        images: imagesRows,
        documents: documentRows,
        amenities: amenitiesRows,
        nearest_to: nearestRows,
      });
    }

    return readyProperties;
  } catch (error) {
    console.error("Error fetching ready to move property:", error);
    throw new Error(`Failed to fetch ready to move property  ${error.message}`);
  }
};

// send a mail to all email present in the property_inquiries table

export async function sendNewPropertyEmails(property_id) {
  try {
    const [property, primaryImage, subcategory, inquiries] = await Promise.all([
      pool.query(`SELECT title, subcategory_id FROM property WHERE id = $1`, [
        property_id,
      ]),
      pool.query(
        `SELECT image_url FROM property_images WHERE property_id = $1 AND is_primary = true LIMIT 1`,
        [property_id]
      ),
      pool.query(
        `SELECT name FROM property_subcategory WHERE id = (
        SELECT subcategory_id FROM property WHERE id = $1
      )`,
        [property_id]
      ),
      pool.query(`SELECT DISTINCT name, email FROM property_inquiries`),
    ]);

    const title = property.rows[0]?.title;
    const imageUrl = primaryImage.rows[0]?.image_url || "";
    const subcategoryName = subcategory.rows[0]?.name || "Residential Houses";
    const contactNumber = "+91-1234567890";
    const instaLink = "https://instagram.com/example";
    const fbLink = "https://facebook.com/example";
    const twitterLink = "https://twitter.com/example";
    const landingPageUrl = `https://yourwebsite.com/property/${property_id}`; // Replace with your actual landing page URL

    for (let inquiry of inquiries.rows) {
      const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Property Alert</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; line-height: 1.6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <!-- Main Container Table -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <!-- Email Content Table -->
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #FFA500; background-image: linear-gradient(to bottom right, #FFA500 0%, #FF8C00 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">Hi ${inquiry.name.toUpperCase()},</h1>
              <p style="font-size: 16px; font-weight: 400; margin: 0; opacity: 0.95; font-family: Arial, Helvetica, sans-serif;">Here are some <strong>${subcategoryName}</strong> matching your budget and requirements</p>
            </td>
          </tr>

          <!-- Property Card Header -->
          <tr>
            <td style="background-color: #E8B4B8; margin: 0; padding: 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background-color: rgba(0,0,0,0.1); color: #2c3e50; padding: 20px; text-align: center; font-size: 18px; font-weight: 600; font-family: Arial, Helvetica, sans-serif;">
                    It's time to find your dream property
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Property Content -->
          <tr>
            <td style="background-color: #E8B4B8; padding: 30px 20px; text-align: center;">
              
              <!-- Property Image Container -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; min-height: 200px;">
                    ${imageUrl
          ? `<img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" border="0">`
          : `<div style="color: #6c757d; font-size: 48px; line-height: 1; font-family: Arial, sans-serif;">🏠</div>`
        }
                  </td>
                </tr>
              </table>
              
              <!-- Property Title -->
              <div style="font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 20px; font-family: Arial, Helvetica, sans-serif;">${title}</div>
              
              <!-- View Details Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td style="background-color: #34495e; border-radius: 5px;">
                    <a href="${landingPageUrl}" style="display: block; color: #ffffff; padding: 12px 30px; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, Helvetica, sans-serif;" target="_blank">View Details</a>
                  </td>
                </tr>
              </table>
              
              <!-- Social Links -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto 0 auto;">
                <tr>
                  <td style="padding: 0 7px;">
                    <a href="${fbLink}" style="display: block; width: 45px; height: 45px; border-radius: 50%; background-color: #3b5998; text-align: center; text-decoration: none;" target="_blank">
                      <span style="color: #ffffff; font-weight: bold; font-size: 18px; line-height: 45px; font-family: Arial, sans-serif;">
                        <i class="fa-brands fa-facebook-f"></i>
                      </span>
                    </a>
                  </td>
                  <td style="padding: 0 7px;">
                    <a href="${instaLink}" style="display: block; width: 45px; height: 45px; border-radius: 50%; background-color: #e6683c; text-align: center; text-decoration: none;" target="_blank">
                      <span style="color: #ffffff; font-weight: bold; font-size: 18px; line-height: 45px; font-family: Arial, sans-serif;">
                        <i class="fa-brands fa-instagram"></i>
                      </span>
                    </a>
                  </td>
                  <td style="padding: 0 7px;">
                    <a href="${twitterLink}" style="display: block; width: 45px; height: 45px; border-radius: 50%; background-color: #1da1f2; text-align: center; text-decoration: none;" target="_blank">
                      <span style="color: #ffffff; font-weight: bold; font-size: 18px; line-height: 45px; font-family: Arial, sans-serif;">
                        <i class="fa-brands fa-twitter"></i>
                      </span>
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="background-color: #ecf0f1; padding: 20px; text-align: center; color: #2c3e50; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin: 0 0 10px 0;"><strong>Need help?</strong> Contact us at <strong>${contactNumber}</strong></p>
              <p style="margin: 0;">Visit our website for more amazing properties!</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">
              <p style="margin: 0 0 10px 0;">&copy; 2025 Your Property Company. All rights reserved.</p>
              <p style="margin: 0;">You're receiving this email because you showed interest in our properties.</p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `;

      await transporter.sendMail({
        from: '"Sand2Sky" <project@sand2sky.com>',
        to: inquiry.email,
        subject: `🏠 New ${subcategoryName} Alert: ${title}`,
        html,
      });
    }

    console.log(`📧 Enhanced emails sent for property ID ${property_id}`);
    return {
      success: true,
      message: `Emails sent to ${inquiries.rows.length} recipients`,
    };
  } catch (err) {
    console.error("Failed to send property emails:", err.message);
  }
}
