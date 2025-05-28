import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();
export const testEmailConfig = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true
    });

    const verification = await transporter.verify();
    console.log('✅ Email configuration verified:', verification);
    return transporter;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    throw error;
  }
};

export const sendAdminEmail = async ({ title, project_name, name, phone, email }) => {
  try {
    if (!title || !project_name || !name || !phone || !email) {
      throw new Error('Missing required fields for email');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 5,
      maxMessages: 10
    });

    const mailOptions = {
      from: `"Property Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Property Inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px;">
          <img src="https://res.cloudinary.com/djqpz99jb/image/upload/v1748241602/WhatsApp_Image_2025-05-26_at_12.02.58_PM_mvl5cs.jpg" alt="Logo" style="height: 50px; margin-bottom: 20px;" />
          <p>Dear Truptikanta Swain,</p>
          <p>A user is interested in your property: <strong>${title} (${project_name})</strong></p>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Visitor Phone:</strong> ${phone}</p>
          <p><strong>Visitor Email:</strong> ${email}</p>
          <p><strong>Message:</strong> I am interested in your property. Please get in touch with me.</p>
        </div>
      `,
      text: `
        Dear Truptikanta Swain,
        
        A user is interested in your property: ${title} (${project_name})
        
        Sender Name: ${name}
        Visitor Phone: ${phone}
        Visitor Email: ${email}
        Message: I am interested in your property. Please get in touch with me.
      `
    };

    console.log('📧 Sending email to:', process.env.ADMIN_EMAIL);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    
    transporter.close();
    return result;
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
    throw error;
  }
};

export const sendAdminNotificationEmail = async (lead) => {
  try {
    const {
      name, email, phone_number, city, budget, inquiry_for, property_category
    } = lead;

    if (!name || !email || !phone_number) {
      throw new Error('Missing required lead information');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 5,
      maxMessages: 10
    });

    const mailOptions = {
      from: `"Property Leads" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚀 New Property Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px;">
          <img src="https://res.cloudinary.com/djqpz99jb/image/upload/v1748241602/WhatsApp_Image_2025-05-26_at_12.02.58_PM_mvl5cs.jpg" alt="Logo" style="height: 50px; margin-bottom: 20px;" />
          <h2 style="color: #333;">New Property Inquiry</h2>
          <p>Dear Truptikanta Swain,</p>
          <p>You have received a new property inquiry with the following details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone_number}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">City:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${city || 'Not specified'}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Inquiry For:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${inquiry_for || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Budget:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${budget || 'Not specified'}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Property Type:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${property_category || 'Not specified'}</td>
            </tr>
          </table>
          
          <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <strong>⚠️ Action Required:</strong> Please follow up with this lead as soon as possible.
          </p>
        </div>
      `,
      text: `
        New Property Inquiry from ${name}
        
        Dear Truptikanta Swain,
        
        You have received a new property inquiry:
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone_number}
        City: ${city || 'Not specified'}
        Inquiry For: ${inquiry_for || 'Not specified'}
        Budget: ${budget || 'Not specified'}
        Property Type: ${property_category || 'Not specified'}
        
        Please follow up with this lead as soon as possible.
      `
    };

    console.log('📧 Sending notification email to:', process.env.ADMIN_EMAIL);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent successfully:', result.messageId);
    
    transporter.close();
    return result;
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw error;
  }
};

// Usage example with error handling
export const handleEmailSending = async (emailFunction, data) => {
  try {
    const result = await emailFunction(data);
    return { success: true, result };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    
    // Log specific error types
    if (error.code === 'EAUTH') {
      console.error('Authentication failed - check your EMAIL_USER and EMAIL_PASS');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed - check your EMAIL_HOST and EMAIL_PORT');
    } else if (error.code === 'EMESSAGE') {
      console.error('Message error - check your email content and recipients');
    }
    
    return { success: false, error: error.message };
  }
};