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
    image_size: "", // ✅ new field added
  });

  const [cities, setCities] = useState([]);
  const [advertisementImage, setAdvertisementImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${BASE_URL}/api/cities`).then((res) => setCities(res.data));
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/advertisement`);
      setAdvertisements(res.data);
    } catch (err) {
      console.error("Failed to fetch advertisements", err);
      toast.error("Failed to load advertisements");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const fileInput = document.getElementById("adImageInput");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advertisementImage) return toast.error("Image is required");

    setIsLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => data.append(`${key}[]`, v));
      } else {
        data.append(key, value);
      }
    });
    data.append("advertisementImage", advertisementImage);

    try {
      await axios.post(`${BASE_URL}/api/advertisement`, data);
      toast.success("Advertisement added successfully");
      setFormData({
        link: "",
        position: "",
        location: "",
        start_date: "",
        end_date: "",
        cityIds: [],
        image_size: "",
      });
      removeImage();
      fetchAdvertisements();
    } catch (err) {
      toast.error("Failed to add advertisement");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      setIsDeleting((prev) => ({ ...prev, [id]: true }));
      try {
        await axios.delete(`${BASE_URL}/api/advertisement/${id}`);
        toast.success("Advertisement deleted successfully");
        fetchAdvertisements();
      } catch (err) {
        toast.error("Failed to delete advertisement");
        console.error(err);
      } finally {
        setIsDeleting((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Advertisement Management</h2>

      <div className="bg-white p-6 shadow rounded-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Link */}
          <div>
            <label className="text-sm font-medium text-gray-700">Advertisement Link *</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
              placeholder="https://example.com"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium text-gray-700">Advertisement Image *</label>
            <input
              id="adImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`${imagePreview ? "hidden" : "block"} w-full mt-1`}
            />
            {imagePreview && (
              <div className="relative mt-2">
                <img src={imagePreview} alt="Preview" className="h-32 w-48 object-cover rounded border" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="text-sm font-medium text-gray-700">Position *</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Position</option>
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="footer">Footer</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Location</option>
              <option value="home">Home</option>
              <option value="blog">Blog</option>
              <option value="property">Property</option>
            </select>
          </div>

          {/* Image Size */}
          <div>
            <label className="text-sm font-medium text-gray-700">Image Size *</label>
            <select
              name="image_size"
              value={formData.image_size}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Size</option>
              <option value="300x250">100x100</option>
              <option value="728x90">100x50</option>
          
            </select>
          </div>

          {/* Start/End Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {/* Cities */}
          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700">Select Cities *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {cities.map((city) => (
                <label key={city.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={city.id}
                    checked={formData.cityIds.includes(String(city.id))}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => {
                        const selected = new Set(prev.cityIds.map(String));
                        e.target.checked ? selected.add(val) : selected.delete(val);
                        return { ...prev, cityIds: Array.from(selected) };
                      });
                    }}
                    className="form-checkbox"
                  />
                  <span>{city.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded text-white font-medium ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Advertisement List */}
      <div className="mt-10 bg-white shadow rounded overflow-x-auto border">
        <h3 className="text-xl font-semibold p-4 border-b">Existing Advertisements</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Size</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisements.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">No advertisements found.</td>
              </tr>
            ) : (
              advertisements.map((ad, index) => (
                <tr key={ad.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img src={ad.image_url} alt="ad" className="h-12 w-24 object-cover rounded border" />
                  </td>
                  <td className="p-3"><a href={ad.link} className="text-blue-600 underline">{ad.link}</a></td>
                  <td className="p-3 capitalize">{ad.position}</td>
                  <td className="p-3 capitalize">{ad.location}</td>
                  <td className="p-3">{ad.image_size}</td>
                  <td className="p-3">{ad.start_date}</td>
                  <td className="p-3">{ad.end_date}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(ad.id)}
                      disabled={isDeleting[ad.id]}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      {isDeleting[ad.id] ? "Deleting..." : "Delete"}
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
