import pool from "../config/db.js";
// CREATE
export async function addInteriorProject(data) {
  const { img_url, title, category, location } = data;
  const result = await pool.query(
    `INSERT INTO interior_project_content (img_url, title, category, location)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [img_url, title, category, location]
  );
  return result.rows[0];
}

// READ ALL
export async function getAllInteriorProjects() {
  const result = await pool.query(
    `SELECT * FROM interior_project_content ORDER BY id DESC`
  );
  return result.rows;
}

// UPDATE
export async function updateInteriorProject(id, data) {
  const { img_url, title, category, location } = data;
  const result = await pool.query(
    `UPDATE interior_project_content
     SET img_url = $1, title = $2, category = $3, location = $4
     WHERE id = $5 RETURNING *`,
    [img_url, title, category, location, id]
  );
  return result.rows[0];
}

// DELETE
export async function deleteInteriorProject(id) {
  await pool.query(`DELETE FROM interior_project_content WHERE id = $1`, [id]);
  return { message: "Deleted successfully" };
}
