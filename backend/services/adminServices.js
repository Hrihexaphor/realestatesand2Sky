import pool from '../config/db.js';
export async function findAdmiByEmail(email) {
    // Only select needed fields and use LIMIT 1 for optimization
    const result = await pool.query(
        `SELECT id, name, email, role, password_hash FROM admin WHERE email = $1 LIMIT 1`,
        [email]
    );
    return result.rows[0];
}

export async function createAdmin(name,email,passwordHash,role) {
    const result = await pool.query(
        `insert into admin(name,email,password_hash,role) values ($1,$2,$3,$4) RETURNING *`,
        [name,email,passwordHash,role]
    )
    return result.rows[0];
}