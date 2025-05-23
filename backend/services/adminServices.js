import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, role, password_hash, permission FROM admin WHERE email = $1 LIMIT 1`,
    [email]
  );
  const user = result.rows[0];
  if (user?.permission) {
    user.permission = user.permission.replace(/^{|}$/g, '').split(',');
  }
  return user;
}


export async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, name, email, role, permissions FROM admin WHERE role != 'admin' ORDER BY id DESC`
  );
  return result.rows;
}

export async function createUser({ name, email, password, role, permissions }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO admin (name, email, password_hash, role, permissions)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, permissions`,
    [name, email, passwordHash, role, permissions]
  );
  return result.rows[0];
}

export async function updateUserById(id, { name, email, password, role, permissions }) {
  let fields = ['name = $1', 'email = $2', 'role = $3', 'permissions = $4'];
  let values = [name, email, role, permissions];
  let paramIndex = 5;

  if (password && password.trim()) {
    const passwordHash = await bcrypt.hash(password, 10);
    fields.push(`password_hash = $${paramIndex++}`);
    values.push(passwordHash);
  }

  values.push(id);

  const query = `UPDATE admin SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, role, permissions`;

  const result = await pool.query(query,values);

  return result.rows[0];
}

export async function deleteUserById(id) {
  const result = await pool.query('DELETE FROM admin WHERE id = $1', [id]);
  return result.rowCount > 0;
}
