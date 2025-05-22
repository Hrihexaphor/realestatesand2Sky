import pool from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Insert a new lead into the database and send confirmation email
 */
export const insertLead = async (data) => {
    const {
      name, email, phone_number, city, budget,inquiry_for,
      property_category, construction_status, profession_type,
      interested_in_loan, know_credit_score,
      ready_to_pay_brokerage, onsite_explanation
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
      name, email, phone_number, city, budget,inquiry_for,
      property_category, construction_status, profession_type,
      interested_in_loan, know_credit_score,
      ready_to_pay_brokerage, onsite_explanation
    ];
  
    try {
      const result = await pool.query(query, values);
      // Pass the complete data object to sendConfirmationEmail for better personalization
      await sendConfirmationEmail(email, name, data);
      //  await sendAdminNotificationEmail(Lead);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting lead:', error);
      throw error;
    }
  };

/**
 * Fetch all leads
 */
export const getAllLeads = async () => {
  const result = await pool.query('SELECT * FROM postinquiry_leads ORDER BY created_at DESC');
  return result.rows;
};

/**
 * Update contacted status for a specific lead
 */
export const updateContactedStatus = async (id, contacted) => {
  const result = await pool.query(
    'UPDATE postinquiry_leads SET contacted = $1 WHERE id = $2 RETURNING *;',
    [contacted, id]
  );
  return result.rows[0];
};

/**
 * Send confirmation email to the user
 */
export const sendConfirmationEmail = async (email, name, data) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Add DKIM signing if you have it set up
   
    });
  
    // Extract relevant data for personalization
    const { 
      property_category, 
      construction_status, 
      budget,
      city 
    } = data;
  
    // Format budget for display
    const formattedBudget = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(budget);
  
    const mailOptions = {
      from: {
        name: 'Property Finder Team',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Thank You for Your Property Inquiry | Next Steps',
      headers: {
        // Add List-Unsubscribe header to improve deliverability
        'List-Unsubscribe': `<mailto:unsubscribe@${process.env.MAIL_DOMAIN}?subject=unsubscribe>, <https://${process.env.WEBSITE_DOMAIN}/unsubscribe?email=${encodeURIComponent(email)}>`,
        // Add Message-ID to help with threading
        'Message-ID': `<${Date.now()}.${Math.random().toString(36).substring(2)}@${process.env.MAIL_DOMAIN}>`
      },
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You For Your Property Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333; background-color: #f7f7f7;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #4a86e8; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your Property Search Journey Begins</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin-top: 0; font-size: 16px;">Hello <strong>${name}</strong>,</p>
                    
                    <p style="font-size: 16px;">Thank you for reaching out to us about your property search. We're excited to help you find the perfect ${property_category} in ${city}.</p>
                    
                    <p style="font-size: 16px;">We've received your inquiry with the following details:</p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="10" border="0" style="background-color: #f9f9f9; border-radius: 6px; margin: 20px 0;">
                      <tr>
                        <td width="40%" style="font-weight: bold;">Property Type:</td>
                        <td>${property_category}</td>
                      </tr>
                      <tr>
                        <td width="40%" style="font-weight: bold;">Construction Status:</td>
                        <td>${construction_status}</td>
                      </tr>
                    //   <tr>
                    //     <td width="40%" style="font-weight: bold;">Budget:</td>
                    //     <td>${formattedBudget}</td>
                    //   </tr>
                      <tr>
                        <td width="40%" style="font-weight: bold;">Location:</td>
                        <td>${city}</td>
                      </tr>
                    </table>
                    
                    <p style="font-size: 16px;"><strong>What happens next?</strong></p>
                    
                    <ol style="font-size: 16px; padding-left: 20px;">
                      <li>Our property expert will call you within 24 hours to discuss your requirements in detail.</li>
                      <li>We'll curate a list of properties that match your criteria.</li>
                      <li>Schedule property visits at your convenience.</li>
                    </ol>
                    
                    <p style="font-size: 16px;">In the meantime, you can browse similar properties on our website:</p>
                    
                    <p style="text-align: center; margin: 30px 0;">
                      <a href="https://yourwebsite.com/properties?category=${encodeURIComponent(property_category)}&city=${encodeURIComponent(city)}" style="background-color: #4a86e8; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; display: inline-block;">Browse Properties</a>
                    </p>
                    
                    <p style="font-size: 16px;">If you have any questions or need immediate assistance, please contact us:</p>
                    <p style="font-size: 16px;">📞 <a href="tel:+910000000000" style="color: #4a86e8; text-decoration: none;">+91 00000-00000</a><br>
                    📧 <a href="mailto:support@yourcompany.com" style="color: #4a86e8; text-decoration: none;">support@yourcompany.com</a></p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666666;">
                    <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    <p style="margin: 0;">
                      <a href="https://yourwebsite.com/terms" style="color: #4a86e8; text-decoration: none; margin: 0 10px;">Terms of Service</a> | 
                      <a href="https://yourwebsite.com/privacy" style="color: #4a86e8; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                      <a href="https://yourwebsite.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #4a86e8; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
                    </p>
                    <p style="margin: 20px 0 0 0; font-size: 12px; color: #999999;">
                      This email was sent to you because you submitted a property inquiry on our website.
                      If you did not make this request, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
      text: `Hello ${name},
  
  Thank you for reaching out to us about your property search. We're excited to help you find the perfect ${property_category} in ${city}.
  
  We've received your inquiry with the following details:
  - Property Type: ${property_category}
  - Construction Status: ${construction_status}
  - Budget: ${formattedBudget}
  - Location: ${city}
  
  What happens next?
  1. Our property expert will call you within 24 hours to discuss your requirements in detail.
  2. We'll curate a list of properties that match your criteria.
  3. Schedule property visits at your convenience.
  
  In the meantime, you can browse similar properties on our website: https://yourwebsite.com/properties
  
  If you have any questions or need immediate assistance, please contact us:
  Phone: +91 00000-00000
  Email: support@yourcompany.com
  
  © ${new Date().getFullYear()} Your Company Name. All rights reserved.
  `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  };

  // also get the mail admin
//   export const sendAdminNotificationEmail = async (lead) => {
//   const {
//     name, email, phone_number, city, budget, inquiry_for, property_category
//   } = lead;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     },
//   });

//   const mailOptions = {
//     from: {
//       name: 'Lead Alert System',
//       address: process.env.EMAIL_USER
//     },
//     to: process.env.ADMIN_EMAIL,
//     subject: `🚀 New Property Inquiry from ${name}`,
//     html: `
//       <h2>New Lead Received</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Phone:</strong> ${phone_number}</p>
//       <p><strong>City:</strong> ${city}</p>
//       <p><strong>Inquiry For:</strong> ${inquiry_for}</p>
//       <p><strong>Budget:</strong> ${budget}</p>
//       <p><strong>Property Type:</strong> ${property_category}</p>
//       <hr>
//       <p><em>This is an automated message. Please follow up via CRM or phone.</em></p>
//     `,
//     text: `New Lead:
//       Name: ${name}
//       Email: ${email}
//       Phone: ${phone_number}
//       City: ${city}
//       Inquiry For: ${inquiry_for}
//       Budget: ${budget}
//       Property Type: ${property_category}
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Admin notified of new lead from ${name}`);
//   } catch (error) {
//     console.error('Error sending admin notification email:', error);
//     // Optionally don’t throw here so user experience is not affected
//   }
// };
