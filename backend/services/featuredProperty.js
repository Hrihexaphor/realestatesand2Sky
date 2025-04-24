import pool from '../config/db.js'

export async function addToFeatured(property_id) {
    const result = await pool.query(`INSERT INTO featured_properties (property_id) VALUES ($1) RETURNING *`, [property_id]);
    return result.rows[0];
}

export async function removeFromFeatured(property_id) {
    const result = await pool.query(`DELETE FROM featured_properties WHERE property_id = $1 RETURNING *`, [property_id]);
    return result.rows[0];
}

export async function getAllFeaturedIds() {
    const result = await pool.query(`SELECT property_id FROM featured_properties`);
    return result.rows.map(row => row.property_id); // Return array of IDs
}

export async function checkIfFeatured(property_id) {
    const result = await pool.query(`SELECT * FROM featured_properties WHERE property_id = $1`, [property_id]);
    return result.rows[0]; // Returns the row if found, undefined if not
}