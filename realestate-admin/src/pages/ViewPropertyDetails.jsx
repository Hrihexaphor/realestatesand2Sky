import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaRuler, FaHome, FaBed, FaBath, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { CloudCog } from 'lucide-react';

export default function ViewPropertyDetails() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/property/${id}`);
        console.log(res.data);
        setProperty(res.data);
        // Set active image to primary image if exists
        if (res.data.images && res.data.images.length > 0) {
          const primaryIndex = res.data.images.findIndex(img => img.is_primary);
          setActiveImage(primaryIndex >= 0 ? primaryIndex : 0);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-md shadow-sm transition-all hover:shadow"
          >
            <FaArrowLeft className="text-sm" /> Back to Properties
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section with Main Image */}
          {property.images && property.images.length > 0 && (
            <div className="relative h-96 overflow-hidden bg-gray-100">
              <img 
                src={property.images[activeImage].image_url} 
                alt="Property" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl font-bold text-white">{property.basic.title}</h1>
                <div className="flex items-center gap-2 text-white/90 mt-2">
                  <FaMapMarkerAlt />
                  <span>{property.location.address}, {property.details.locality}, {property.details.city}</span>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-6 md:p-8">
            {/* Price and Key Details Bar */}
            <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Price</span>
                <span className="text-2xl font-bold text-blue-600">₹{property.basic.expected_price}</span>
                <span className="text-sm text-gray-500">₹{property.basic.price_per_sqft}/sqft</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Type</span>
                <div className="flex items-center gap-1">
                  <FaHome className="text-blue-500" />
                  <span className="font-medium">{property.basic.property_category_name}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Area</span>
                <div className="flex items-center gap-1">
                  <FaRuler className="text-blue-500" />
                  <span className="font-medium">{property.details.carpet_area
                  } sq.ft.</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Bedrooms</span>
                <div className="flex items-center gap-1">
                  <FaBed className="text-blue-500" />
                  <span className="font-medium">{property.details.bedrooms}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Bathrooms</span>
                <div className="flex items-center gap-1">
                  <FaBath className="text-blue-500" />
                  <span className="font-medium">{property.details.bathrooms}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  property.basic.possession_status === 'Ready to Move' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.basic.possession_status}
                </span>
              </div>
            </div>
            
            {/* Image Thumbnails Gallery */}
            {property.images && property.images.length > 1 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Photos
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {property.images.map((img, index) => (
                    <div 
                      key={img.id} 
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                        index === activeImage ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img.image_url} 
                        alt={`Property view ${index + 1}`}
                        className="h-16 w-full object-cover"
                      />
                      {img.is_primary && (
                        <span className="absolute bottom-0 right-0 bg-blue-500 text-white px-1 text-xs">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Main Content in Tabs/Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Property and Area Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Details */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaHome className="text-blue-500" />
                      Property Details
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Transaction Type</span>
                          <span className="font-medium">{property.basic.transaction_type}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Bedrooms</span>
                          <span className="font-medium">{property.details.bedrooms}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Bathrooms</span>
                          <span className="font-medium">{property.details.bathrooms}</span>
                        </div>
                        {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Balconies</span>
                          <span className="font-medium">{property.details.balconies || 'N/A'}</span>
                        </div> */}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Furnished Status</span>
                          <span className="font-medium">{property.details.furnished_status}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Total Floors</span>
                          <span className="font-medium">{property.details.total_floors}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Facing</span>
                          <span className="font-medium">{property.details.facing || 'N/A'}</span>
                        </div>
                        {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Covered Parking</span>
                          <span className="font-medium">{property.details.covered_parking || 'N/A'}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area Details */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaRuler className="text-blue-500" />
                      Area Details
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Built-up Area</span>
                          <span className="font-medium">{property.details.built_up_area} sq.ft.</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Carpet Area</span>
                          <span className="font-medium">{property.details.carpet_area ? `${property.details.carpet_area} sq.ft.` : 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Plot Area</span>
                          <span className="font-medium">{property.details.plot_area ? `${property.details.plot_area} sq.ft.` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Plot Dimensions</span>
                          <span className="font-medium">
                            {property.details.plot_length && property.details.plot_breadth 
                              ? `${property.details.plot_length} x ${property.details.plot_breadth}`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      Location Details
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between border-b border-gray-100 pb-2 mb-4">
                        <span className="text-gray-600">Address</span>
                        <span className="font-medium text-right">{property.location.address}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-600">City</span>
                            <span className="font-medium">{property.details.city}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-600">Locality</span>
                            <span className="font-medium">{property.details.locality}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {property.details.about_location && (
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">About Location</h3>
                        <p className="text-gray-600">{property.details.about_location}</p>
                      </div>
                    )}
                    
                    {property.location.latitude && property.location.longitude && (
                      <div className="mt-6 p-4 h-64 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Map Location (Lat: {property.location.latitude}, Long: {property.location.longitude})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                {property.documents && property.documents.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Documents
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      <ul className="divide-y divide-gray-100">
                        {property.documents.map((doc) => (
                          <li key={doc.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-blue-50 text-blue-600 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <div>
                                <div className="font-medium">
                                  {(doc.type ? doc.type.charAt(0).toUpperCase() + doc.type.slice(1) : 'Unknown Document')}
                                </div>
                                {doc.uploaded_at && (
                                  <div className="text-xs text-gray-500">
                                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              View
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Project Details and Amenities */}
              <div className="space-y-8">
                {/* Project Details */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaBuilding className="text-blue-500" />
                      Project Details
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Project Name</span>
                        <span className="font-medium">{property.details.project_name || 'N/A'}</span>
                      </div> */}
                      {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Project Area</span>
                        <span className="font-medium">{property.details.project_area || 'N/A'}</span>
                      </div> */}
                      {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Number of Units</span>
                        <span className="font-medium">{property.details.num_of_units || 'N/A'}</span>
                      </div> */}
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">RERA ID</span>
                        <span className="font-medium">{property.details.project_rera_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Developer</span>
                        <span className="font-medium">{property.basic.developer_name || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {property.details.description && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm">{property.details.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Amenities
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {property.amenities.map((amenity) => (
                          <div key={amenity.id} className="flex items-center gap-2 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
         
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}