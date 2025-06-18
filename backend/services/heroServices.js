import pool from "../config/db.js";

// ✅ Create a new hero image (PostgreSQL uses $1)
export async function createHeroImage(imageUrl) {
  const result = await pool.query(
    `INSERT INTO hero_sections (image_url) VALUES ($1) RETURNING *`,
    [imageUrl]
  );
  return result.rows[0];
}

// ✅ Get all hero images
export async function getAllHeroImages() {
  const result = await pool.query(
    `SELECT * FROM hero_sections ORDER BY created_at DESC`
  );
  return result.rows;
}

// ✅ Delete a hero image by ID
export async function deleteHeroImage(id) {
  const result = await pool.query(`DELETE FROM hero_sections WHERE id = $1`, [
    id,
  ]);
  return result.rowCount > 0;
}
