import pool from '../config/db.js'


// Add a contact entry
export async function addContact({ email, phone_number, address }) {
  const result = await pool.query(
    `INSERT INTO contact_us (email, phone_number, address)
     VALUES ($1, $2, $3) RETURNING *`,
    [email, phone_number, address]
  );
  return result.rows[0];
}

// Get all contacts
export async function getAllContacts() {
  const result = await pool.query(`SELECT * FROM contact_us ORDER BY id DESC`);
  return result.rows;
}

// Get single contact by ID
export async function getContactById(id) {
  const result = await pool.query(`SELECT * FROM contact_us WHERE id = $1`, [id]);
  return result.rows[0];
}

// Update a contact
export async function updateContact(id, { email, phone_number, address }) {
  const result = await pool.query(
    `UPDATE contact_us
     SET email = COALESCE($1, email),
         phone_number = COALESCE($2, phone_number),
         address = COALESCE($3, address)
     WHERE id = $4 RETURNING *`,
    [email, phone_number, address, id]
  );
  return result.rows[0];
}

// Delete a contact
export async function deleteContact(id) {
  const result = await pool.query(
    `DELETE FROM contact_us WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
