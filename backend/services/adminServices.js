import pool from '../config/db.js';
export async function findUserByEmail(email) {
    // Only select needed fields and use LIMIT 1 for optimization
    const result = await pool.query(
        `SELECT id, name, email, role, password_hash, permissions FROM admin WHERE email = $1 LIMIT 1`,
        [email]
    );
    return result.rows[0];
}

export async function createAdmin(name, email, passwordHash, role, permissions) {
  const result = await pool.query(
    `INSERT INTO admin(name, email, password_hash, role, permissions)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, passwordHash, role, permissions]
  );
  return result.rows[0];
}

export async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, name, email, role FROM admin WHERE role != 'admin' ORDER BY id DESC`
  );
  return result.rows;
}
export async function  deleteUserById(id){
     const result = await pool.query('DELETE FROM admin WHERE id = $1', [id]);
  return result.rowCount > 0;
}