import pool from '../config/db.js'

export async function getFaqsByPropertyId(propertyId) {
    return pool.query('SELECT id, question, answer FROM faqs WHERE property_id = $1 ORDER BY id ASC', [propertyId]);
  }
  
export  async function addFaq({ property_id, question, answer }) {
    return pool.query(
      'INSERT INTO faqs (property_id, question, answer) VALUES ($1, $2, $3) RETURNING *',
      [property_id, question, answer]
    );
  }
  