import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeaturedManager = () => {
  const [properties, setProperties] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [galleryIds, setGalleryIds] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState({});
  const [galleryProperties, setGalleryProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 30 days from now
  });
  const [galleryDateRange, setGalleryDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 30 days from now
  });
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [showDatePickerFor, setShowDatePickerFor] = useState(null);
  const [showGalleryPickerFor, setShowGalleryPickerFor] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: false });
  const [galleryModalPosition, setGalleryModalPosition] = useState({ top: false });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const modalRef = useRef(null);
  const galleryModalRef = useRef(null);
  const buttonRefs = useRef({});
  const galleryButtonRefs = useRef({});
  
  useEffect(() => {
    fetchProperties();
    fetchFeaturedData();
    fetchGalleryData();
    fetchCities();
  }, []);
  
  // Effect to calculate modal position whenever showDatePickerFor changes
  useEffect(() => {
    if (showDatePickerFor && buttonRefs.current[showDatePickerFor]) {
      calculateModalPosition(showDatePickerFor, buttonRefs.current[showDatePickerFor], setModalPosition);
    }
  }, [showDatePickerFor]);
  
  // Effect to calculate gallery modal position
  useEffect(() => {
    if (showGalleryPickerFor && galleryButtonRefs.current[showGalleryPickerFor]) {
      calculateModalPosition(showGalleryPickerFor, galleryButtonRefs.current[showGalleryPickerFor], setGalleryModalPosition);
    }
  }, [showGalleryPickerFor]);
  
  const calculateModalPosition = (propertyId, buttonElement, setPositionFunc) => {
    if (!buttonElement) return;
    
    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const modalHeight = 380; // Approximate modal height
    
    // If there's not enough space below, position it above
    setPositionFunc({
      top: spaceBelow < modalHeight,
    });
  };
  
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
  
  const fetchFeaturedData = async () => {
    try {
      // Get IDs of featured properties
      const idsRes = await axios.get(`${BASE_URL}/api/featuredids`);
      setFeaturedIds(idsRes.data);
      
      // Get detailed information about featured properties
      const featuredRes = await axios.get(`${BASE_URL}/api/featured`);
      
      // Create a map of property_id -> featured data
      const featuredMap = {};
      featuredRes.data.forEach(item => {
        featuredMap[item.property_id] = {
          featured_from: item.featured_from,
          featured_to: item.featured_to
        };
      });
      
      setFeaturedProperties(featuredMap);
    } catch (err) {
      toast.error('Error fetching featured data');
    }
  };

  const fetchGalleryData = async () => {
    try {
      // Get active gallery properties
      const galleryRes = await axios.get(`${BASE_URL}/api/activegallary`);
      
      // Create a map of property_id -> gallery data and a set of gallery IDs
      const galleryMap = {};
      const galleryIdSet = [];
      
      galleryRes.data.forEach(item => {
        galleryMap[item.property_id] = {
          gallery_from: item.gallery_from,
          gallery_to: item.gallery_to
        };
        galleryIdSet.push(item.property_id);
      });
      
      setGalleryProperties(galleryMap);
      setGalleryIds(galleryIdSet);
    } catch (err) {
      toast.error('Error fetching gallery data');
    }
  };
  
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cities`);
      setCities(res.data || [
        { id: 1, name: 'Mumbai' },
        { id: 2, name: 'Delhi' },
        { id: 3, name: 'Bangalore' },
        { id: 4, name: 'Chennai' },
        { id: 5, name: 'Kolkata' }
      ]); // Fallback cities in case API doesn't exist yet
    } catch (err) {
      // Set default cities if API doesn't exist yet
      setCities([
        { id: 1, name: 'Mumbai' },
        { id: 2, name: 'Delhi' },
        { id: 3, name: 'Bangalore' },
        { id: 4, name: 'Chennai' },
        { id: 5, name: 'Kolkata' }
      ]);
    }
  };
  
  const handleAdd = async (id) => {
    // Check if cities are selected
    if (selectedCities.length === 0) {
      toast.error('Please select at least one city');
      return;
    }
    
    try {
      await axios.post(`${BASE_URL}/api/addtofeatured`, { 
        property_id: id,
        start_date: selectedDateRange.startDate,
        end_date: selectedDateRange.endDate,
        cities: selectedCities
      });
      toast.success('Added to featured');
      setShowDatePickerFor(null);
      setSelectedCities([]);
      fetchFeaturedData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };
  
  const handleRemove = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/featured/${id}`);
      toast.success('Removed from featured');
      fetchFeaturedData();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const handleAddToGallery = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/addgallary`, { 
        property_id: id,
        gallery_from: galleryDateRange.startDate,
        gallery_to: galleryDateRange.endDate
      });
      toast.success('Added to gallery');
      setShowGalleryPickerFor(null);
      fetchGalleryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to gallery');
    }
  };
  
  const handleRemoveFromGallery = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/removegallary/${id}`);
      toast.success('Removed from gallery');
      fetchGalleryData();
    } catch (err) {
      toast.error('Failed to remove from gallery');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleCitySelect = (cityId) => {
    setSelectedCities(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Featured Properties</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Featured Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gallery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gallery Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className={`${featuredIds.includes(property.id) ? 'bg-green-50' : galleryIds.includes(property.id) ? 'bg-blue-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {featuredIds.includes(property.id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                        onClick={() => handleRemove(property.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          ref={el => buttonRefs.current[property.id] = el}
                          className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                          onClick={() => setShowDatePickerFor(property.id)}
                        >
                          Add to Featured
                        </button>
                        
                        {showDatePickerFor === property.id && (
                          <div
                            ref={modalRef}
                            className={`fixed z-10 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 ${
                              modalPosition.top ? 'bottom-12' : 'mt-2'
                            }`}
                            style={{
                              left: buttonRefs.current[property.id]?.getBoundingClientRect().left,
                              [modalPosition.top ? 'bottom' : 'top']: modalPosition.top
                                ? `calc(100vh - ${buttonRefs.current[property.id]?.getBoundingClientRect().top}px)`
                                : `${buttonRefs.current[property.id]?.getBoundingClientRect().bottom}px`
                            }}
                          >
                            <h3 className="font-medium mb-3 text-gray-800">Featured Settings</h3>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedDateRange.startDate}
                                onChange={(e) => setSelectedDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedDateRange.endDate}
                                onChange={(e) => setSelectedDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                min={selectedDateRange.startDate}
                              />
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Select Cities</label>
                              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                                {cities.map(city => (
                                  <div key={city.id} className="flex items-center mb-1">
                                    <input
                                      type="checkbox"
                                      id={`city-${city.id}`}
                                      checked={selectedCities.includes(city.id)}
                                      onChange={() => handleCitySelect(city.id)}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`city-${city.id}`} className="text-sm text-gray-700">{city.name}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm"
                                onClick={() => {
                                  setShowDatePickerFor(null);
                                  setSelectedCities([]);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
                                onClick={() => handleAdd(property.id)}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {featuredIds.includes(property.id) && featuredProperties[property.id] && (
                      <span className="text-sm text-green-600">
                        {formatDate(featuredProperties[property.id].featured_from)} <br/> - {formatDate(featuredProperties[property.id].featured_to)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {galleryIds.includes(property.id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                        onClick={() => handleRemoveFromGallery(property.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          ref={el => galleryButtonRefs.current[property.id] = el}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                          onClick={() => setShowGalleryPickerFor(property.id)}
                        >
                          Add to Gallery
                        </button>
                        
                        {showGalleryPickerFor === property.id && (
                          <div
                            ref={galleryModalRef}
                            className={`fixed z-10 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 ${
                              galleryModalPosition.top ? 'bottom-12' : 'mt-2'
                            }`}
                            style={{
                              left: galleryButtonRefs.current[property.id]?.getBoundingClientRect().left,
                              [galleryModalPosition.top ? 'bottom' : 'top']: galleryModalPosition.top
                                ? `calc(100vh - ${galleryButtonRefs.current[property.id]?.getBoundingClientRect().top}px)`
                                : `${galleryButtonRefs.current[property.id]?.getBoundingClientRect().bottom}px`
                            }}
                          >
                            <h3 className="font-medium mb-3 text-gray-800">Gallery Settings</h3>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={galleryDateRange.startDate}
                                onChange={(e) => setGalleryDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={galleryDateRange.endDate}
                                onChange={(e) => setGalleryDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                min={galleryDateRange.startDate}
                              />
                            </div>
                            
                            <div className="flex justify-between">
                              <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm"
                                onClick={() => setShowGalleryPickerFor(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
                                onClick={() => handleAddToGallery(property.id)}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {galleryIds.includes(property.id) && galleryProperties[property.id] && (
                      <span className="text-sm text-blue-600">
                        {formatDate(galleryProperties[property.id].gallery_from)} <br/> - {formatDate(galleryProperties[property.id].gallery_to)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 mr-4 overflow-hidden rounded">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0].image_url || '/placeholder-house.jpg'} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-300">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{property.property_category_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.address || property.locality}</div>
                    <div className="text-xs text-gray-500">{property.city}</div>
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <span>{property.bedrooms || '-'} Beds</span>
                      <span>•</span>
                      <span>{property.bathrooms || '-'} Baths</span>
                      <span>•</span>
                      <span>{property.carpet_area || property.built_up_area || '-'} Sq.ft</span>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(property.expected_price)}</div>
                    {property.price_per_sqft && (
                      <div className="text-xs text-gray-500">{formatPrice(property.price_per_sqft)}/sq.ft</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {property.transaction_type}
                    </span>
                    <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      {property.possession_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {properties.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No properties found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedManager;