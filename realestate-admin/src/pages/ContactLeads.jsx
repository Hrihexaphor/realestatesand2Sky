import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const ContactLeads = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/contact`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL}/api/contact/${id}`);
      toast.success("Contact deleted successfully");
      fetchContacts(); // refresh the table
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("Failed to delete contact");
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Contact Leads
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-500">
            No contact leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={contact.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{contact.name}</td>
                    <td className="px-4 py-2">{contact.email}</td>
                    <td className="px-4 py-2">{contact.message}</td>
                    <td className="px-4 py-2">
                      {new Date(contact.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactLeads;
