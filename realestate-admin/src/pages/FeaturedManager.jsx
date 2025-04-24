import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeaturedManager = () => {
  const [properties, setProperties] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    fetchProperties();
    fetchFeaturedIds();
  }, []);
  
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/property`);
      setProperties(res.data);
    } catch (err) {
      toast.error('Error fetching properties');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFeaturedIds = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/featuredids`);
      setFeaturedIds(res.data);
    } catch (err) {
      toast.error('Error fetching featured IDs');
    }
  };
  
  const handleAdd = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/addtofeatured`, { property_id: id });
      toast.success('Added to featured');
      fetchFeaturedIds();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };
  
  const handleRemove = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/featured/${id}`);
      toast.success('Removed from featured');
      fetchFeaturedIds();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Featured Properties</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
                featuredIds.includes(property.id) ? 'border-2 border-green-500' : 'border border-gray-200'
              }`}
            >
              {/* Property Image */}
              <div className="h-48 overflow-hidden bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0].image_url|| '/placeholder-house.jpg'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-300">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{property.title}</h3>
                
                {/* Location */}
                <div className="flex items-center mb-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{property.address || property.locality + ', ' + property.city}</span>
                </div>
                
                {/* Property Details */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="flex flex-col items-center p-1 bg-gray-100 rounded">
                    <span className="font-medium">{property.bedrooms || 'N/A'}</span>
                    <span className="text-xs text-gray-500">Beds</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-gray-100 rounded">
                    <span className="font-medium">{property.bathrooms || 'N/A'}</span>
                    <span className="text-xs text-gray-500">Baths</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-gray-100 rounded">
                    <span className="font-medium">{property.carpet_area || property.built_up_area || 'N/A'}</span>
                    <span className="text-xs text-gray-500">Sq.ft</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-3">
                  <span className="text-lg font-bold text-gray-800">
                    {formatPrice(property.expected_price)}
                  </span>
                  {property.price_per_sqft && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({formatPrice(property.price_per_sqft)}/sq.ft)
                    </span>
                  )}
                </div>
                
                {/* Category & Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {property.property_category_name}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {property.transaction_type}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {property.possession_status}
                  </span>
                </div>
                
                {/* Featured Button */}
                {featuredIds.includes(property.id) ? (
                  <button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                    onClick={() => handleRemove(property.id)}
                  >
                    Remove from Featured
                  </button>
                ) : (
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                    onClick={() => handleAdd(property.id)}
                  >
                    Add to Featured
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && properties.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No properties found.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedManager;