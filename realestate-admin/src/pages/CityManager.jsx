import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export default function CityTableManager() {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cities`);
      setCities(res.data);
    } catch (error) {
      toast.error("Failed to load cities");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!cityName.trim()) {
        toast.error("City name is required");
        return;
      }

      if (editingId) {
        const res = await axios.put(`${BASE_URL}/api/cities/${editingId}`, { name: cityName });
        setCities(cities.map(city => city.id === editingId ? res.data : city));
        toast.success("City updated successfully");
      } else {
        const res = await axios.post(`${BASE_URL}/api/cities`, { name: cityName });
        setCities([...cities, res.data]);
        toast.success("City added successfully");
      }

      setCityName("");
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving city");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city) => {
    setCityName(city.name);
    setEditingId(city.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/cities/${id}`);
      setCities(cities.filter((city) => city.id !== id));
      toast.success("City deleted successfully");
    } catch (err) {
      toast.error("Failed to delete city");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">City Manager</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter city name"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : editingId ? "Update City" : "Add City"}
        </button>
      </form>

      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">City Name</th>
            <th className="px-4 py-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-4 text-center text-gray-500">No cities found</td>
            </tr>
          ) : (
            cities.map((city, index) => (
              <tr key={city.id} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{city.name}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleEdit(city)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
