import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {toast} from 'react-toastify';

const TermaAndServicesPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [policies, setPolicies] = useState([]);
  const [editId, setEditId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchPolicies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/termsandservice`);
      setPolicies(res.data);
    } catch (err) {
      toast.error('Failed to load policies');
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.warn('All fields are required');

    try {
       if (editId) {
    await axios.put(
      `${BASE_URL}/api/termsandservice/${editId}`,
      { title, description },
      { withCredentials: true }
    );
    toast.success('Policy updated');
  } else {
    await axios.post(
      `${BASE_URL}/api/addtermsandservice`,
      { title, description },
      { withCredentials: true }
    );
    toast.success('Policy added');
  }
      setTitle('');
      setDescription('');
      setEditId(null);
      fetchPolicies();
    } catch (err) {
      toast.error('Failed to save policy');
    }
  };

  const handleEdit = (policy) => {
    setTitle(policy.title);
    setDescription(policy.description);
    setEditId(policy.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/termsandservice/${id}`);
      toast.success('Policy deleted');
      fetchPolicies();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Manage Term's and Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter policy title"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => setDescription(editor.getData())}
          />
        </div>
        <button
          type="submit"
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
        >
          {editId ? 'Update' : 'Add'} Policy
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium mb-4">Existing Policies</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="border-t">
                  <td className="py-2 px-3">{policy.title}</td>
                  <td className="py-2 px-3 truncate max-w-xs" title={policy.description}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: policy.description.length > 100
                          ? policy.description.slice(0, 100) + '...'
                          : policy.description
                      }}
                    />
                  </td>
                  <td className="py-2 px-3 flex space-x-3">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">No policies added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TermaAndServicesPage;
