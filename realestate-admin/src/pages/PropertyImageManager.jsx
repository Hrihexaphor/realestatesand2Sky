// components/PropertyImageManager.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyImageManager = () => {
  const [data, setData] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    axios.get(`${BASE_URL}/api/with-images`)
      .then(res => setData(res.data))
      .catch(err => toast.error("Failed to load images"));
  }, []);

  const handleSetPrimary = async (propertyId, imageId) => {
    try {
      await axios.post(`${BASE_URL}/api/set-primary`, { propertyId, imageId });
      toast.success("Primary image updated");
      setData(prev =>
        prev.map(item =>
          item.property_id === propertyId
            ? { ...item, is_primary: item.image_id === imageId }
            : item
        )
      );
      // Reload all images for accuracy
      const updated = await axios.get(`${BASE_URL}/api/with-images`);
      setData(updated.data);
    } catch (err) {
      toast.error("Failed to set primary image");
    }
  };

  // Group by property
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.property_id]) acc[item.property_id] = { title: item.title, images: [] };
    acc[item.property_id].images.push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Image Manager</h1>
          <p className="text-gray-600">Manage and set primary images for your properties</p>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([propertyId, { title, images }]) => (
            <div key={propertyId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Property Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">
                      {images.length} {images.length === 1 ? 'Image' : 'Images'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              <div className="p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {images.map(image => (
                    <div key={image.image_id} className="group relative">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 group-hover:shadow-md">
                        <img 
                          src={image.image_url} 
                          alt="property" 
                          className="w-full h-20 object-cover transition-transform duration-200 group-hover:scale-105" 
                        />
                        
                        {/* Primary Badge */}
                        {image.is_primary && (
                          <div className="absolute top-1 right-1">
                            <div className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                              ★
                            </div>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-2">
                        {image.is_primary ? (
                          <div className="flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-200">
                              Primary
                            </span>
                          </div>
                        ) : (
                          <button
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium px-2 py-1.5 rounded-md transition-all duration-200 hover:shadow-md active:scale-95"
                            onClick={() => handleSetPrimary(image.property_id, image.image_id)}
                          >
                            Set Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {images.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No images available for this property</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for No Properties */}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
            <p className="text-gray-500">Add some properties with images to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImageManager;