import React from 'react';
import { FaEdit, FaTrash, FaEye, FaBed, FaBath, FaRulerCombined, FaStar, FaRegStar } from 'react-icons/fa';
import { BiCategoryAlt } from 'react-icons/bi';
import { MdLocationOn } from 'react-icons/md';
import { TbCurrencyRupee } from 'react-icons/tb';

export default function PropertyCard({ 
  property, 
  onEdit, 
  onDelete, 
  onView, 
  onFeature, 
  isFeatured = false,
  className = "" 
}) {
  const primaryImage = property.images?.find((img) => img.is_primary) || property.images?.[0];
  
  // Format price to Indian format
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price).replace('₹', '₹ ');
  };

  return (
    <div className={`relative border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white flex flex-col overflow-hidden ${className}`}>
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          Featured
        </div>
      )}
      
      {/* Property image container */}
      <div className="relative h-52 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image_url || primaryImage.url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        
        {/* Property type badge */}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
          {property.property_category_name}
        </div>
        
        {/* Feature toggle button */}
        {onFeature && (
          <button 
            onClick={() => onFeature(property.id)} 
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-yellow-50 transition-colors"
            title={isFeatured ? "Remove from featured" : "Add to featured"}
          >
            {isFeatured ? 
              <FaStar className="text-yellow-400 text-lg" /> : 
              <FaRegStar className="text-gray-400 hover:text-yellow-400 text-lg" />
            }
          </button>
        )}
      </div>
      
      {/* Property details */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-2">{property.title}</h3>
        
        <div className="flex items-start mb-2 text-gray-600">
          <MdLocationOn className="min-w-4 h-4 mt-1 mr-1" />
          <p className="text-sm line-clamp-1">{property.address || property.locality + ', ' + property.city}</p>
        </div>
        
        <div className="flex items-center mb-3">
          <TbCurrencyRupee className="text-lg text-green-700" />
          <span className="text-lg font-bold text-green-700">{formatPrice(property.expected_price || 0)}</span>
        </div>
        
        {/* Property specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="flex flex-col items-center bg-gray-50 p-2 rounded">
            <FaBed className="text-blue-600 mb-1" />
            <span className="text-sm font-medium">{property.bedrooms || 'N/A'}</span>
            <span className="text-xs text-gray-500">Beds</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 p-2 rounded">
            <FaBath className="text-blue-600 mb-1" />
            <span className="text-sm font-medium">{property.bathrooms || 'N/A'}</span>
            <span className="text-xs text-gray-500">Baths</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 p-2 rounded">
            <FaRulerCombined className="text-blue-600 mb-1" />
            <span className="text-sm font-medium">{property.carpet_area || property.built_up_area || 'N/A'}</span>
            <span className="text-xs text-gray-500">sq.ft</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.furnished_status && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {property.furnished_status}
            </span>
          )}
          {property.possession_status && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {property.possession_status}
            </span>
          )}
          {property.transaction_type && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {property.transaction_type}
            </span>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
        <button
          onClick={() => onView && onView(property.id)}
          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-medium text-sm"
        >
          <FaEye /> View
        </button>
        <button
          onClick={() => onEdit && onEdit(property.id)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium text-sm"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => onDelete && onDelete(property.id)}
          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium text-sm"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}