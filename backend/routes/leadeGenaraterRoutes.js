import express from "express";
import {
  insertLead,
  getAllLeads,
  updateContactedStatus,
  createInquiry,
  getAllInquiries,
  markAsContacted,
  postGetInfo,
  getAllGetInfo,
  toggleContactedGetInfo,
  createContact,
  getAllContacts,
  deleteLeadById,
  deleteInquiryById,
  deleteContactById,
} from "../services/leadServices.js";
import {
  sendAdminNotificationEmail,
  sendAdminEmail,
  handleEmailSending,
} from "../utils/emailfunction.js";
const router = express.Router();

router.post("/inquiryleads", async (req, res) => {
  try {
    const lead = await insertLead(req.body);

    // Send email notification to admin
    const emailResult = await handleEmailSending(
      sendAdminNotificationEmail,
      req.body
    );
    if (!emailResult.success) {
      console.warn(
        "Failed to send admin notification email:",
        emailResult.error
      );
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      message: "Lead submitted successfully",
      lead,
      emailSent: emailResult.success,
    });
  } catch (err) {
    console.error("Error submitting lead:", err);
    res.status(500).json({ message: "Error submitting lead" });
  }
});

router.get("/inquiryleads", async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

router.put("/inquiryleads/:id/contacted", async (req, res) => {
  try {
    const { contacted } = req.body;
    const updated = await updateContactedStatus(req.params.id, contacted);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating contacted status" });
  }
});
router.delete("/inquiryleads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteLeadById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: "Failed to delete lead" });
  }
});

// property inquiry leads generates Routes
// POST: New inquiry
router.post("/propinquiry", async (req, res) => {
  try {
    const result = await createInquiry(req.body);

    // Send email notification for property inquiry
    const { title, project_name, name, phone, email } = req.body;
    if (title && project_name && name && phone && email) {
      const emailResult = await handleEmailSending(sendAdminEmail, {
        title,
        project_name,
        name,
        phone,
        email,
      });

      if (!emailResult.success) {
        console.warn(
          "Failed to send property inquiry email:",
          emailResult.error
        );
      }

      res.status(201).json({
        ...result,
        emailSent: emailResult.success,
      });
    } else {
      res.status(201).json(result);
    }
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({ error: "Failed to create inquiry" });
  }
});

// GET: All inquiries
router.get("/propinquiry", async (req, res) => {
  try {
    const inquiries = await getAllInquiries();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// PATCH: Mark as contacted
router.patch("/propinquiry/:id/contacted", async (req, res) => {
  try {
    const updated = await markAsContacted(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update contacted status" });
  }
});
router.delete("/propinquiry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteInquiryById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ error: "Failed to delete inquiry" });
  }
});

// getInfo routes
// POST /api/get-info
router.post("/getinfo", async (req, res) => {
  try {
    const data = await postGetInfo(req.body);
    res.json(data);
  } catch (err) {
    console.error("Create GetInfo Error:", err);
    res.status(500).json({ error: "Failed to submit information" });
  }
});

// GET /api/get-info
router.get("/getinfo", async (req, res) => {
  try {
    const data = await getAllGetInfo();
    res.json(data);
  } catch (err) {
    console.error("Fetch GetInfo Error:", err);
    res.status(500).json({ error: "Failed to fetch information" });
  }
});

// PATCH /api/get-info/:id/contacted
router.patch("/getinfo/:id/contacted", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await toggleContactedGetInfo(id);
    res.json(updated);
  } catch (err) {
    console.error("Toggle Contacted Error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// contactus lead routes
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const newContact = await createContact({ name, email, message });
    res.json(newContact);
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/contact
router.get("/contact", async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json(contacts);
  } catch (err) {
    console.error("Get contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.delete("/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteContactById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// test routes
router.post("/test-email", async (req, res) => {
  try {
    const testData = {
      name: "Test User",
      email: "pandahritesh@gmail.com",
      phone_number: "+91-9876543210",
      city: "Test City",
      budget: "10-20 Lakhs",
      inquiry_for: "Buy",
      property_category: "Apartment",
    };

    const result = await handleEmailSending(
      sendAdminNotificationEmail,
      testData
    );

    if (result.success) {
      res.json({
        message: "Test email sent successfully!",
        result: result.result,
      });
    } else {
      res
        .status(500)
        .json({ message: "Test email failed", error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: "Test failed", error: error.message });
  }
});
export default router;
