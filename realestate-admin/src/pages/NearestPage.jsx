import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NearestToPage = () => {
  const [nearestList, setNearestList] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchNearest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/nearest`);
      setNearestList(res.data);
    } catch (err) {
      toast.error("Failed to fetch nearest locations");
    }
  };

  useEffect(() => {
    fetchNearest();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/nearest/${editId}`, form);
        toast.success("Nearest location updated");
      } else {
        await axios.post(`${BASE_URL}/api/nearest`, form);
        toast.success("Nearest location added");
      }
      setForm({ name: "" });
      setEditId(null);
      fetchNearest();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/nearest/${id}`);
      toast.success("Deleted successfully");
      fetchNearest();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Nearest To Management</h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Nearest location name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          className="border border-gray-800 px-4 py-2 rounded w-80"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-3">
        {nearestList.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow border"
          >
            <span className="text-gray-800 font-medium">{item.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
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

export default NearestToPage;
