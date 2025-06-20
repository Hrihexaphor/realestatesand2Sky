import pool from '../config/db.js';

export async function createDevloper(data) {
  const {
    name,
    company_name,
    contact_email,
    phone_number,
    address,
    city,
    state,
    partial_amount,
    developer_logo, // new field
  } = data;

  const result = await pool.query(
    `INSERT INTO developer (name, company_name, contact_email, phone_number, address, city, state, partial_amount, developer_logo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [name, company_name, contact_email, phone_number, address, city, state, partial_amount, developer_logo]
  );

  return result.rows[0];
}
export async function getAllDeveloper(){
    const result = await pool.query(`select * from developer order by id asc`);
    return result.rows;
}
// Update a developer by ID
export const updateDeveloper = async (id, developerData = {}) => {
  // Extract all fields, including developer_logo
  const {
    name,
    company_name,
    contact_email,
    phone_number,
    address,
    city,
    state,
    partial_amount,
    developer_logo
  } = developerData;

  const sanitizedPartialAmount = partial_amount === '' || partial_amount === undefined 
    ? null 
    : partial_amount;

  // Build the update query dynamically
  let setClause = `
    name = $1,
    company_name = $2,
    contact_email = $3,
    phone_number = $4,
    address = $5,
    city = $6,
    state = $7,
    partial_amount = $8
  `;
  const values = [
    name,
    company_name,
    contact_email,
    phone_number,
    address,
    city,
    state,
    sanitizedPartialAmount
  ];
  let paramIndex = 9;
  if (developer_logo) {
    setClause += `, developer_logo = $${paramIndex}`;
    values.push(developer_logo);
    paramIndex++;
  }
  values.push(id);

  const result = await pool.query(
    `UPDATE developer SET ${setClause} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
};
  
  // Delete a developer by ID
export const deleteDeveloper = async (id) => {
    const result = await pool.query('DELETE FROM developer WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };
