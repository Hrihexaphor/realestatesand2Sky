import pool from "../config/db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { parse } from "path";
dotenv.config();
/**
 * Insert a new lead into the database and send confirmation email
 */
export const insertLead = async (data) => {
  const {
    name,
    email,
    phone_number,
    city,
    budget,
    inquiry_for,
    property_category,
    construction_status,
    profession_type,
    interested_in_loan,
    know_credit_score,
    ready_to_pay_brokerage,
    onsite_explanation,
  } = data;

  const query = `
      INSERT INTO postinquiry_leads (
        name, email, phone_number, city, budget,inquiry_for,
        property_category, construction_status, profession_type,
        interested_in_loan, know_credit_score,
        ready_to_pay_brokerage, onsite_explanation
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;

  const values = [
    name,
    email,
    phone_number,
    city,
    budget,
    inquiry_for,
    property_category,
    construction_status,
    profession_type,
    interested_in_loan,
    know_credit_score,
    ready_to_pay_brokerage,
    onsite_explanation,
  ];

  try {
    const result = await pool.query(query, values);
    // Pass the complete data object to sendConfirmationEmail for better personalization
    // await sendConfirmationEmail(email, name, data);
    //  await sendAdminNotificationEmail(data);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting lead:", error);
    throw error;
  }
};

/**
 * Fetch all leads
 */
export const getAllLeads = async () => {
  const result = await pool.query(
    "SELECT * FROM postinquiry_leads ORDER BY created_at DESC"
  );
  return result.rows;
};

/**
 * Update contacted status for a specific lead
 */
export const updateContactedStatus = async (id, contacted) => {
  const result = await pool.query(
    "UPDATE postinquiry_leads SET contacted = $1 WHERE id = $2 RETURNING *;",
    [contacted, id]
  );
  return result.rows[0];
};
export const deleteLeadById = async (id) => {
  return await pool.query("DELETE FROM postinquiry_leads WHERE id = $1", [id]);
};

export async function createInquiry(data) {
  const { property_id, phone, project_name, title, name, email, lead_source } =
    data;

  const inquiry_time = new Date();
  const contacted = false;

  const result = await pool.query(
    `INSERT INTO property_inquiries 
     (property_id,phone, project_name, title, name, email, inquiry_time, contacted,lead_source) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *`,
    [
      property_id,
      phone,
      project_name,
      title,
      name,
      email,
      inquiry_time,
      contacted,
      lead_source,
    ]
  );

  // await sendAdminEmail({ title, project_name, name, phone, email });
  return result.rows[0];
}
// services to get the count of inquiries for perticular property

export async function getpropertyInquiryCount(propertyId) {
  const result = await pool.query(
    `SELECT COUNT(*) AS total_contact FROM property_inquiries WHERE property_id = $1`,
    [propertyId]
  );
  return {
    property_id: propertyId,
    total_contact: parseInt(result.rows[0].total_contact, 10),
  };
}
export async function getAllInquiries() {
  const result = await pool.query(
    `SELECT * FROM property_inquiries ORDER BY inquiry_time DESC`
  );
  return result.rows;
}
export async function markAsContacted(id) {
  const result = await pool.query(
    `UPDATE property_inquiries SET contacted = true WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
export async function deleteInquiryById(id) {
  return await pool.query("DELETE FROM property_inquiries WHERE id = $1", [id]);
}

// const sendAdminEmail = async ({ title, project_name, name, phone, email }) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//   port: parseInt(process.env.EMAIL_PORT, 10),
//   secure: false, // Brevo uses STARTTLS, not SSL
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.ADMIN_EMAIL,
//     subject: 'New Property Inquiry',
//     html: `
//       <div style="font-family: Arial; border: 1px solid #ddd; padding: 20px;">
//         <img src="https://res.cloudinary.com/djqpz99jb/image/upload/v1748241602/WhatsApp_Image_2025-05-26_at_12.02.58_PM_mvl5cs.jpg" alt="Logo" style="height: 50px; margin-bottom: 20px;" />
//         <p>Dear Truptikanta Swain,</p>
//         <p>A user is interested in your property: <strong>${title} (${project_name})</strong></p>
//         <p><strong>Sender Name:</strong> ${name}</p>
//         <p><strong>Visitor Phone:</strong> ${phone}</p>
//         <p><strong>Visitor Email:</strong> ${email}</p>
//         <p><strong>Message:</strong> I am interested in your property. Please get in touch with me.</p>
//       </div>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// };

// get info services
export async function postGetInfo(data) {
  const {
    reason_to_buy,
    is_property_dealer,
    name,
    email,
    phone,
    when_plan_to_buy,
    interested,
  } = data;

  const query = `
    INSERT INTO get_info (
      reason_to_buy,
      is_property_dealer,
      name,
      email,
      phone,
      when_plan_to_buy,
      interested
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    reason_to_buy,
    is_property_dealer,
    name,
    email,
    phone,
    when_plan_to_buy,
    interested,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Get all entries
export async function getAllGetInfo() {
  const result = await pool.query(
    "SELECT * FROM get_info ORDER BY created_at DESC"
  );
  return result.rows;
}

// Toggle contacted status
export async function toggleContactedGetInfo(id) {
  const result = await pool.query(
    `UPDATE get_info SET contacted = NOT contacted WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

// contactus lead services
export async function createContact({ name, email, message }) {
  const result = await pool.query(
    "INSERT INTO contactus (name, email, message) VALUES ($1, $2, $3) RETURNING *",
    [name, email, message]
  );
  return result.rows[0];
}

export async function getAllContacts() {
  const result = await pool.query(
    "SELECT * FROM contactus ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function deleteContactById(id) {
  return await pool.query("DELETE FROM contactus WHERE id = $1", [id]);
}
