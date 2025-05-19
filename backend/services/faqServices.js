import pool from '../config/db.js'

export async function getFaqsByPropertyId(propertyId) {
    return pool.query('SELECT id, question, answer FROM faqs WHERE property_id = $1 ORDER BY id ASC', [propertyId]);
  }
  export async function getAllFaqsByPropertyId(propertyId) {
    return pool.query(
      'SELECT id, question, answer, is_auto FROM faqs WHERE property_id = $1 ORDER BY is_auto, id ASC',
      [propertyId]
    );
  }
export  async function addFaq({ property_id, question, answer }) {
    return pool.query(
      'INSERT INTO faqs (property_id, question, answer) VALUES ($1, $2, $3) RETURNING *',
      [property_id, question, answer]
    );
  }
  
export async function generateAutomaticFaqs(propertyId) {
  // 1. Get property details
  const propertyDetails = await pool.query('SELECT * FROM property_details WHERE property_id = $1', [propertyId]);
  if (propertyDetails.rows.length === 0) return [];

  const details = propertyDetails.rows[0];
  const autoFaqs = [];

  // 2. Standard details-based FAQs
  if (details.bedrooms) autoFaqs.push({
    property_id: propertyId,
    question: `How many bedrooms does this property have?`,
    answer: `This property has ${details.bedrooms} bedroom(s).`,
    is_auto: true
  });

  if (details.bathrooms) autoFaqs.push({
    property_id: propertyId,
    question: `How many bathrooms are available in this property?`,
    answer: `There are ${details.bathrooms} bathroom(s) available.`,
    is_auto: true
  });

  if (details.project_name) autoFaqs.push({
    property_id: propertyId,
    question: `What is the name of this project?`,
    answer: `This property is part of ${details.project_name}.`,
    is_auto: true
  });

  if (details.locality) autoFaqs.push({
    property_id: propertyId,
    question: `Where is this property located?`,
    answer: `This property is located in ${details.locality}, ${details.city}.`,
    is_auto: true
  });

  if (details.built_up_area) autoFaqs.push({
    property_id: propertyId,
    question: `What is the built-up area of this property?`,
    answer: `The built-up area is ${details.built_up_area} sq. ft.`,
    is_auto: true
  });

  if (details.maintenance_charge) autoFaqs.push({
    property_id: propertyId,
    question: `What is the maintenance charge for this property?`,
    answer: `The maintenance charge is ${details.maintenance_charge}.`,
    is_auto: true
  });

  if (details.balconies) autoFaqs.push({
    property_id: propertyId,
    question: `Does this property have balconies?`,
    answer: `Yes, this property includes ${details.balconies} balcony/balconies.`,
    is_auto: true
  });

  // 3. Add configuration-based FAQs
  const configResult = await pool.query(
    'SELECT * FROM property_configurations WHERE property_id = $1',
    [propertyId]
  );

  if (configResult.rows.length > 0) {
    configResult.rows.forEach(config => {
      if (config.bhk_type && config.super_built_up_area) {
        autoFaqs.push({
          property_id: propertyId,
          question: `What is the super built-up area for ${config.bhk_type}?`,
          answer: `The super built-up area for ${config.bhk_type} is ${config.super_built_up_area} sq. ft.`,
          is_auto: true
        });
      }

      if (config.bhk_type && config.carpet_area) {
        autoFaqs.push({
          property_id: propertyId,
          question: `What is the carpet area for ${config.bhk_type}?`,
          answer: `The carpet area for ${config.bhk_type} is ${config.carpet_area} sq. ft.`,
          is_auto: true
        });
      }

      if (config.bhk_type && config.balconies) {
        autoFaqs.push({
          property_id: propertyId,
          question: `How many balconies are available in ${config.bhk_type}?`,
          answer: `${config.bhk_type} configuration includes ${config.balconies} balcony/balconies.`,
          is_auto: true
        });
      }
    });
  }

  return autoFaqs;
}


  export async function saveAutomaticFaqs(faqs) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const faq of faqs) {
        // Check if a similar auto FAQ already exists
        const existing = await client.query(
          'SELECT id FROM faqs WHERE property_id = $1 AND question = $2 AND is_auto = true',
          [faq.property_id, faq.question]
        );
        
        if (existing.rows.length === 0) {
          // Insert new auto FAQ if doesn't exist
          await client.query(
            'INSERT INTO faqs (property_id, question, answer, is_auto) VALUES ($1, $2, $3, $4)',
            [faq.property_id, faq.question, faq.answer, true]
          );
        } else {
          // Update existing auto FAQ
          await client.query(
            'UPDATE faqs SET answer = $1 WHERE id = $2',
            [faq.answer, existing.rows[0].id]
          );
        }
      }
      
      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  export async function refreshAutomaticFaqs(propertyId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete existing auto FAQs
      await client.query('DELETE FROM faqs WHERE property_id = $1 AND is_auto = true', [propertyId]);
      
      // Generate new auto FAQs
      const autoFaqs = await generateAutomaticFaqs(propertyId);
      
      // Insert new auto FAQs
      for (const faq of autoFaqs) {
        await client.query(
          'INSERT INTO faqs (property_id, question, answer, is_auto) VALUES ($1, $2, $3, $4)',
          [faq.property_id, faq.question, faq.answer, true]
        );
      }
      
      await client.query('COMMIT');
      return { success: true, count: autoFaqs.length };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }