import pool from '../config/db.js'

// Add a new FAQ
export async function addFAQ(question, answer) {
  const result = await pool.query(
    'INSERT INTO generalfaq (question, answer) VALUES ($1, $2) RETURNING *',
    [question, answer]
  );
  return result.rows[0];
}

// Get all FAQs
export async function getAllFAQs() {
  const result = await pool.query('SELECT * FROM generalfaq ORDER BY id ASC');
  return result.rows;
}

// Update an FAQ
export async function updateFAQ(id, question, answer) {
  const result = await pool.query(
    'UPDATE generalfaq SET question = $1, answer = $2 WHERE id = $3 RETURNING *',
    [question, answer, id]
  );
  return result.rows[0];
}

// Delete an FAQ
export async function deleteFAQ(id) {
  const result = await pool.query(
    'DELETE FROM generalfaq WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}
