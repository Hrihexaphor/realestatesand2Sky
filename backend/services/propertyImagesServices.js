import pool from '../config/db.js';
export async function getPropertiesWithImages() {
  const query = `
    SELECT 
      p.id AS property_id,
      p.title,
      pi.id AS image_id,
      pi.image_url,
      pi.is_primary
    FROM property p
    JOIN property_images pi ON pi.property_id = p.id
    ORDER BY p.id DESC, pi.id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
}

// set primary images
export async function setPrimaryImage(propertyId, imageId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step 1: Set all images of the property to is_primary = false
    await client.query(
      `UPDATE property_images SET is_primary = false WHERE property_id = $1`,
      [propertyId]
    );

    // Step 2: Set selected image to is_primary = true
    await client.query(
      `UPDATE property_images SET is_primary = true WHERE id = $1 AND property_id = $2`,
      [imageId, propertyId]
    );

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error setting primary image:", error);
    throw error;
  } finally {
    client.release();
  }
}
