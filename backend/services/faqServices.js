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
  const projectName = details.project_name || 'this property';
  const autoFaqs = [];
    
  // 2. Basic detail FAQs
  if (details.locality && details.city) autoFaqs.push({
    property_id: propertyId,
    question: `Where is ${projectName} Located?`,
    answer: `This property is located in ${details.locality}, ${details.city}.`,
    is_auto: true
  });
    // 2. Get main property info (for price and status)
  const propertyResult = await pool.query(
    'SELECT expected_price, possession_status FROM property WHERE id = $1',
    [propertyId]
  );
  const propertyInfo = propertyResult.rows[0] || {};

  if (details.bedrooms) autoFaqs.push({
    property_id: propertyId,
    question: `How Many Bedrooms are In ${projectName}?`,
    answer: `${details.bedrooms} bedroom(s) are available in this property.`,
    is_auto: true
  });

  if (details.bathrooms) autoFaqs.push({
    property_id: propertyId,
    question: `How Many Bathrooms are In ${projectName}?`,
    answer: `${details.bathrooms} bathroom(s) are available in this property.`,
    is_auto: true
  });

  if (details.balconies) autoFaqs.push({
    property_id: propertyId,
    question: `How Many Balconies are In ${projectName}?`,
    answer: `${details.balconies} balcony/balconies are available in this property.`,
    is_auto: true
  });

  if (details.covered_parking) autoFaqs.push({
    property_id: propertyId,
    question: `How Many Reserved Parking are In ${projectName}?`,
    answer: `${details.covered_parking} reserved parking space(s) are available.`,
    is_auto: true
  });

  if (details.project_rera_id) autoFaqs.push({
    property_id: propertyId,
    question: `Is ${projectName} RERA Registered?`,
    answer: `Yes, it is RERA registered with ID ${details.project_rera_id}.`,
    is_auto: true
  });

   if (propertyInfo.possession_status) autoFaqs.push({
    property_id: propertyId,
    question: `What is the Status of ${projectName}?`,
    answer: `The current status of this property is ${propertyInfo.possession_status}.`,
    is_auto: true
  });

  if (propertyInfo.expected_price) autoFaqs.push({
    property_id: propertyId,
    question: `What is the Price Range of ${projectName}?`,
    answer: `The price range is ${propertyInfo.expected_price}.`,
    is_auto: true
  });


  if (details.rental_return) autoFaqs.push({
    property_id: propertyId,
    question: `Expected Rental Rerurn of ${projectName}?`,
    answer: `The expected rental return is ${details.rental_return}.`,
    is_auto: true
  });

  // 3. Fetch nearest_to distances for Railway Station and Airport
  const nearestResult = await pool.query(`
    SELECT nt.name, pnt.distance_km
    FROM property_nearest_to pnt
    JOIN nearest_to nt ON nt.id = pnt.nearest_to_id
    WHERE pnt.property_id = $1 AND nt.name IN ('Railway Station', 'Airport')
  `, [propertyId]);

  nearestResult.rows.forEach(row => {
    if (row.name === 'Railway Station') {
      autoFaqs.push({
        property_id: propertyId,
        question: `How Far From Railway Station?`,
        answer: `It is approximately ${row.distance_km} km from the nearest railway station.`,
        is_auto: true
      });
    }

    if (row.name === 'Airport') {
      autoFaqs.push({
        property_id: propertyId,
        question: `How Far From Airport?`,
        answer: `It is approximately ${row.distance_km} km from the airport.`,
        is_auto: true
      });
    }
  });

  // 4. Config-based FAQs
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