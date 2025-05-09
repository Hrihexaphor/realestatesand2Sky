import pool from '../config/db.js';

const addAboutpage = async ({ title, description, image_url }) => {
    try {
        const result = await pool.query(
            `INSERT INTO about_us (title, description, image_url) VALUES ($1, $2, $3) RETURNING *`,
            [title, description, image_url]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error in addAboutpage:', err);
        throw err;
    }
};

// get all about page
const getAboutUs = async () => {
    try {
        const result = await pool.query('SELECT * FROM about_us ORDER BY id');
        return result.rows; // Return all rows
    } catch (err) {
        console.error('Error in getAboutUs:', err);
        throw err;
    }
};
// update about page
const updateAboutPage = async (id, { title, description, image_url }) => {
    try {
      const result = await pool.query(
        `UPDATE about_us 
         SET title = $1, description = $2, image_url = COALESCE($3, image_url) 
         WHERE id = $4 
         RETURNING *`,
        [title, description, image_url, id]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error in updateAboutPage:', err);
      throw err;
    }
  };
//   delete about page
const deleteAboutPage = async (id) => {
    try {
      const result = await pool.query(
        'DELETE FROM about_us WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0]; // Return deleted row for confirmation
    } catch (err) {
      console.error('Error in deleteAboutPage:', err);
      throw err;
    }
  };
  

//   privacy policy routes
const addPrivacyPolicy = async ({ title, description }) => {
    const result = await pool.query(
      `INSERT INTO privacy_policy (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    return result.rows[0];
  };
  
  const getPrivacyPolicies = async () => {
    const result = await pool.query('SELECT * FROM privacy_policy ORDER BY id DESC');
    return result.rows;
  };
  
  const updatePrivacyPolicy = async (id, { title, description }) => {
    const result = await pool.query(
      `UPDATE privacy_policy SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
      [title, description, id]
    );
    return result.rows[0];
  };
  
  const deletePrivacyPolicy = async (id) => {
    const result = await pool.query(
      `DELETE FROM privacy_policy WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  };

export default { addAboutpage,getAboutUs,updateAboutPage,deleteAboutPage,addPrivacyPolicy,
    getPrivacyPolicies,
    updatePrivacyPolicy,
    deletePrivacyPolicy };