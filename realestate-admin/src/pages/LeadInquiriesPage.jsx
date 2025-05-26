import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeadInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/propinquiry");
      setInquiries(res.data);
    } catch (err) {
      toast.error("Failed to load inquiries");
    }
  };

  const handleToggleContacted = async (id) => {
    try {
      await axios.patch(`http://localhost:3001/api/propinquiry/${id}/contacted`);
      toast.success("Lead status updated");
      fetchInquiries(); // refresh list
    } catch (err) {
      toast.error("Failed to update lead status");
    }
  };

  const handleDownloadExcel = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select both start and end dates");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/api/propinquiry", {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
        responseType: "blob", // important for binary files
      });

      // Create downloadable link
      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leads_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download Excel");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Property Inquiries</h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border rounded px-2 py-1"
            placeholderText="Select start date"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border rounded px-2 py-1"
            placeholderText="Select end date"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <button
          onClick={handleDownloadExcel}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Project</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Contacted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {inquiries.map((inq, index) => (
              <tr key={inq.id}>
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{inq.title}</td>
                <td className="px-4 py-2 text-sm">{inq.project_name}</td>
                <td className="px-4 py-2 text-sm">{inq.name}</td>
                <td className="px-4 py-2 text-sm">{inq.email}</td>
                <td className="px-4 py-2 text-sm">{inq.phone}</td>
                <td className="px-4 py-2 text-sm">
                  {new Date(inq.inquiry_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleToggleContacted(inq.id)}
                    className={`px-3 py-1 rounded text-white ${
                      inq.contacted ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {inq.contacted ? "Contacted" : "Not Contacted"}
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No inquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadInquiriesPage;
