import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';



export function AdvertisementForm() {
  const [form, setForm] = useState({
    link: '',
    image: null,
    image_url: '',
    image_size: '',
    location: '',
    start_date: '',
    end_date: '',
    cityIds: [],
  });
  const [cities, setCities] = useState([]);
  const [ads, setAds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Dropdown options
  const imageSizes = [
    { value: '500x500', label: '500 x 500 (Square)' },
    { value: '1920x1080', label: '1920 x 1080 (Landscape)' },
  ];

  const locations = [
    { value: 'home', label: 'Home' },
    { value: 'property_details', label: 'Property Details' },
    { value: 'blog', label: 'Blog' },
  ];

useEffect(() => {
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cities`);
      console.log(response.data)
      // Ensure cities is always an array
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      setCities([]); // fallback to empty array on error
    }
  };

  fetchCities();
  fetchAdvertisements()
}, [])

  const fetchAdvertisements = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/advertisement`);
      console.log("Hii hritesh")
      console.log(res.data);
      setAds(res.data);
    } catch (err) {
      toast.error('Failed to load advertisements');
    }
  };

 const handleInputChange = (e) => {
  const { name, value, type, files } = e.target;
  
  if (type === 'file') {
    const file = files[0];
    if (file) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      if (file.size > maxSize) {
        toast.error('File size exceeds 10MB. Please choose a smaller file.');
        // Clear the file input
        e.target.value = '';
        return;
      }
      
      setForm({ ...form, image: file });
    }
  } else {
    setForm({ ...form, [name]: value });
  }
};

  const handleCityToggle = (cityId) => {
    setForm((prev) => ({
      ...prev,
      cityIds: prev.cityIds.includes(cityId)
        ? prev.cityIds.filter((id) => id !== cityId)
        : [...prev.cityIds, cityId],
    }));
  };

  const handleCancel = () => {
    setForm({
      link: '',
      image: null,
      image_url: '',
      image_size: '',
      location: '',
      start_date: '',
      end_date: '',
      cityIds: [],
    });
    setEditingId(null);
  };

  const handleRemoveImage = () => {
    setForm({ ...form, image: null, image_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image && !form.image_url && !editingId) {
      return toast.error('Image is required');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'cityIds') {
        formData.append(key, value.join(','));
      } else if (key === 'image' && value) {
        formData.append('advertisementImage', value);
      } else if (key !== 'image') {
        formData.append(key, value);
      }
    });

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/advertisement/${editingId}`, formData);
        toast.success('Advertisement updated');
      } else {
        await axios.post(`${BASE_URL}/api/advertisement`, formData);
        toast.success('Advertisement created');
      }
      fetchAdvertisements();
      setForm({
        link: '',
        image: null,
        image_url: '',
        image_size: '',
        location: '',
        start_date: '',
        end_date: '',
        cityIds: [],
      });
      setEditingId(null);
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const handleEdit = (ad) => {
  setForm({
    link: ad.link || '',
    image: null,
    image_url: ad.image_url || '',
    image_size: ad.image_size || '',
    location: ad.location || '',
    start_date: ad.start_date ? ad.start_date.slice(0, 10) : '',
    end_date: ad.end_date ? ad.end_date.slice(0, 10) : '',
    cityIds: ad.cities?.map((c) => c.id) || [],
  });
  setEditingId(ad.id);
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this advertisement?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/advertisement/${id}`);
      fetchAdvertisements();
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Advertisement Management</h2>
          <p className="text-gray-600">Create and manage your advertisements</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingId ? 'Edit Advertisement' : 'Create New Advertisement'}
            </h3>
            {editingId && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {/* Link Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Advertisement Link</label>
                <input 
                  name="link" 
                  value={form.link} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400" 
                />
              </div>

              {/* Image Size Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Image Size</label>
                <select 
                  name="image_size" 
                  value={form.image_size} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                >
                  <option value="">Select image size</option>
                  {imageSizes.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>

              {/* Location Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <select 
                  name="location" 
                  value={form.location} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date" 
                  name="start_date" 
                  value={form.start_date} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400" 
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date" 
                  name="end_date" 
                  value={form.end_date} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400" 
                />
              </div>
            </div>

            {/* Cities Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Select Cities</label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cities.map((city) => (
                    <label key={city.id} className="flex items-center space-x-2 cursor-pointer hover:bg-white rounded p-2 transition-colors duration-150">
                      <input
                        type="checkbox"
                        checked={form.cityIds.includes(city.id)}
                        onChange={() => handleCityToggle(city.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{city.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Advertisement Image</label>
              {form.image_url && !form.image ? (
                <div className="relative inline-block">
                  <div className="group relative">
                    <img 
                      src={`${BASE_URL}/${form.image_url}`} 
                      alt="Uploaded" 
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : form.image ? (
                <div className="relative inline-block">
                  <div className="group relative">
                    <div className="w-48 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">{form.image.name}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-200">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">Upload a file</span>
                      <input 
                        type="file" 
                        onChange={handleInputChange} 
                        name="image" 
                        className="sr-only" 
                        accept="image/*"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editingId ? 'Update Advertisement' : 'Create Advertisement'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Advertisements Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">All Advertisements</h3>
            <p className="text-gray-600 mt-1">Manage your existing advertisements</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cities</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad, index) => (
                  <tr key={ad.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={`${ad.image_url}`} 
                        alt="Ad" 
                        className="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={ad.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm max-w-xs truncate block"
                      >
                        {ad.link}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {ad.location?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {ad.cities?.map(c => c.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(ad)} 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors duration-150"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(ad.id)} 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {ads.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
                <p className="text-gray-500">Create your first advertisement to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvertisementForm;