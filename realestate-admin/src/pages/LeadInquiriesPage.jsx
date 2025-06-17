import React, { useEffect, useState } from "react";
import { Calendar, Download, Search, Filter, Users, Phone, Mail, Building } from "lucide-react";

const LeadInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, contacted: 0, pending: 0 });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Since we can't make actual API calls in this environment, 
      // I'll simulate the API response with your data structure
      
      // Uncomment and modify this section for your actual implementation:
    
      
      const res = await fetch(`${BASE_URL}/api/propinquiry`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      setInquiries(data);
      setFilteredInquiries(data);
      calculateStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError(`Failed to fetch inquiries: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterInquiries();
  }, [inquiries, startDate, endDate, searchTerm, statusFilter]);

  const calculateStats = (data) => {
    const total = data.length;
    const contacted = data.filter(inq => inq.contacted).length;
    const pending = total - contacted;
    setStats({ total, contacted, pending });
  };

  const filterInquiries = () => {
    let filtered = [...inquiries];

    // Date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(inq => {
        const inquiryDate = new Date(inq.inquiry_time);
        return inquiryDate >= start && inquiryDate <= end;
      });
    }

    // Search filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inq => 
        inq.name.toLowerCase().includes(term) ||
        inq.email.toLowerCase().includes(term) ||
        inq.title.toLowerCase().includes(term) ||
        inq.project_name.toLowerCase().includes(term) ||
        inq.phone.includes(term)
      );
    }

    // Status filtering
    if (statusFilter !== "all") {
      filtered = filtered.filter(inq => 
        statusFilter === "contacted" ? inq.contacted : !inq.contacted
      );
    }

    setFilteredInquiries(filtered);
    calculateStats(filtered);
  };

const handleToggleContacted = async (id) => {
  // Update local state first for immediate UI feedback
  const updatedInquiries = inquiries.map(inq =>
    inq.id === id ? { ...inq, contacted: !inq.contacted } : inq
  );
  setInquiries(updatedInquiries);

  // Also update the backend
  try {
    await fetch(`${BASE_URL}/api/propinquiry/${id}/contacted`, {
     method: 'PATCH',  // Use PATCH instead of PUT
       headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ contacted: !inquiries.find(inq => inq.id === id).contacted })
    });
  } catch (error) {
    console.error('Failed to update:', error);
    // Revert local state if API call fails
    setInquiries(inquiries);
  }
};

  const handleDownloadExcel = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const headers = ["#", "Title", "Project", "Name", "Email", "Phone", "Date", "Contacted"];
    const csvContent = [
      headers.join(","),
      ...filteredInquiries.map((inq, index) => [
        index + 1,
        `"${inq.title}"`,
        `"${inq.project_name}"`,
        `"${inq.name}"`,
        inq.email,
        inq.phone,
        new Date(inq.inquiry_time).toLocaleString(),
        inq.contacted ? "Yes" : "No"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Inquiries</h1>
              <p className="text-gray-600">Manage and track your property leads</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchInquiries}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
              </div>
              <Phone className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Mail className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start Date"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="contacted">Contacted</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadExcel}
                disabled={!startDate || !endDate}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading inquiries...</span>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead_source</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((inq, index) => (
                    <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inq.lead_source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inq.project_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{inq.name}</div>
                        <div className="text-sm text-gray-500">{inq.email}</div>
                        <div className="text-sm text-gray-500">{inq.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inq.inquiry_time).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(inq.inquiry_time).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleContacted(inq.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            inq.contacted
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {inq.contacted ? "✓ Contacted" : "⏳ Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {!loading && filteredInquiries.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Users size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No inquiries found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadInquiriesPage;