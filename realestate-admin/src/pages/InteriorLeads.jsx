import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const InteriorLeads = () => {
  const [interiorContact, setInteriorContact] = useState([]);
  const [loading, setLodding] = useState(true);
  useEffect(() => {
    fetchInteriorContact();
  }, []);
  const fetchInteriorContact = async () => {
    try {
      const data = await axios.get("http://localhost:3001/api/interior-leads");
      console.log(data.data);
      setInteriorContact(data.data);
    } catch (err) {
      toast.error("Failed to fetch leads");
    } finally {
      setLodding(false);
    }
  };

  const handleDelteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/interior-leads/${id}`);
      fetchInteriorContact();
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const markAsContacted = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/interior-leads/${id}/status`,
        {
          status: "contaced",
        }
      );
      fetchInteriorContact();
    } catch (err) {
      toast.error("Failed to mark as contacted");
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Interior Leads
        </h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Sl no</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interiorContact.map((lead, index) => (
                  <tr key={lead.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{lead.name}</td>
                    <td className="px-4 py-2">{lead.email}</td>
                    <td className="px-4 py-2">{lead.phone_number}</td>
                    <td className="px-4 py-2">{lead.status || "pending"}</td>
                    <td className="px-4 py-2">
                      {lead.status !== "contaced" && (
                        <button
                          onClick={() => markAsContacted(lead.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark as contacted
                        </button>
                      )}
                      <button
                        onClick={() => handleDelteContact(lead.id)}
                        className="bg-red-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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

export default InteriorLeads;
