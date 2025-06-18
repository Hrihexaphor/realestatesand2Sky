import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Eye } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HeroSectionManager = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Toast functionality
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch existing images on load
  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/hero`);
      console.log("Hero images fetched:", response.data);
      setHeroImages(response.data);
    } catch (err) {
      console.error("Failed to fetch hero images:", err);
      showToast("Failed to fetch images", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById("imageInput").value = "";
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/hero`, formData);
      setHeroImages([response.data, ...heroImages]);
      setImage(null);
      setImagePreview(null);
      document.getElementById("imageInput").value = "";
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/hero/${id}`);
      setHeroImages(heroImages.filter((img) => img.id !== id));
      showToast("Image deleted successfully!", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete image", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hero Section Manager
          </h1>
          <p className="text-gray-600">
            Upload and manage your hero section images
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Upload New Image
          </h2>

          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Image
                <span className="text-xs text-gray-500 ml-2">
                  (Recommended: 1000x1000px)
                </span>
              </label>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={removeImagePreview}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Preview
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !image}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="mr-2" size={20} />
            Existing Images ({heroImages.length})
          </h2>

          {heroImages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                No hero images uploaded yet
              </p>
              <p className="text-gray-400 text-sm">
                Upload your first image to get started
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Preview
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Image URL
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroImages.map((img, index) => (
                      <tr
                        key={img.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === heroImages.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="py-4 px-4">
                          <img
                            src={img.image_url}
                            alt="Hero"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={img.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline transition-colors"
                          >
                            {img.image_url}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDelete(img.id)}
                            className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionManager;
