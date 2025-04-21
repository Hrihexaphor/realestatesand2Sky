import pool from '../config/db.js';
// export async function subcategoryExists(name, category_id) {
//   const result = await pool.query(
//     'SELECT * FROM property_subcategory WHERE name = $1 AND category_id = $2',
//     [name, category_id]
//   );
//   return result.rows.length > 0;
// }
// Add Property Subcategory
export async function addPropertySubcategory(name, category_id) {
  const result = await pool.query(
    'INSERT INTO property_subcategory (name, category_id) VALUES ($1, $2) RETURNING *',
    [name, category_id]
  );
  return result.rows[0];
}

// Get Subcategories by Category ID
export async function getSubcategoriesByCategoryId(category_id) {
  const result = await pool.query(
    'SELECT * FROM property_subcategory WHERE category_id = $1 ORDER BY name',
    [category_id]
  );
  return result.rows;
}
// Update subcategory
export async function updateSubcategory(id, name, category_id) {
    const result = await pool.query(
      'UPDATE property_subcategory SET name = $1, category_id = $2 WHERE id = $3 RETURNING *',
      [name, category_id, id]
    );
    return result.rows[0];
  }
  
  // Delete subcategory
  export async function deleteSubcategory(id) {
    const result = await pool.query(
      'DELETE FROM property_subcategory WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
  export const getAllSubcategories = async () => {
    try {
      const result = await pool.query('SELECT * FROM property_subcategory'); // Replace 'subcategories' with your actual table name
      return result.rows;
    } catch (err) {
      console.error('Error fetching subcategories from DB:', err);
      throw new Error('Failed to fetch subcategories');
    }
  };
