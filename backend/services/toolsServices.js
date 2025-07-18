import pool from "../config/db.js";

// create the services for the property legal leads create
export async function createPropertyLegalLeads(name, email, phone_number) {
  const result = await pool.query(
    `INSERT INTO property_legal_services_leads (name, email, phone_number)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, email, phone_number]
  );
  return result.rows[0];
}

export async function getPropertyLegalLeads() {
  const result = await pool.query(
    "SELECT * FROM property_legal_services_leads"
  );
  return result.rows;
}

export async function deletePropertyLegalLeads(id) {
  const result = await pool.query(
    `DELETE FROM property_legal_services_leads WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function updatePropertyLegalLeads(id, satus) {
  const result = await pool.query(
    `UPDATE property_legal_services_leads
       SET satus = $1
       WHERE id = $2 RETURNING *`,
    [satus, id]
  );
  return result.rows[0];
}

// INTERIOR LEADS SERIVICES

export async function createInteriorLeads(name, email, phone_number) {
  const result = await pool.query(
    `INSERT INTO home_interior_leads (name, email, phone_number)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, email, phone_number]
  );
  return result.rows[0];
}

export async function getInteriorLeads() {
  const result = await pool.query(` SELECT * FROM home_interior_leads`);
  return result.rows;
}

export async function deleteInteriorLeads(id) {
  const result = await pool.query(
    ` DELETE FROM home_interior_leads WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function updateInteriorLeads(id, status) {
  const result = await pool.query(
    `UPDATE home_interior_leads
       SET status = $1
       WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}
// property investment leads searvices
export async function createPropertyInvestmentLeads(name, email, phone_number) {
  const result = await pool.query(
    `INSERT INTO property_investment_leads (name, email, phone_number)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, email, phone_number]
  );
  return result.rows[0];
}

export async function getPropertyInvestmentLeads() {
  const result = await pool.query("SELECT * FROM property_investment_leads");
  return result.rows;
}

export async function deletePropertyInvestmentLeads(id) {
  const result = await pool.query(
    `DELETE FROM property_investment_leads WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function updatePropertyInvestmentLeads(id, satus) {
  const result = await pool.query(
    `UPDATE property_investment_leads
       SET satus = $1
       WHERE id = $2 RETURNING *`,
    [satus, id]
  );
  return result.rows[0];
}
