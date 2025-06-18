import pool from "../config/db.js";

// CREATE
export async function createKeyFeature(name, description) {
  const result = await pool.query(
    `INSERT INTO key_feature (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description]
  );
  return result.rows[0];
}

// READ ALL
export async function getAllKeyFeatures() {
  const result = await pool.query(`SELECT * FROM key_feature ORDER BY id ASC`);
  return result.rows;
}

// UPDATE
export async function updateKeyFeature(id, name, description) {
  const result = await pool.query(
    `UPDATE key_feature SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id]
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
