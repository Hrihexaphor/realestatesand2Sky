import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchBox from '../components/SearchBox';
import * as XLSX from 'xlsx';

const DeveloperPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Date filter states
  const [dateFilter, setDateFilter] = useState({
    fromDate: '',
    toDate: '',
    showFilter: false
  });
  
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    contact_email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    partial_amount: '',
    developerImage: null
  });
  
  const [errors, setErrors] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/developer`);
      console.log(res.data);
      setDevelopers(res.data);
    } catch (err) {
      toast.error('Failed to fetch developers');
      console.error('Error fetching developers:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Basic validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!form.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
      isValid = false;
    }

    if (!form.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.contact_email)) {
      newErrors.contact_email = 'Email format is invalid';
      isValid = false;
    }

    if (!form.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
      isValid = false;
    }

    // Image validation
    if (form.developerImage && form.developerImage.size > 5 * 1024 * 1024) {
      newErrors.developerImage = 'Logo must be less than 5MB';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, developerImage: 'Logo must be less than 5MB' });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setForm({ ...form, developerImage: file });
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.developerImage) {
        setErrors({ ...errors, developerImage: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'developerImage') {
          if (form[key]) {
            formData.append(key, form[key]);
          }
        } else {
          formData.append(key, form[key]);
        }
      });
      
      if (editingId) {
          await axios.put(`${BASE_URL}/api/developer/${editingId}`, formData, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
          toast.success('Developer updated successfully');
        } else {
          await axios.post(`${BASE_URL}/api/developer`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          toast.success('Developer added successfully');
        }
      resetForm();
      fetchDevelopers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving developer');
      console.error('Error saving developer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '', 
      company_name: '',
      contact_email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      partial_amount: '',
      developerImage: null
    });
    setEditingId(null);
    setErrors({});
    setPreviewImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (dev) => {
    setForm({
      name: dev.name,
      company_name: dev.company_name,
      contact_email: dev.contact_email,
      phone_number: dev.phone_number,
      address: dev.address || '',
      city: dev.city || '',
      state: dev.state || '',
      partial_amount: dev.partial_amount || '',
      developerImage: null // Reset file input when editing
    });
    
    setEditingId(dev.id);
    
    // Set preview image if developer has a logo
    if (dev.developer_logo) {
      setPreviewImage(`${BASE_URL}/${dev.developer_logo}`);
    } else {
      setPreviewImage(null);
    }
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/developer/${deleteModal.id}`);
      toast.success('Developer deleted successfully');
      fetchDevelopers();
    } catch (err) {
      toast.error('Error deleting developer');
      console.error('Error deleting developer:', err);
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  // Filter developers by search term
  const filteredDevelopers = developers.filter(dev => 
    dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.state.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Filter developers by date range
  const getDateFilteredDevelopers = () => {
    if (!dateFilter.fromDate && !dateFilter.toDate) {
      return filteredDevelopers;
    }

    return filteredDevelopers.filter(dev => {
      // Assuming your developer object has created_at or updated_at field
      // Adjust the field name based on your actual database structure
      const devDate = new Date(dev.created_at || dev.updated_at);
      const fromDate = dateFilter.fromDate ? new Date(dateFilter.fromDate) : null;
      const toDate = dateFilter.toDate ? new Date(dateFilter.toDate + 'T23:59:59') : null;

      if (fromDate && toDate) {
        return devDate >= fromDate && devDate <= toDate;
      } else if (fromDate) {
        return devDate >= fromDate;
      } else if (toDate) {
        return devDate <= toDate;
      }
      return true;
    });
  };

  // Excel export function
  const exportToExcel = async () => {
    try {
      setExporting(true);
      
      const dataToExport = getDateFilteredDevelopers();
      
      if (dataToExport.length === 0) {
        toast.warning('No data available for the selected date range');
        return;
      }

      // Prepare data for Excel export
      const excelData = dataToExport.map((dev, index) => ({
        'S.No': index + 1,
        'Name': dev.name,
        'Company Name': dev.company_name,
        'Email': dev.contact_email,
        'Phone': dev.phone_number,
        'Address': dev.address || '',
        'City': dev.city || '',
        'State': dev.state || '',
        'Partial Amount': dev.partial_amount || '',
        'Created Date': dev.created_at ? new Date(dev.created_at).toLocaleDateString() : '',
        'Updated Date': dev.updated_at ? new Date(dev.updated_at).toLocaleDateString() : ''
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 6 },  // S.No
        { wch: 20 }, // Name
        { wch: 25 }, // Company Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 30 }, // Address
        { wch: 15 }, // City
        { wch: 15 }, // State
        { wch: 15 }, // Partial Amount
        { wch: 12 }, // Created Date
        { wch: 12 }  // Updated Date
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Developers');

      // Generate filename with date range
      let filename = 'developers_list';
      if (dateFilter.fromDate || dateFilter.toDate) {
        const fromStr = dateFilter.fromDate || 'start';
        const toStr = dateFilter.toDate || 'end';
        filename += `_${fromStr}_to_${toStr}`;
      }
      filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Excel file exported successfully! (${dataToExport.length} records)`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel file');
    } finally {
      setExporting(false);
    }
  };

  // Handle date filter changes
  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFilter({
      fromDate: '',
      toDate: '',
      showFilter: dateFilter.showFilter
    });
  };

  // Form fields organized by section
  const formSections = [
    {
      title: "Personal Information",
      fields: ["name", "company_name"]
    },
    {
      title: "Contact Details",
      fields: ["contact_email", "phone_number"]
    },
    {
      title: "Payment",
      fields: ["partial_amount"]
    },
    {
      title: "Address Information",
      fields: ["address", "city", "state"]
    }
  ];

  const dateFilteredDevelopers = getDateFilteredDevelopers();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Developer Management</h1>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {editingId ? 'Edit Developer' : 'Add New Developer'}
          </h2>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Developer Logo Upload Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Developer Logo</h3>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="developerImage" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="developerImage" 
                        name="developerImage"
                        type="file"
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  {errors.developerImage && <p className="mt-1 text-sm text-red-600">{errors.developerImage}</p>}
                  <p className="mt-2 text-xs text-gray-500">Upload your company logo for better brand visibility.</p>
                </div>
                
                {/* Preview Image */}
                {previewImage && (
                  <div className="w-full md:w-1/2">
                    <div className="p-2 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                        <img 
                          src={previewImage} 
                          alt="Developer Logo Preview" 
                          className="max-h-28 max-w-full object-contain"
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreviewImage(null);
                        setForm({...form, developerImage: null});
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove logo
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {formSections.map(section => (
              <div key={section.title} className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{section.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.fields.map(field => (
                    <div key={field} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replace(/_/g, ' ')}
                        {(field === 'name' || field === 'company_name' || field === 'contact_email' || field === 'phone_number') && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <input
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                        className={`border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800`}
                      />
                      {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end space-x-3 mt-8">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-colors flex items-center`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  editingId ? 'Update Developer' : 'Add Developer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Developer Directory ({dateFilteredDevelopers.length} records)
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <SearchBox 
                placeholder="Search developers..." 
                value={searchTerm} 
                onChange={(val) => setSearchTerm(val)} 
              />
              
              {/* Filter Toggle Button */}
              {/* <button
                onClick={() => setDateFilter(prev => ({ ...prev, showFilter: !prev.showFilter }))}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filter by Date
              </button> */}
              
              {/* Export Button */}
              <button
                onClick={exportToExcel}
                disabled={exporting || dateFilteredDevelopers.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                {exporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Date Filter Panel */}
          {dateFilter.showFilter && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={dateFilter.fromDate}
                    onChange={(e) => handleDateFilterChange('fromDate', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={dateFilter.toDate}
                    onChange={(e) => handleDateFilterChange('toDate', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearDateFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {(dateFilter.fromDate || dateFilter.toDate) && (
                <div className="mt-3 text-sm text-blue-600">
                  <strong>Active Filter:</strong> 
                  {dateFilter.fromDate && ` From ${new Date(dateFilter.fromDate).toLocaleDateString()}`}
                  {dateFilter.fromDate && dateFilter.toDate && ' - '}
                  {dateFilter.toDate && ` To ${new Date(dateFilter.toDate).toLocaleDateString()}`}
                </div>
              )}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : developers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No developers found. Add your first developer above.
            </div>
          ) : dateFilteredDevelopers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No developers match your search criteria or date filter.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {dateFilteredDevelopers.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      {/* Developer Logo */}
                      {/* <div className="flex-shrink-0">
                        {dev.developer_logo ? (
                          <img 
                            src={`${BASE_URL}/${dev.developer_logo}`} 
                            alt={`${dev.company_name} logo`}
                            className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white p-1"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                      </div> */}
                      
                      {/* Developer Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{dev.name}</h3>
                          <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                            ID: {dev.id}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <strong>Company:</strong> <span className="ml-1">{dev.company_name}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <strong>Email:</strong> <span className="ml-1">{dev.contact_email}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <strong>Phone:</strong> <span className="ml-1">{dev.phone_number}</span>
                            </div>
                          </div>
                          
                          {(dev.address || dev.city || dev.state) && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <strong>Address:</strong> 
                              <span className="ml-1">
                                {[dev.address, dev.city, dev.state].filter(Boolean).join(', ')}
                              </span>
                            </div>
                          )}
                          
                          {dev.partial_amount && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <strong>Partial Amount:</strong> <span className="ml-1">₹{dev.partial_amount}</span>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {dev.created_at && (
                              <span>
                                <strong>Created:</strong> {new Date(dev.created_at).toLocaleDateString()}
                              </span>
                            )}
                            {dev.updated_at && (
                              <span>
                                <strong>Updated:</strong> {new Date(dev.updated_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleEdit(dev)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => setDeleteModal({ show: true, id: dev.id })}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this developer? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPage;