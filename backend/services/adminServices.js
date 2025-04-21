import pool from '../config/db.js';
export async function findAdmiByEmail(email){
    const result = await pool .query(
        `SELECT * FROM admin WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

export async function createAdmin(name,email,passwordHash) {
    const result = await pool.query(
        `insert into admin(name,email,password_hash) values ($1,$2,$3) RETURNING *`,
        [name,email,passwordHash]
    )
    return result.rows[0];
}