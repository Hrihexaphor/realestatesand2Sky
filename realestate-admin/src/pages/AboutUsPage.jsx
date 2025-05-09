import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AboutUsPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aboutImage: null,
  });

  const [aboutList, setAboutList] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/aboutus`);
      console.log(res)
      setAboutList(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch About Us data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, aboutImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.aboutImage) {
      toast.error('All fields are required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('aboutImage', formData.aboutImage);

    try {
      await axios.post(`${BASE_URL}/api/addAbout`, data);
      toast.success('About Us content added!');
      setFormData({ title: '', description: '', aboutImage: null });
      fetchAboutUs();
    } catch (error) {
      toast.error('Failed to add content');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await axios.delete(`${BASE_URL}/api/aboutus/${id}`);
      toast.success('Deleted successfully');
      fetchAboutUs();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Manage About Us</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            name="aboutImage"
            onChange={handleFileChange}
            className="w-full mt-1"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition"
        >
          Submit
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full mt-8 border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-3 border">#</th>
              <th className="py-2 px-3 border">Title</th>
              <th className="py-2 px-3 border">Description</th>
              <th className="py-2 px-3 border">Image</th>
              <th className="py-2 px-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aboutList.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="py-2 px-3 border">{index + 1}</td>
                <td className="py-2 px-3 border">{item.title}</td>
                <td className="py-2 px-3 border text-left max-w-xs truncate">
                  {item.description}
                </td>
                <td className="py-2 px-3 border">
                  {item.image_url ? (
                    <img
                      src={`${item.image_url}`}
                      alt="about"
                      className="h-10 w-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="py-2 px-3 border space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => toast.info('Edit feature coming soon')}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {aboutList.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AboutUsPage;
