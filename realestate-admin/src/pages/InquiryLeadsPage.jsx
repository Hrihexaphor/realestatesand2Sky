import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const InquiryLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeadsByDate();
  }, [leads, startDate, endDate]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/inquiryleads`);
      console.log(res.data);
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/inquiryleads/${id}`);
      toast.success("Lead deleted successfully");
      fetchLeads(); // Refresh list after delete
    } catch (err) {
      console.error("Failed to delete lead", err);
      alert("Failed to delete lead");
      toast.error("Failed to delete lead");
    }
  };
  const filterLeadsByDate = () => {
    if (!startDate && !endDate) {
      setFilteredLeads(leads);
      return;
    }

    const filtered = leads.filter((lead) => {
      const createdDate = new Date(lead.created_at);

      if (startDate && endDate) {
        return (
          createdDate >= new Date(startDate) && createdDate <= new Date(endDate)
        );
      } else if (startDate) {
        return createdDate >= new Date(startDate);
      } else if (endDate) {
        return createdDate <= new Date(endDate);
      }

      return true;
    });

    setFilteredLeads(filtered);
  };

  const toggleContacted = async (id, currentStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/inquiryleads/${id}/contacted`, {
        contacted: !currentStatus,
      });
      fetchLeads();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const downloadExcel = () => {
    // Using filtered leads for the Excel download
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Include date range in filename if filtered
    let filename = "inquiry-leads";
    if (startDate || endDate) {
      filename += startDate ? `_from-${startDate}` : "";
      filename += endDate ? `_to-${endDate}` : "";
    }

    saveAs(blob, `${filename}.xlsx`);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredLeads(leads);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inquiry Leads</h1>
        <div className="flex items-center space-x-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowDateFilter(!showDateFilter)}
          >
            {showDateFilter ? "Hide Filters" : "Filter by Date"}
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        </div>
      </div>

      {showDateFilter && (
        <div className="bg-gray-50 p-4 mb-4 rounded shadow">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="border rounded p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="border rounded p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="self-end">
              <button
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 border rounded"
              >
                Reset
              </button>
            </div>
            <div className="ml-auto self-end">
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Inquiry_for</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Contacted</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{lead.name}</td>
                <td className="p-2 border">{lead.inquiry_for}</td>
                <td className="p-2 border">{lead.phone_number}</td>
                <td className="p-2 border">{lead.city}</td>
                <td className="p-2 border">{lead.budget}</td>
                <td className="p-2 border">{lead.property_category}</td>
                <td className="p-2 border">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <span
                    className={
                      lead.contacted
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {lead.contacted ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-2 border">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      lead.contacted ? "bg-yellow-500" : "bg-blue-600"
                    }`}
                    onClick={() => toggleContacted(lead.id, lead.contacted)}
                  >
                    Mark as {lead.contacted ? "Not Contacted" : "Contacted"}
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => deleteLead(lead.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <p className="mt-4 text-gray-500 text-center">
            No leads found for the selected criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default InquiryLeadsPage;
