import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AmenityPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '' });

  const fetchAmenities = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/amenities`);
    setAmenities(res.data);
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/amenities`, form);
      toast.success('Amenity added');
      fetchAmenities();
    } catch (err) {
      toast.error('Failed to add amenity');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/amenities${id}`);
    fetchAmenities();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Amenities</h1>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3 w-full max-w-md">
  <input
    placeholder="Amenity Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
  />
  <input
    placeholder="Icon (e.g. pool-icon.png)"
    value={form.icon}
    onChange={(e) => setForm({ ...form, icon: e.target.value })}
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
  />
  <button
    onClick={handleAdd}
    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
  >
    Add Amenity
  </button>
</div>
      <ul className="space-y-2">
      {amenities.map((a) => (
    <li
      key={a.id}
      className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
    >
      <div className="flex items-center space-x-2 text-gray-800">
        <span className="text-base font-medium">{a.name}</span>
        <span className="text-sm text-gray-500 italic">({a.icon})</span>
      </div>
      <button
        onClick={() => handleDelete(a.id)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
      >
        Delete
      </button>
    </li>
  ))}
      </ul>
    </div>
  );
};
export default AmenityPage;