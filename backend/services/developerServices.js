import pool from '../config/db.js';

export async function createDevloper(data){
    const {name,company_name,contact_email,phone_number,address,city,state} = data;
    const result = await pool.query(`INSERT INTO developer (name,company_name,contact_email,phone_number,address,city,state)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[name,company_name,contact_email,phone_number,address,city,state]);
        return result.rows[0];
    }
export async function getAllDeveloper(){
    const result = await pool.query(`select * from developer order by id asc`);
    return result.rows;
}
// Update a developer by ID
export const updateDeveloper = async (id, developerData) => {
    const {
      name,
      company_name,
      contact_email,
      phone_number,
      address,
      city,
      state,
    } = developerData;
  
    const result = await pool.query(
      `UPDATE developer
       SET name = $1,
           company_name = $2,
           contact_email = $3,
           phone_number = $4,
           address = $5,
           city = $6,
           state = $7
       WHERE id = $8
       RETURNING *`,
      [name, company_name, contact_email, phone_number, address, city, state, id]
    );
  
    return result.rows[0];
  };
  
  // Delete a developer by ID
export const deleteDeveloper = async (id) => {
    const result = await pool.query('DELETE FROM developer WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  };
