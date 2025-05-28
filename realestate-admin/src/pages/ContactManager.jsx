import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ email: '', phone_number: '', address: '' });
  const [editId, setEditId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/contact`);
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/contact/${editId}`, formData,{
    withCredentials: true
  });
      } else {
        await axios.post(`${BASE_URL}/api/addcontact`, formData,{
    withCredentials: true
  });
      }
      setFormData({ email: '', phone_number: '', address: '' });
      setEditId(null);
      fetchContacts();
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  const handleEdit = (contact) => {
    setFormData({ email: contact.email, phone_number: contact.phone_number, address: contact.address });
    setEditId(contact.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`${BASE_URL}/api/contact/${id}`,{
    withCredentials: true
  });
        fetchContacts();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Contact' : 'Add New Contact'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            name="phone_number"
            type="text"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Contacts</h2>
      <div className="overflow-x-auto">
        <table className="w-full border table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="p-2 border">{contact.id}</td>
                <td className="p-2 border">{contact.email}</td>
                <td className="p-2 border">{contact.phone_number}</td>
                <td className="p-2 border">{contact.address}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">No contacts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactManager;
