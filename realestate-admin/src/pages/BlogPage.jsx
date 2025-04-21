// src/pages/BlogPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: null });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/blogs');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.image) formData.append('blogImage', form.image); // name should match multer field

    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/blogs/${editingId}`, formData);
        toast.success('Blog updated');
      } else {
        await axios.post('http://localhost:3001/api/addblog', formData);
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
      await axios.delete(`http://localhost:3001/api/blogs/${id}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Blogs</h2>

      {/* Blog Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-lg shadow-md mb-8">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          className="w-full border rounded px-4 py-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter blog description"
          className="w-full border rounded px-4 py-2"
          rows="4"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {editingId ? 'Update Blog' : 'Add Blog'}
        </button>
      </form>

      {/* Blog List */}
      <ul className="space-y-4">
        {blogs.map((b) => (
          <li key={b.id} className="bg-white p-5 rounded-lg shadow flex justify-between items-start">
            <div className="flex gap-4">
              {b.image_url && (
                <img src={b.image_url} alt={b.title} className="w-28 h-28 object-cover rounded" />
              )}
              <div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{b.description}</p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(b)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
