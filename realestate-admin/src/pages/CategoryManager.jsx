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

  const getCategoryNameById = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Property Management Dashboard</h1>
        
        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
            <span className="text-sm text-gray-500">{categories.length} total</span>
          </div>

          {/* Category Form */}
          <form onSubmit={handleCategorySubmit} className="mb-6 bg-gray-50 p-4 rounded-lg flex flex-wrap items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className={`px-6 py-2 rounded-md font-medium text-white ${
                editingCategoryId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {editingCategoryId ? 'Update Category' : 'Add Category'}
            </button>
            {editingCategoryId && (
              <button 
                type="button" 
                onClick={() => {
                  setCategoryName('');
                  setEditingCategoryId(null);
                }}
                className="px-6 py-2 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Categories List */}
          {categories.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <li key={cat.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{cat.name}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleCategoryEdit(cat)} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleCategoryDelete(cat.id)} 
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No categories found. Add your first category above.
            </div>
          )}
        </div>

        {/* Subcategories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Subcategories</h2>
            <span className="text-sm text-gray-500">{subcategories.length} total</span>
          </div>

          {/* Subcategory Form */}
          <form onSubmit={handleSubcategorySubmit} className="mb-6 bg-gray-50 p-4 rounded-lg flex flex-wrap gap-4">
            <div className="w-full md:w-5/12">
              <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory Name
              </label>
              <input
                id="subcategoryName"
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-5/12">
              <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                id="categorySelect"
                value={subcategoryCategoryId}
                onChange={(e) => setSubcategoryCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-end">
              <button 
                type="submit" 
                className={`px-6 py-2 rounded-md font-medium text-white ${
                  editingSubcategoryId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {editingSubcategoryId ? 'Update' : 'Add'}
              </button>
              {editingSubcategoryId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSubcategoryName('');
                    setSubcategoryCategoryId('');
                    setEditingSubcategoryId(null);
                  }}
                  className="px-6 py-2 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Subcategories List */}
          {subcategories.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subcategories.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryNameById(sub.category_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleSubcategoryEdit(sub)} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleSubcategoryDelete(sub.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No subcategories found. Add your first subcategory above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;