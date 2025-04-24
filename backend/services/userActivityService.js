import pool from '../config/db.js'
import {v4 as uuidv4} from 'uuid';
export async function createGuestSession(fingerprint, ipAddress, userAgent, deviceInfo) {
    const sessionId = uuidv4(); // Generate a unique session ID
    const result = await pool.query(
        `INSERT INTO visitors (fingerprint_id, ip_address, user_agent, device_info, created_at) 
        VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING *`,
        [fingerprint, ipAddress, userAgent, deviceInfo]
    );
    return result.rows[0]; // Returns the created visitor data with all the details
}
  export async function updateContactInfo(visitorId, email, phone) {
    const result = await pool.query(
      'INSERT INTO visitor_contacts (visitor_id, email, phone, submitted_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [visitorId, email, phone]
    );
    return result.rows[0]; // Returns the created contact info
  }
  
  export async function logActivity(visitorId, pageUrl, actionType, actionDetails = {}) {
    const result = await pool.query(
      `INSERT INTO activities (visitor_id, page_url, action_type, action_details, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [visitorId, pageUrl, actionType, JSON.stringify(actionDetails)] // actionDetails as JSON
    );
    return result.rows[0]; // Returns the created activity record
  }
  export async function createPropertyInquiry(visitorId, propertyId, name, email, phone, message) {
    const result = await pool.query(
      `INSERT INTO property_inquiries (visitor_id, property_id, name, email, phone, message, inquiry_time)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [visitorId, propertyId, name, email, phone, message]
    );
    return result.rows[0]; // Returns the created property inquiry
  }