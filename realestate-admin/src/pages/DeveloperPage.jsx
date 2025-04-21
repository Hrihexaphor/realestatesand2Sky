import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeveloperPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    company_name: '',
    contact_email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/developer');
      setDevelopers(res.data);
    } catch (err) {
      toast.error('Failed to fetch developers');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/developer/${editingId}`, form);
        toast.success('Developer updated');
      } else {
        await axios.post('http://localhost:3001/api/developer', form);
        toast.success('Developer added');
      }
      setForm({ name: '', company_name: '', contact_email: '', phone_number: '', address: '', city: '', state: '' });
      setEditingId(null);
      fetchDevelopers();
    } catch (err) {
      toast.error('Error saving developer');
    }
  };

  const handleEdit = (dev) => {
    setForm(dev);
    setEditingId(dev.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/developer/${id}`);
      toast.success('Developer deleted');
      fetchDevelopers();
    } catch (err) {
      toast.error('Error deleting developer');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add / Edit Developer</h2>
      <div className="grid grid-cols-2 gap-4 max-w-4xl bg-white p-6 rounded-lg shadow">
        {Object.keys(form).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.replace(/_/g, ' ').toUpperCase()}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          {editingId ? 'Update Developer' : 'Add Developer'}
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-10 mb-4">All Developers</h3>
      <ul className="space-y-3 max-w-4xl">
        {developers.map((dev) => (
          <li
            key={dev.id}
            className="bg-gray-50 border p-4 rounded shadow flex justify-between items-center"
          >
            <div className="text-gray-800">
              <p className="font-medium ">{dev.name} - {dev.company_name}</p>
              <p className="text-sm text-gray-500">{dev.contact_email} | {dev.phone_number}</p>
              <p className="text-sm text-gray-500">{dev.address}, {dev.city}, {dev.state}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(dev)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dev.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeveloperPage;
