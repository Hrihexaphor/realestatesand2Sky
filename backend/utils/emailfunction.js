import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import transporter from "./emailTransporter.js";

export const sendAdminEmail = async ({
  title,
  project_name,
  name,
  phone,
  email,
}) => {
  try {
    if (!title || !project_name || !name || !phone || !email) {
      throw new Error("Missing required fields for email");
    }
    const mailOptions = {
      from: `"Property Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // developer19.hexaphor@gmail.com
      subject: "New Property Inquiry",
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
      `,
    };

    console.log("📧 Sending email via Gmail to:", process.env.ADMIN_EMAIL);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully via Gmail:", result.messageId);

    transporter.close();
    return result;
  } catch (error) {
    console.error("❌ Error sending admin email via Gmail:", error);
    throw error;
  }
};
// developer sending email
export const sendDeveloperEmail = async ({
  title,
  project_name,
  name,
  phone,
  email,
  developerEmail,
  developerName,
}) => {
  try {
    const mailOptions = {
      from: `"Property Inquiry" <${process.env.EMAIL_USER}>`,
      to: developerEmail,
      subject: "New Inquiry for Your Property",
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px;">
          <img src="https://res.cloudinary.com/...logo_url..." alt="Logo" style="height: 50px; margin-bottom: 20px;" />
          <p>Dear ${developerName || "Developer"},</p>
          <p>A user is interested in your property: <strong>${title} (${project_name})</strong></p>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Visitor Phone:</strong> ${phone}</p>
          <p><strong>Visitor Email:</strong> ${email}</p>
          <p><strong>Message:</strong> I am interested in your property. Please get in touch with me.</p>
        </div>
      `,
      text: `
        Dear,
        A user is interested in your property: ${title} (${project_name})
        Message: I am interested in your property. Please get in touch with me.
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    transporter.close();
    return result;
  } catch (error) {
    console.error("Error sending developer email:", error);
    return { success: false, error };
  }
};

export const sendAdminNotificationEmail = async (lead) => {
  try {
    const {
      name,
      email,
      phone_number,
      city,
      budget,
      inquiry_for,
      property_category,
    } = lead;

    if (!name || !email || !phone_number) {
      throw new Error("Missing required lead information");
    }
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
              <td style="padding: 10px; border: 1px solid #ddd;">${
                city || "Not specified"
              }</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Inquiry For:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                inquiry_for || "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Budget:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                budget || "Not specified"
              }</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Property Type:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                property_category || "Not specified"
              }</td>
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
        City: ${city || "Not specified"}
        Inquiry For: ${inquiry_for || "Not specified"}
        Budget: ${budget || "Not specified"}
        Property Type: ${property_category || "Not specified"}
        
        Please follow up with this lead as soon as possible.
      `,
    };

    console.log(
      "📧 Sending notification email via Gmail to:",
      process.env.ADMIN_EMAIL
    );
    const result = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Notification email sent successfully via Gmail:",
      result.messageId
    );

    transporter.close();
    return result;
  } catch (error) {
    console.error("❌ Error sending notification email via Gmail:", error);
    throw error;
  }
};

// Usage example with error handling
export const handleEmailSending = async (emailFunction, data) => {
  try {
    const result = await emailFunction(data);
    return { success: true, result };
  } catch (error) {
    console.error("Gmail email sending failed:", error.message);

    // Log specific Gmail error types
    if (error.code === "EAUTH") {
      console.error(
        "Gmail Authentication failed - check your EMAIL_USER and EMAIL_PASS (App Password)"
      );
      console.error("Make sure you have:");
      console.error("1. Enabled 2-Factor Authentication on your Gmail account");
      console.error("2. Generated an App Password for this application");
      console.error(
        "3. Used the App Password (not your regular Gmail password)"
      );
    } else if (error.code === "ECONNECTION") {
      console.error("Gmail connection failed - check your internet connection");
    } else if (error.code === "EMESSAGE") {
      console.error("Message error - check your email content and recipients");
    } else if (error.responseCode === 535) {
      console.error("Gmail login failed - App Password might be incorrect");
    }

    return { success: false, error: error.message };
  }
};

// Rate limiting and retry logic for Gmail
export const rateLimitedEmailSend = async (
  emailFunction,
  data,
  maxRetries = 3
) => {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const result = await emailFunction(data);
      return { success: true, result };
    } catch (error) {
      console.error(
        `Gmail email attempt ${retryCount + 1} failed:`,
        error.message
      );

      // Handle specific Gmail rate limit error
      if (
        error.responseCode === 550 &&
        error.message.includes("Daily user sending limit exceeded")
      ) {
        console.error("🚫 Gmail daily sending limit exceeded!");
        console.error("Solutions:");
        console.error("1. Wait 24 hours for limit to reset");
        console.error("2. Use a different Gmail account");
        console.error(
          "3. Upgrade to Google Workspace for higher limits (2000/day)"
        );
        console.error(
          "4. Use a different email service (SendGrid, Mailgun, etc.)"
        );

        return {
          success: false,
          error: "Gmail daily sending limit exceeded",
          shouldRetry: false,
          limitExceeded: true,
        };
      }

      // Handle temporary errors with retry
      if (
        error.responseCode >= 400 &&
        error.responseCode < 500 &&
        retryCount < maxRetries - 1
      ) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(
          `⏳ Retrying in ${backoffTime}ms... (attempt ${
            retryCount + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        retryCount++;
        continue;
      }

      return { success: false, error: error.message, shouldRetry: false };
    }
  }

  return { success: false, error: "Max retries exceeded", shouldRetry: false };
};

// Email queue system for better rate limiting
class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.dailyCount = 0;
    this.lastResetDate = new Date().toDateString();
    this.maxDailyEmails = 450; // Conservative limit for free Gmail
  }

  async addToQueue(emailFunction, data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ emailFunction, data, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    // Reset daily count if new day
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyCount = 0;
      this.lastResetDate = today;
      console.log("📅 Daily email count reset");
    }

    // Check daily limit
    if (this.dailyCount >= this.maxDailyEmails) {
      console.error(
        "🚫 Daily email limit reached. Emails will be queued for tomorrow."
      );
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.dailyCount < this.maxDailyEmails) {
      const { emailFunction, data, resolve, reject } = this.queue.shift();

      try {
        const result = await emailFunction(data);
        this.dailyCount++;
        console.log(
          `✅ Email sent. Daily count: ${this.dailyCount}/${this.maxDailyEmails}`
        );
        resolve({ success: true, result });

        // Add delay between emails to avoid rate limiting
        if (this.queue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        }
      } catch (error) {
        console.error("❌ Email failed:", error.message);
        reject({ success: false, error: error.message });
      }
    }

    this.processing = false;
  }
  getStatus() {
    return {
      queueLength: this.queue.length,
      dailyCount: this.dailyCount,
      maxDailyEmails: this.maxDailyEmails,
      resetDate: this.lastResetDate,
    };
  }
}
