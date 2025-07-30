import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyLegalLeads = () => {
  const [legalContacts, setLegalContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchLegalLeads();
  }, []);

  const fetchLegalLeads = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/property-legal-leads`);
      console.log(response.data);
      setLegalContacts(response.data);
    } catch (err) {
      toast.error("Failed to fetch leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api//property-legal-leads/${id}`);
      toast.success("Lead deleted successfully");
      fetchLegalLeads();
    } catch (err) {
      toast.error("Failed to delete lead");
      console.error(err);
    }
  };

  const handleMarkContacted = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/property-legal-leads/${id}/status`, {
        status: "contacted",
      });
      toast.success("Marked as contacted");
      fetchLegalLeads();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Property Legal Leads
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : legalContacts.length === 0 ? (
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
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {legalContacts.map((contact, index) => (
                  <tr key={contact.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{contact.name}</td>
                    <td className="px-4 py-2">{contact.email}</td>
                    <td className="px-4 py-2">{contact.phone_number}</td>
                    <td className="px-4 py-2 capitalize">
                      {contact.satus || "pending"}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      {contact.status !== "contacted" && (
                        <button
                          onClick={() => handleMarkContacted(contact.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Contacted
                        </button>
                      )}
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

export default PropertyLegalLeads;
