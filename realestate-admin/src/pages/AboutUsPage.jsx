import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AboutUsPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aboutImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [aboutList, setAboutList] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/aboutus`);
      setAboutList(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch About Us data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, aboutImage: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, aboutImage: null }));
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('aboutImage');
    if (fileInput) fileInput.value = '';
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
      setImagePreview(null);
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
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Manage About Us</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={handleEditorChange}
                config={{
                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo']
                }}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <label className="flex items-center justify-center px-4 py-2 bg-white text-amber-500 rounded-md shadow-sm border border-amber-500 cursor-pointer hover:bg-amber-50 transition">
                  <span>Choose File</span>
                  <input
                    type="file"
                    id="aboutImage"
                    name="aboutImage"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {formData.aboutImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-3 flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    <FaTimes className="mr-1" /> Remove
                  </button>
                )}
              </div>
              
              {imagePreview && (
                <div className="relative w-48 h-32 border rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className=" bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition font-medium shadow-md flex items-center justify-center"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Us Content</h3>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 border font-semibold">#</th>
              <th className="py-3 px-4 border font-semibold">Title</th>
              <th className="py-3 px-4 border font-semibold">Description</th>
              <th className="py-3 px-4 border font-semibold">Image</th>
              <th className="py-3 px-4 border font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aboutList.map((item, index) => (
              <tr key={item.id} className="text-center hover:bg-gray-50">
                <td className="py-3 px-4 border">{index + 1}</td>
                <td className="py-3 px-4 border font-medium">{item.title}</td>
                <td className="py-3 px-4 border text-left max-w-xs">
                  <div className="truncate max-h-12 overflow-hidden" dangerouslySetInnerHTML={{ __html: item.description }} />
                </td>
                <td className="py-3 px-4 border">
                  {item.image_url ? (
                    <div className="relative group">
                      <img
                        src={`${item.image_url}`}
                        alt="about"
                        className="h-14 w-20 object-cover mx-auto rounded shadow-sm group-hover:opacity-90 transition"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <a 
                          href={item.image_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="py-3 px-4 border">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => toast.info('Edit feature coming soon')}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {aboutList.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="font-medium">No entries found.</p>
                    <p className="text-sm text-gray-400">Add your first About Us content above</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AboutUsPage;