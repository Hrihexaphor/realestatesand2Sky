import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function PropertyCard({ property, onEdit, onDelete, onView }) {
  const primaryImage = property.images?.find((img) => img.is_primary);
  
  return (
    <div className="border rounded-lg shadow p-4 bg-white flex flex-col">
      {primaryImage ? (
        <img
          src={primaryImage.image_url}
          alt="Property"
          className="h-48 w-full object-cover rounded mb-4"
        />
      ) : (
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-4">
          No Image
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{property.address}</p>
      <p className="text-sm mb-2">
        <strong>Price:</strong> ₹{property.expected_price}
      </p>
      <p className="text-sm mb-2">
        <strong>Type:</strong> {property.property_category_name}
      </p>
      <p className="text-sm mb-4">
        <strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}
      </p>
      
      <div className="mt-auto flex justify-between">
        <button
          onClick={onView}
          className="text-green-600 hover:text-green-800 flex items-center gap-1"
        >
          <FaEye /> View
        </button>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}