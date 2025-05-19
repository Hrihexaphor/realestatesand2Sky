import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdvertisementForm = () => {
  const [formData, setFormData] = useState({
    link: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
     cityIds: [],
  });
  const [cities, setCities] = useState([]);
  const [advertisementImage, setAdvertisementImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
useEffect(() => {
  axios.get(`http://localhost:3001/api/cities`).then(res => {
    console.log(res.data);
    setCities(res.data);
  });
}, []);
// useEffect(() => {
//   if (editingAd) {
//     setFormData({
//       ...editingAd,
//       cityIds: editingAd.cityIds || [], // ✅ fallback to empty array if undefined
//     });
//   }
// }, [editingAd]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdvertisementImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setAdvertisementImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('adImageInput');
    if (fileInput) fileInput.value = '';
  };

  const fetchAdvertisements = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/advertisement`);
      setAdvertisements(res.data);
    } catch (err) {
      console.error("Failed to fetch advertisements", err);
      toast.error("Failed to load advertisements");
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advertisementImage) {
      return toast.error("Image is required");
    }

    setIsLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("advertisementImage", advertisementImage);

    try {
      await axios.post(`${BASE_URL}/api/advertisement`, data);
      toast.success("Advertisement added successfully");
      setFormData({ link: "", position: "", location: "", start_date: "", end_date: "" });
      setAdvertisementImage(null);
      setImagePreview(null);
      fetchAdvertisements();
      // Reset file input
      const fileInput = document.getElementById('adImageInput');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      toast.error("Failed to add advertisement");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      try {
        await axios.delete(`${BASE_URL}/api/advertisement/${id}`);
        toast.success("Advertisement deleted successfully");
        fetchAdvertisements();
      } catch (err) {
        toast.error("Failed to delete advertisement");
        console.error(err);
      } finally {
        setIsDeleting(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Advertisement Management</h2>
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Add New Advertisement</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Advertisement Link *</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Advertisement Image *</label>
            <div className="mt-1 flex items-center">
              <input
                id="adImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`${imagePreview ? 'hidden' : 'block'} w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
              />
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-32 w-48 object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              {!imagePreview && <p className="text-xs text-gray-500 mt-1">Upload image (JPG, PNG)</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Position *</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Position</option>
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="footer">Footer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Location</option>
              <option value="home">Home</option>
              <option value="blog">Blog</option>
              <option value="property">Property</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">Cities *</label>
                <div className="mt-2 space-y-1">
                  {cities.map(city => (
                    <label key={city.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={city.id}
                        checked={formData.cityIds?.includes(String(city.id)) || false}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => {
                            const selected = new Set(prev.cityIds.map(String));
                            if (e.target.checked) {
                              selected.add(value);
                            } else {
                              selected.delete(value);
                            }
                            return { ...prev, cityIds: Array.from(selected) };
                          });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{city.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-white font-medium flex items-center ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Advertisement Table */}
      <div className="mt-12 bg-white shadow-lg rounded-lg overflow-x-auto border border-gray-100">
        <h3 className="text-xl font-semibold p-4 border-b text-gray-700">Existing Advertisements</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">No advertisements available.</td>
              </tr>
            ) : (
              advertisements.map((ad, index) => (
                <tr key={ad.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img src={ad.image_url} alt="ad" className="h-12 w-24 object-cover rounded-md border" />
                  </td>
                  <td className="p-3">
                    <a href={ad.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                      {ad.link.length > 30 ? ad.link.substring(0, 30) + '...' : ad.link}
                    </a>
                  </td>
                  <td className="p-3 capitalize">{ad.image_position}</td>
                  <td className="p-3 capitalize">{ad.location}</td>
                  <td className="p-3">{ad.start_date?.slice(0, 10)}</td>
                  <td className="p-3">{ad.end_date?.slice(0, 10)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(ad.id)}
                      disabled={isDeleting[ad.id]}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${isDeleting[ad.id] ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                    >
                      {isDeleting[ad.id] ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertisementForm;