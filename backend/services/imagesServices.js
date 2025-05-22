// ImageService.js

// Function to set an image as the main image
export async function setImageAsMain(imageId, propertyId) {
  try {
    // Begin a transaction
    await pool.query('BEGIN');
    
    // First, remove main status from all images for this property
    await pool.query(`
      UPDATE property_images 
      SET is_main = false 
      WHERE property_id = $1`,
      [propertyId]
    );
    
    // Then set the selected image as main
    await pool.query(`
      UPDATE property_images 
      SET is_main = true 
      WHERE id = $1 AND property_id = $2`,
      [imageId, propertyId]
    );
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    // Get updated list of images with their statuses
    const result = await pool.query(`
      SELECT id, image_url, is_primary, is_main 
      FROM property_images 
      WHERE property_id = $1 
      ORDER BY is_main DESC, is_primary DESC, id ASC`,
      [propertyId]
    );
    
    return result.rows;
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error("Error setting main image:", error);
    throw new Error(`Failed to set main image: ${error.message}`);
  }
}