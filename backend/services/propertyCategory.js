import pool from '../config/db.js';

// Add Property Category
export async function addPropertyCategory(name) {
  const result = await pool.query(
    'INSERT INTO property_category (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

// Get All Property Categories
export async function getAllPropertyCategories() {
  const result = await pool.query(
    'SELECT * FROM property_category ORDER BY name'
  );
  return result.rows;
}
// Update category
export async function updateCategory(id, name) {
    const result = await pool.query(
      'UPDATE property_category SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }
  
  // Delete category
  export async function deleteCategory(id) {
    const result = await pool.query(
      'DELETE FROM property_category WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }