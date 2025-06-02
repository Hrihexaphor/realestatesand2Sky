import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const AdvertisementForm = () => {
  const [formData, setFormData] = useState({
    link: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    cityIds: [],
    image_size: "",
  });

  const [cities, setCities] = useState([]);
  const [advertisementImage, setAdvertisementImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editAdId, setEditAdId] = useState(null);
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

  const resetForm = () => {
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
    setIsEditing(false);
    setEditAdId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advertisementImage && !isEditing) return toast.error("Image is required");

    setIsLoading(true);
    
    try {
      if (isEditing) {
        // For editing, send JSON data instead of FormData
        const updateData = {
          link: formData.link,
          image_position: formData.position, // Note: backend expects 'image_position'
          location: formData.location,
          start_date: formData.start_date,
          end_date: formData.end_date,
          cityIds: formData.cityIds,
          image_size: formData.image_size,
        };

        // If new image is uploaded, handle it separately
        if (advertisementImage) {
          const imageFormData = new FormData();
          imageFormData.append("advertisementImage", advertisementImage);
          
          // Upload new image first (you might need a separate endpoint for this)
          // For now, we'll include it in the update
          const formDataForUpdate = new FormData();
          Object.entries(updateData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => formDataForUpdate.append(`${key}[]`, v));
            } else {
              formDataForUpdate.append(key, value);
            }
          });
          formDataForUpdate.append("advertisementImage", advertisementImage);

          await axios.put(`http://localhost:3001/api/advertisement/${editAdId}`, formDataForUpdate, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
          });
        } else {
          // No new image, send JSON data
          await axios.put(`http://localhost:3001/api/advertisement/api/advertisement/${editAdId}`, updateData, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          });
        }
        
        toast.success("Advertisement updated successfully");
      } else {
        // Creating new advertisement
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'position') {
            // Map 'position' to 'image_position' for backend
            if (Array.isArray(value)) {
              value.forEach((v) => data.append(`image_position[]`, v));
            } else {
              data.append('image_position', value);
            }
          } else if (Array.isArray(value)) {
            value.forEach((v) => data.append(`${key}[]`, v));
          } else {
            data.append(key, value);
          }
        });

        if (advertisementImage) {
          data.append("advertisementImage", advertisementImage);
        }

        await axios.post(`${BASE_URL}/api/advertisement`, data, {
          withCredentials: true,
        });
        toast.success("Advertisement added successfully");
      }

      resetForm();
      fetchAdvertisements();
    } catch (err) {
      toast.error(isEditing ? "Failed to update advertisement" : "Failed to create advertisement");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      setIsDeleting((prev) => ({ ...prev, [id]: true }));
      try {
        await axios.delete(`${BASE_URL}/api/advertisement/${id}`, {
          withCredentials: true
        });
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

  const handleEdit = (ad) => {
    setIsEditing(true);
    setEditAdId(ad.id);
    setFormData({
      link: ad.link || "",
      position: ad.position || ad.image_position || "", // Handle both field names
      location: ad.location || "",
      start_date: ad.start_date?.slice(0, 10) || "",
      end_date: ad.end_date?.slice(0, 10) || "",
      cityIds: ad.city_ids || ad.cityIds || [],
      image_size: ad.image_size || "",
    });
    setImagePreview(ad.image_url);
    setAdvertisementImage(null); // Reset file input
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      <span>Processing...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advertisement Management
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your advertisement campaigns
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {isEditing ? "Edit Advertisement" : "Create New Advertisement"}
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Link */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Advertisement Link *
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Advertisement Image {!isEditing && "*"}
                  </label>
                  {!imagePreview ? (
                    <div className="relative">
                      <input
                        id="adImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="adImageInput"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <svg
                          className="w-10 h-10 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-500">
                          Click to upload image
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    Position *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select Position</option>
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select Location</option>
                    <option value="home">Home</option>
                    <option value="blog">Blog</option>
                    <option value="property">Property</option>
                  </select>
                </div>

                {/* Image Size */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    Image Size *
                  </label>
                  <select
                    name="image_size"
                    value={formData.image_size}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select Size</option>
                    <option value="100x100">100x100</option>
                    <option value="100x50">100x50</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Cities Selection */}
              <div className="space-y-4">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Select Cities *
                </label>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cities.map((city) => (
                      <label
                        key={city.id}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={city.id}
                          checked={formData.cityIds.includes(String(city.id))}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                              const selected = new Set(
                                prev.cityIds.map(String)
                              );
                              e.target.checked
                                ? selected.add(val)
                                : selected.delete(val);
                              return { ...prev, cityIds: Array.from(selected) };
                            });
                          }}
                          className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {city.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-8 py-4 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed scale-100"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
                        />
                      </svg>
                      {isEditing ? "Update Advertisement" : "Create Advertisement"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Advertisement List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Existing Advertisements
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Start
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    End
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advertisements.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          No advertisements found
                        </p>
                        <p className="text-sm">
                          Create your first advertisement using the form above
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  advertisements.map((ad, index) => (
                    <tr
                      key={ad.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={ad.image_url}
                          alt="advertisement"
                          className="h-12 w-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium text-sm max-w-xs truncate block"
                        >
                          {ad.link}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                          {ad.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                          {ad.location}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {ad.image_size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ad.start_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ad.end_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleEdit(ad)} // Pass entire ad object, not just ad.id
                            disabled={isDeleting[ad.id]}
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isDeleting[ad.id]
                                ? "bg-blue-300 text-blue-700 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                            }`}
                          >
                          {isDeleting[ad.id] ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Editing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                                />
                              </svg>
                              Edit
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(ad.id)}
                          disabled={isDeleting[ad.id]}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isDeleting[ad.id]
                              ? "bg-red-300 text-red-700 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                          }`}
                        >
                          {isDeleting[ad.id] ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                              Deleting...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </div>
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
      </div>
    </div>
  );
};

export default AdvertisementForm;
