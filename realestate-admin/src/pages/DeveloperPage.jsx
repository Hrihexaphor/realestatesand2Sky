import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchBox from '../components/SearchBox';

const DeveloperPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
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
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Developer updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/developer`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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

  const filteredDevelopers = developers.filter(dev => 
    dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.state.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Developer Directory
            </h2>
            <SearchBox placeholder="Search developers..." value={searchTerm} onChange={(val) => setSearchTerm(val)} />
          </div>
          
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
          ) : filteredDevelopers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No developers match your search criteria.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredDevelopers.map((dev) => (
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
                            src={`http://localhost:3001/${dev.developer_logo}`}
                            alt={`${dev.company_name} logo`}
                            className="w-16 h-16 object-contain bg-white rounded-md border p-1"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md text-gray-400 border">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                      </div> */}
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{dev.name}</h3>
                        <p className="text-blue-600 font-medium">{dev.company_name}</p>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {dev.contact_email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {dev.phone_number}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8zm0 0V5m0 10v3" />
                            </svg>
                            {dev.partial_amount}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {dev.address}, {dev.city}, {dev.state}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(dev)}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, id: dev.id })}
                        className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this developer? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
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