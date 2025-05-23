import express from 'express';
import { addContact,getAllContacts,getContactById,updateContact,deleteContact } from '../services/contactusServices.js';
const router = express.Router()

// Create new contact
router.post('/addcontact', async (req, res) => {
  try {
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contacts
router.get('/contact', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contact by ID
router.get('/contact/:id', async (req, res) => {
  try {
    const contact = await getContactById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update contact
router.put('/contact/:id', async (req, res) => {
  try {
    const updated = await updateContact(req.params.id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete contact
router.delete('/contact/:id', async (req, res) => {
  try {
    const deleted = await deleteContact(req.params.id);
    if (deleted) {
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;