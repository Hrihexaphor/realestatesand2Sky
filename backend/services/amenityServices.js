import pool from '../config/db.js'
export async function insertAminity(name,icon){
    const result = await pool.query(`INSERT INTO amenity (name,icon) VALUES ($1, $2) RETURNING *`, [name,icon]);
    return result.rows[0]
}   
// Fetch all amenities
export const getAllAmenities = async () => {
    const result = await pool.query('SELECT * FROM amenity ORDER BY id ASC');
    return result.rows;
  };
// Update an amenity by ID
export const updateAmenity = async (id, name, icon) => {
    const result = await pool.query(
      'UPDATE amenity SET name = $1, icon = $2 WHERE id = $3 RETURNING *',
      [name, icon, id]
    );
    return result.rows[0];
  };

  // Delete an amenity by ID
export const deleteAmenity = async (id) => {
    const result = await pool.query('DELETE FROM amenity WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };