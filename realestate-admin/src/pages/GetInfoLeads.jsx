import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const GetInfoLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getinfo`);
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const markAsContacted = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/getinfo/${id}/contacted`);
      fetchLeads(); // refresh after update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter((lead) => {
        const createdAt = new Date(lead.created_at);
        return (
          createdAt.toDateString() === date.toDateString()
        );
      });
      setFilteredLeads(filtered);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLeads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GetInfoLeads");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "GetInfoLeads.xlsx");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div>
          <label className="font-semibold text-lg">Filter by Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="border px-3 py-1 rounded ml-2"
            placeholderText="Select date"
          />
        </div>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Reason</th>
              <th className="border px-4 py-2">Dealer</th>
              <th className="border px-4 py-2">Plan to Buy</th>
              <th className="border px-4 py-2">Interested In</th>
              <th className="border px-4 py-2">Contacted</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr key={lead.id}>
                  <td className="border px-3 py-1">{index + 1}</td>
                  <td className="border px-3 py-1">{lead.name}</td>
                  <td className="border px-3 py-1">{lead.email}</td>
                  <td className="border px-3 py-1">{lead.phone}</td>
                  <td className="border px-3 py-1">{lead.reason_to_buy}</td>
                  <td className="border px-3 py-1">{lead.is_property_dealer ? "Yes" : "No"}</td>
                  <td className="border px-3 py-1">{lead.when_plan_to_buy}</td>
                  <td className="border px-3 py-1">
                    {Array.isArray(lead.interested) ? lead.interested.join(", ") : ""}
                  </td>
                  <td className="border px-3 py-1">
                    {lead.contacted ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="border px-3 py-1 text-center">
                    {!lead.contacted && (
                      <button
                        onClick={() => markAsContacted(lead.id)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Mark as Contacted
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetInfoLeads;
