import React, { useState, useEffect } from 'react';
import axios from 'axios';

 const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CityManager() {
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCityId, setEditingCityId] = useState(null);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cities`);
      setCities(res.data);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      setError('City name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingCityId) {
        const res = await axios.put(`${BASE_URL}/cities/${editingCityId}`, { name: cityName });
        setCities(cities.map(city => city.id === editingCityId ? res.data : city));
        setEditingCityId(null);
      } else {
        const res = await axios.post(`${BASE_URL}/cities`, { name: cityName });
        setCities([...cities, res.data]);
      }
      setCityName('');
    } catch (err) {
      console.error('Error saving city:', err);
      setError(err.response?.data?.message || 'Failed to save city');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city) => {
    setCityName(city.name);
    setEditingCityId(city.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;

    try {
      await axios.delete(`${BASE_URL}/cities/${id}`);
      setCities(cities.filter(city => city.id !== id));
    } catch (err) {
      console.error('Error deleting city:', err);
      alert('Failed to delete city');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">City Management</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : editingCityId ? 'Update City' : 'Add City'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">All Cities</h3>
        {cities.length === 0 ? (
          <p className="text-gray-500">No cities added yet.</p>
        ) : (
          <ul className="space-y-2">
            {cities.map((city, index) => (
              <li
                key={city.id}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
              >
                <span>{index + 1}. {city.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(city)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
