import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AmenityPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [errors, setErrors] = useState({ name: '', icon: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [submitting, setSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const validateForm = () => {
    const newErrors = { name: '', icon: '' };
    let isValid = true;
    
    if (!form.name.trim()) {
      newErrors.name = 'Amenity name is required';
      isValid = false;
    }
    
    if (!form.icon.trim()) {
      newErrors.icon = 'Icon name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/amenities`);
      setAmenities(res.data);
    } catch (err) {
      toast.error('Failed to load amenities');
      console.error('Error fetching amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/amenities`, form);
      toast.success('Amenity added successfully');
      setForm({ name: '', icon: '' });
      fetchAmenities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add amenity');
      console.error('Error adding amenity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/amenities/${deleteModal.id}`);
      toast.success('Amenity deleted successfully');
      fetchAmenities();
    } catch (err) {
      toast.error('Failed to delete amenity');
      console.error('Error deleting amenity:', err);
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Manage Amenities</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Amenity</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swimming Pool"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. pool-icon.png"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className={`w-full border ${errors.icon ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full ${submitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Add Amenity'}
              </button>
            </form>
          </div>
        </div>
        
        {/* List Section */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Amenities</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : amenities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No amenities found. Add your first one!
              </div>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{amenity.name}</h3>
                        <p className="text-sm text-gray-500">{amenity.icon}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteModal({ show: true, id: amenity.id })}
                      className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this amenity? This action cannot be undone.</p>
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

export default AmenityPage;