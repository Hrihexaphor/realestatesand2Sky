import pool from '../config/db.js'

export async function createNearesTo(name){
    const result = await pool.query(`INSERT INTO nearest_to (name) VALUES ($1) RETURNING *`, [name]);
    return result.rows[0]
}
export async function getAllNearest() {
    const result = await pool.query(`SELECT * FROM nearest_to`);
    return result.rows;
}

// Update a nearest_to entry by ID
export const updateNearestTo = async (id, name) => {
    const result = await pool.query(
      'UPDATE nearest_to SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  };
  // Delete a nearest_to entry by ID
export const deleteNearestTo = async (id) => {
    const result = await pool.query('DELETE FROM nearest_to WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };