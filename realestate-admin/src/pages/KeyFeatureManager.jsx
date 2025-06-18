import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// const BASE_URL = "http://localhost:3001";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KeyFeatureManager = () => {
  const [features, setFeatures] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/keyfeature`);
      setFeatures(res.data);
    } catch (err) {
      toast.error("Failed to load features");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Name is required");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/keyfeature/${editingId}`,
          { name, description },
          { withCredentials: true }
        );
        toast.success("Feature updated");
      } else {
        await axios.post(
          `${BASE_URL}/api/keyfeature`,
          { name, description },
          {
            withCredentials: true,
          }
        );
        toast.success("Feature added");
      }
      setName("");
      setEditingId(null);
      fetchFeatures();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (feature) => {
    setName(feature.name);
    setDescription(feature.description || "");
    setEditingId(feature.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/api/keyfeature/${id}`);
      toast.success("Feature deleted");
      fetchFeatures();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Key Features</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature description (hover text)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Feature Name</th>
            <th className="px-4 py-2 border">Feature Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{feature.name}</td>
              <td className="px-4 py-2 border">{feature.description}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(feature)}
                  className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(feature.id)}
                  className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {features.length === 0 && (
            <tr>
              <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                No key features added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KeyFeatureManager;
