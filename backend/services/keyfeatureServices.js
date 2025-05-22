import pool from '../config/db.js'

// CREATE
export async function createKeyFeature(name) {
  const result = await pool.query(
    `INSERT INTO key_feature (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

// READ ALL
export async function getAllKeyFeatures() {
  const result = await pool.query(`SELECT * FROM key_feature ORDER BY id ASC`);
  return result.rows;
}

// UPDATE
export async function updateKeyFeature(id, name) {
  const result = await pool.query(
    `UPDATE key_feature SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id]
  );
  return result.rows[0];
}

// DELETE
export async function deleteKeyFeature(id) {
  const result = await pool.query(
    `DELETE FROM key_feature WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}