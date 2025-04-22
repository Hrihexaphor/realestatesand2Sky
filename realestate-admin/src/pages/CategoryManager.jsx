import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryCategoryId, setSubcategoryCategoryId] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subcategory`);
      setSubcategories(res.data);
    } catch (err) {
      toast.error('Failed to load subcategories');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        // Update category
        await axios.put(`${BASE_URL}/api/category/${editingCategoryId}`, { name: categoryName });
        toast.success('Category updated');
      } else {
        // Add category
        await axios.post(`${BASE_URL}/api/category`, { name: categoryName });
        toast.success('Category added');
      }
      setCategoryName('');
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      toast.error('Error saving category');
    }
  };

  const handleCategoryEdit = (category) => {
    setCategoryName(category.name);
    setEditingCategoryId(category.id);
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`${BASE_URL}/api/category/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Error deleting category');
      }
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategoryId) {
        // Update subcategory
        await axios.put(`${BASE_URL}/api/subcategory/${editingSubcategoryId}`, {
          name: subcategoryName,
          category_id: subcategoryCategoryId
        });
        toast.success('Subcategory updated');
      } else {
        // Add subcategory
        await axios.post(`${BASE_URL}/api/subcategory`, {
          name: subcategoryName,
          category_id: subcategoryCategoryId
        });
        toast.success('Subcategory added');
      }
      setSubcategoryName('');
      setSubcategoryCategoryId('');
      setEditingSubcategoryId(null);
      fetchSubcategories();
    } catch (err) {
      toast.error('Error saving subcategory');
    }
  };

  const handleSubcategoryEdit = (subcategory) => {
    setSubcategoryName(subcategory.name);
    setSubcategoryCategoryId(subcategory.category_id);
    setEditingSubcategoryId(subcategory.id);
  };

  const handleSubcategoryDelete = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await axios.delete(`${BASE_URL}/api/subcategory/${id}`);
        toast.success('Subcategory deleted');
        fetchSubcategories();
      } catch (err) {
        toast.error('Error deleting subcategory');
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Property Category Management</h2>

      {/* Category Form */}
      <form onSubmit={handleCategorySubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="border p-2 rounded w-64"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingCategoryId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Categories List */}
      <ul className="mb-10">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center border-b py-2">
            <span>{cat.name}</span>
            <div>
              <button onClick={() => handleCategoryEdit(cat)} className="mr-2 text-blue-500">Edit</button>
              <button onClick={() => handleCategoryDelete(cat.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-4">Property Subcategory Management</h2>

      {/* Subcategory Form */}
      <form onSubmit={handleSubcategorySubmit} className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          placeholder="Subcategory Name"
          className="border p-2 rounded w-64"
          required
        />
        <select
          value={subcategoryCategoryId}
          onChange={(e) => setSubcategoryCategoryId(e.target.value)}
          className="border p-2 rounded w-64"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingSubcategoryId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Subcategories List */}
      <ul>
        {subcategories.map((sub) => (
          <li key={sub.id} className="flex justify-between items-center border-b py-2">
            <span>{sub.name} — <span className="text-sm text-gray-500">Category ID: {sub.category_id}</span></span>
            <div>
              <button onClick={() => handleSubcategoryEdit(sub)} className="mr-2 text-blue-500">Edit</button>
              <button onClick={() => handleSubcategoryDelete(sub.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
