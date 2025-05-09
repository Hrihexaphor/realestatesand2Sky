import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { Button } from '@/components/ui/button'; // optional shadcn/ui button if you're using it

const InquiryLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/inquiryleads`);
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const toggleContacted = async (id, currentStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/inquiryleads/${id}/contacted`, { contacted: !currentStatus });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'inquiry-leads.xlsx');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inquiry Leads</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          onClick={downloadExcel}
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Contacted</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{lead.name}</td>
                <td className="p-2 border">{lead.email}</td>
                <td className="p-2 border">{lead.phone_number}</td>
                <td className="p-2 border">{lead.city}</td>
                <td className="p-2 border">{lead.budget}</td>
                <td className="p-2 border">{lead.property_category}</td>
                <td className="p-2 border">
                  <span className={lead.contacted ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {lead.contacted ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-2 border">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      lead.contacted ? 'bg-yellow-500' : 'bg-blue-600'
                    }`}
                    onClick={() => toggleContacted(lead.id, lead.contacted)}
                  >
                    Mark as {lead.contacted ? 'Not Contacted' : 'Contacted'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <p className="mt-4 text-gray-500 text-center">No leads found.</p>
        )}
      </div>
    </div>
  );
};

export default InquiryLeadsPage;
