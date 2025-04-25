import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NearestToPage = () => {
  const [nearestList, setNearestList] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchNearest = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/nearest`);
      setNearestList(res.data);
    } catch (err) {
      toast.error('Failed to fetch nearest locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearest();
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Nearest location name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/nearest/${editId}`, form);
        toast.success('Nearest location updated');
      } else {
        await axios.post(`${BASE_URL}/api/nearest`, form);
        toast.success('Nearest location added');
      }
      setForm({ name: '' });
      setEditId(null);
      fetchNearest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name });
    setEditId(item.id);
    setError('');
    // Scroll to form
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/nearest/${deleteModal.id}`);
      toast.success('Deleted successfully');
      fetchNearest();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleteModal({ show: false, id: null, name: '' });
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: '' });
    setEditId(null);
    setError('');
  };

  const filteredLocations = nearestList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg mb-8 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">
          Nearest To Management
        </h2>
        <p className="opacity-80">Manage and organize nearby location references</p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        {/* Form Section - Takes up 2/5 of the grid on medium screens and larger */}
        <div className="md:col-span-2">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              {editId ? 'Edit Location' : 'Add New Location'}
            </h3>
            
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Location Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                className={`w-full border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} 
                  px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="e.g. School, Hospital, Park"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center
                  ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'} flex-1`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {editId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editId ? 'Update Location' : 'Add Location'}</>
                )}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Instructions Card */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 text-sm text-blue-800">
            <h4 className="font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h4>
            <ul className="ml-5 list-disc space-y-1">
              <li>Add locations like "School", "Park", "Hospital"</li>
              <li>Edit existing locations by clicking the edit button</li>
              <li>Search for specific locations using the search box</li>
            </ul>
          </div>
        </div>

        {/* List Section - Takes up 3/5 of the grid on medium screens and larger */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Nearest Locations</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search locations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-gray-500">Loading locations...</p>
                </div>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {searchTerm ? (
                  <p className="text-gray-500 text-center">No locations found matching "{searchTerm}"</p>
                ) : (
                  <>
                    <p className="text-gray-500 font-medium text-lg mb-1">No locations found</p>
                    <p className="text-gray-400 text-sm">Add your first location using the form</p>
                  </>
                )}
              </div>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2 -mr-2">
                {filteredLocations.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-md group"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-800 font-medium">{item.name}</span>
                    </div>
                    <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, id: item.id, name: item.name })}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            {nearestList.length > 0 && filteredLocations.length > 0 && (
              <div className="border-t mt-4 pt-3 text-sm text-gray-500">
                Showing {filteredLocations.length} of {nearestList.length} locations
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full animate-zoomIn">
            <div className="bg-red-50 text-red-600 p-3 rounded-full inline-flex mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-medium">{deleteModal.name}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this at the end of your component's CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-zoomIn {
          animation: zoomIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NearestToPage;