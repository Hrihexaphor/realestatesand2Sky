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
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

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
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name });
    setEditId(item.id);
    setError('');
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/nearest/${deleteModal.id}`);
      toast.success('Deleted successfully');
      fetchNearest();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: '' });
    setEditId(null);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-800">
        Nearest To Management
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Location Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. School, Hospital"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${submitting && 'opacity-70 cursor-not-allowed'}`}
          >
            {submitting ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update' : 'Add')}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Nearest Locations</h3>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : nearestList.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No locations found. Add a new one!</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {nearestList.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border hover:shadow transition"
              >
                <span className="text-gray-800 font-medium">{item.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, id: item.id })}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this location? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default NearestToPage;
