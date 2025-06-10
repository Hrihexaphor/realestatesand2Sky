import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeaturedManager = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [galleryIds, setGalleryIds] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState({});
  const [galleryProperties, setGalleryProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [galleryDateRange, setGalleryDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [showDatePickerFor, setShowDatePickerFor] = useState(null);
  const [showGalleryPickerFor, setShowGalleryPickerFor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProperties(),
        fetchFeaturedData(),
        fetchGalleryData(),
        fetchCities()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter(property => 
      property.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.locality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toString().includes(searchTerm)
    );
    
    setFilteredProperties(filtered);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/property`);
      setProperties(res.data);
    } catch (err) {
      toast.error('Error fetching properties');
    }
  };
  
  const fetchFeaturedData = async () => {
    try {
      const [idsRes, featuredRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/featuredids`),
        axios.get(`${BASE_URL}/api/featured`)
      ]);
      
      setFeaturedIds(idsRes.data);
      
      const featuredMap = {};
      featuredRes.data.forEach(item => {
        // console.log("hritesh");
        featuredMap[item.feature_id] = {
          featured_id: item.id,
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
      const galleryRes = await axios.get(`${BASE_URL}/api/activegallary`);
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
    const defaultCities = [
      { id: 1, name: 'Mumbai' },
      { id: 2, name: 'Delhi' },
      { id: 3, name: 'Bangalore' },
      { id: 4, name: 'Chennai' },
      { id: 5, name: 'Kolkata' }
    ];
    
    try {
      const res = await axios.get(`${BASE_URL}/api/cities`);
      setCities(res.data || defaultCities);
    } catch (err) {
      setCities(defaultCities);
    }
  };

  const fetchFeaturedDetails = async (featuredId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getfeatured/${featuredId}`);
      return res.data;
    } catch (err) {
      toast.error('Error fetching featured details');
      return null;
    }
  };

  const handleEditFeatured = async (propertyId) => {
    const featuredInfo = featuredProperties[propertyId];
    if (!featuredInfo) {
      toast.error('Featured property details not found');
      return;
    }

    try {
      const featuredDetails = await fetchFeaturedDetails(featuredInfo.featured_id);
      if (featuredDetails) {
        setSelectedDateRange({
          startDate: featuredDetails.start_date.split('T')[0],
          endDate: featuredDetails.end_date.split('T')[0]
        });
        setSelectedCities(featuredDetails.cities || []);
        setEditMode(true);
        setEditingPropertyId(propertyId);
        setShowDatePickerFor(propertyId);
      }
    } catch (error) {
      toast.error('Failed to load featured details for editing');
    }
  };
  
  const handleAddFeatured = async (propertyId) => {
    if (selectedCities.length === 0) {
      toast.error('Please select at least one city');
      return;
    }
    
    try {
      if (editMode && editingPropertyId === propertyId) {
        const featuredInfo = featuredProperties[propertyId];
        await axios.put(`${BASE_URL}/api/updatefeatured/${featuredInfo.featured_id}`, {
          start_date: selectedDateRange.startDate,
          end_date: selectedDateRange.endDate,
          cities: selectedCities
        });
        toast.success('Featured property updated successfully');
      } else if (featuredIds.includes(propertyId)) {
        const featuredInfo = featuredProperties[propertyId];
        await axios.put(`${BASE_URL}/api/updatefeatured/${featuredInfo.featured_id}`, {
          start_date: selectedDateRange.startDate,
          end_date: selectedDateRange.endDate,
          cities: selectedCities
        });
        toast.success('Featured updated');
      } else {
        await axios.post(`${BASE_URL}/api/addtofeatured`, {
          property_id: propertyId,
          start_date: selectedDateRange.startDate,
          end_date: selectedDateRange.endDate,
          cities: selectedCities
        });
        toast.success('Added to featured');
      }
      
      handleModalClose();
      await fetchFeaturedData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    }
  };
  
  const handleRemoveFeatured = async (propertyId) => {
    try {
      await axios.delete(`${BASE_URL}/api/featured/${propertyId}`);
      toast.success('Removed from featured');
      await fetchFeaturedData();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const handleAddGallery = async (propertyId) => {
    try {
      await axios.post(`${BASE_URL}/api/addgallary`, { 
        property_id: propertyId,
        gallery_from: galleryDateRange.startDate,
        gallery_to: galleryDateRange.endDate
      });
      toast.success('Added to gallery');
      setShowGalleryPickerFor(null);
      await fetchGalleryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to gallery');
    }
  };
  
  const handleRemoveGallery = async (propertyId) => {
    try {
      await axios.delete(`${BASE_URL}/api/removegallary/${propertyId}`);
      toast.success('Removed from gallery');
      await fetchGalleryData();
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
    setSelectedCities(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleModalClose = () => {
    setShowDatePickerFor(null);
    setSelectedCities([]);
    setEditMode(false);
    setEditingPropertyId(null);
    setSelectedDateRange({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); 
           i <= Math.min(totalPages - 1, currentPage + delta); 
           i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredProperties.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{filteredProperties.length}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNum === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : pageNum === '...'
                      ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const DatePickerModal = ({ propertyId, onClose, onConfirm, title = "Featured Settings" }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80 max-w-sm mx-4">
        <h3 className="font-medium mb-4 text-gray-800">
          {editMode && editingPropertyId === propertyId ? `Edit ${title}` : title}
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title === "Featured Settings" ? selectedDateRange.startDate : galleryDateRange.startDate}
            onChange={(e) => {
              if (title === "Featured Settings") {
                setSelectedDateRange(prev => ({ ...prev, startDate: e.target.value }));
              } else {
                setGalleryDateRange(prev => ({ ...prev, startDate: e.target.value }));
              }
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title === "Featured Settings" ? selectedDateRange.endDate : galleryDateRange.endDate}
            onChange={(e) => {
              if (title === "Featured Settings") {
                setSelectedDateRange(prev => ({ ...prev, endDate: e.target.value }));
              } else {
                setGalleryDateRange(prev => ({ ...prev, endDate: e.target.value }));
              }
            }}
            min={title === "Featured Settings" ? selectedDateRange.startDate : galleryDateRange.startDate}
          />
        </div>
        
        {title === "Featured Settings" && (
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
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
            onClick={() => onConfirm(propertyId)}
          >
            {editMode && editingPropertyId === propertyId ? 'Update' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Featured Properties</h2>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredProperties.length} result{filteredProperties.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gallery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gallery Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getPaginatedData().map((property) => (
                <tr key={property.id} className={`${featuredIds.includes(property.id) ? 'bg-green-50' : galleryIds.includes(property.id) ? 'bg-blue-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      {featuredIds.includes(property.id) ? (
                        <>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                            onClick={() => handleRemoveFeatured(property.id)}
                          >
                            Remove
                          </button>
                          {/* <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                            onClick={() => handleEditFeatured(property.id)}
                          >
                            Edit
                          </button> */}
                        </>
                      ) : (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                          onClick={() => setShowDatePickerFor(property.id)}
                        >
                          Add to Featured
                        </button>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {galleryIds.includes(property.id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                        onClick={() => handleRemoveGallery(property.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-300"
                        onClick={() => setShowGalleryPickerFor(property.id)}
                      >
                        Add to Gallery
                      </button>
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
                        <div className="text-sm font-medium text-gray-900">{property.project_name}</div>
                        <div className="text-xs text-gray-500">{property.property_category_name}</div>
                        <div className="text-xs text-gray-500">ID: {property.id}</div>
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
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchTerm ? `No properties found matching "${searchTerm}"` : 'No properties found.'}
              </p>
            </div>
          )}
        </div>
        <Pagination />
      </div>

      {/* Featured Date Picker Modal */}
      {showDatePickerFor && (
        <DatePickerModal
          propertyId={showDatePickerFor}
          onClose={handleModalClose}
          onConfirm={handleAddFeatured}
          title="Featured Settings"
        />
      )}

      {/* Gallery Date Picker Modal */}
      {showGalleryPickerFor && (
        <DatePickerModal
          propertyId={showGalleryPickerFor}
          onClose={() => setShowGalleryPickerFor(null)}
          onConfirm={handleAddGallery}
          title="Gallery Settings"
        />
      )}
    </div>
  );
};

export default FeaturedManager;