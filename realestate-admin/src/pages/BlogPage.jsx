// src/pages/BlogPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/blogs`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      toast.error('Failed to fetch blogs');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setForm({ ...form, description: data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.image) formData.append('blogImage', form.image);

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/blogs/${editingId}`, formData);
        toast.success('Blog updated');
      } else {
        await axios.post(`${BASE_URL}/api/addblog`, formData);
        toast.success('Blog added');
      }
      setForm({ title: '', description: '', image: null });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      toast.error('Blog operation failed');
    }
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, description: blog.description });
    setEditingId(blog.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/blogs/${id}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  // Function to truncate text for table display
  const truncateText = (text, maxLength = 100) => {
    // Strip HTML tags
    const strippedText = text.replace(/<[^>]+>/g, '');
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Manage Blogs
        </h2>

        {/* Blog Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="min-h-[300px]">
                <CKEditor
                  editor={ClassicEditor}
                  data={form.description}
                  onChange={handleEditorChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Image
              </label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {editingId ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>

        {/* Blog List - Tabular Format */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Blog Posts</h3>

        {blogs.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <p className="text-gray-500">No blog posts found. Create your first post above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.image_url ? (
                        <div className="h-16 w-16 rounded overflow-hidden">
                          <img 
                            src={blog.image_url} 
                            alt={blog.title} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs">
                        {truncateText(blog.description)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}