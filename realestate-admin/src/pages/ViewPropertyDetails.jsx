import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { CloudCog } from 'lucide-react';

export default function ViewPropertyDetails() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/property/${id}`);
        console.log(res.data)
        setProperty(res.data);
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
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return <div className="p-8 text-center">Property not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft /> Back to Properties
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 border-b pb-4">{property.basic.title}</h1>
        
        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {property.images.map((img) => (
                <div key={img.id} className="relative">
                  <img 
                    src={img.image_url} 
                    alt="Property" 
                    className="h-64 w-full object-cover rounded"
                  />
                  {img.is_primary && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Type:</span>
                <span>{property.basic.property_type}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Transaction Type:</span>
                <span>{property.basic.transaction_type}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Price:</span>
                <span>₹{property.basic.expected_price}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Price per sqft:</span>
                <span>₹{property.basic.price_per_sqft}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Possession Status:</span>
                <span>{property.basic.possession_status}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Bedrooms:</span>
                <span>{property.details.bedrooms}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Bathrooms:</span>
                <span>{property.details.bathrooms}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Balconies:</span>
                <span>{property.details.balconies || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Furnished Status:</span>
                <span>{property.details.furnished_status}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total Floors:</span>
                <span>{property.details.total_floors}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Area Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Area Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Built-up Area:</span>
                <span>{property.details.built_up_area} sq.ft.</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Carpet Area:</span>
                <span>{property.details.carpet_area ? `${property.details.carpet_area} sq.ft.` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Plot Area:</span>
                <span>{property.details.plot_area ? `${property.details.plot_area} sq.ft.` : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Plot Length:</span>
                <span>{property.details.plot_length || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Plot Breadth:</span>
                <span>{property.details.plot_breadth || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Facing:</span>
                <span>{property.details.facing || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Covered Parking:</span>
                <span>{property.details.covered_parking || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Address:</span>
                <span className="text-right">{property.location.address}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">City:</span>
                <span>{property.details.city}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Locality:</span>
                <span>{property.details.locality}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">About Location:</span>
                <span>{property.details.about_location || 'N/A'}</span>
              </div>
            </div>
            {property.location.latitude && property.location.longitude && (
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Map View (Lat: {property.location.latitude}, Long: {property.location.longitude})</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Project Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Project Name:</span>
                <span>{property.details.project_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Project Area:</span>
                <span>{property.details.project_area || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Number of Units:</span>
                <span>{property.details.num_of_units || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">RERA ID:</span>
                <span>{property.details.project_rera_id || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Developer ID:</span>
                <span>{property.basic.developer_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
  <span className="font-medium">Developer Name:</span>
  <span>{property.basic.developer_name || 'N/A'}</span>
</div>  
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Description:</span>
                <span>{property.details.description || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {property.amenities.map((amenity) => (
                <div key={amenity.id} className="border p-3 rounded-lg flex items-center gap-2">
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {property.documents && property.documents.length > 0 && (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Documents</h2>
    <ul className="space-y-2 list-disc list-inside">
    {property.documents && property.documents.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Documents</h2>
    <ul className="list-disc list-inside space-y-2">
      {property.documents.map((doc) => (
        <li key={doc.id}>
          <a 
            href={doc.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            {(doc.type ? doc.type.charAt(0).toUpperCase() + doc.type.slice(1) : 'Unknown Document')} 
            {doc.uploaded_at && ` (Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()})`}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
    </ul>
  </div>
)}
      </div>
    </div>
  );
}