import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BlogCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blog-categories`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const slugified = value.toLowerCase().replace(/\s+/g, '-');
      setForm({ name: value, slug: slugified });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/blog-categories/${editingId}`, form);
      } else {
        await axios.post(`$${BASE_URL}/api/blogCategories`, form);
      }
      setForm({ name: '', slug: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/blog-categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Blog Categories</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-sm transition"
        >
          {editingId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">All Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.slug}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
