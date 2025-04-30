import React, { useRef } from 'react';
import { FaEdit, FaTrash, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function PropertyTable({ properties, onEdit, onDelete, onView }) {
  const tableRef = useRef(null);
  
  // Function to handle manual horizontal scrolling
  const scrollHorizontal = (direction) => {
    if (tableRef.current) {
      const scrollAmount = 300; // Adjust the scroll amount as needed
      tableRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Table title */}
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Property Listings</h2>
      </div>

      {/* Table container with ref for scrolling */}
      <div 
        ref={tableRef}
        className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-200 flex-grow"
        style={{ 
          scrollbarWidth: 'thin', 
          scrollbarColor: '#3b82f6 #e5e7eb',
          maxHeight: 'calc(100vh - 140px)' // Adjust to leave space for footer controls
        }}
      >
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 sticky top-0 z-20">
            <tr>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-center text-white uppercase sticky left-0 z-30 bg-blue-600">Actions</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">S.No</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Title</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Category</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Subcategory</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">City</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Location</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Developer</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Bedrooms</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Bathrooms</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Carpet Area</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Built-up Area</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Price (₹)</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Furnishing</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Transaction</th>
              <th scope="col" className="px-6 py-4 text-xs font-medium tracking-wider text-left text-white uppercase">Possession</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties?.length > 0 ? (
              properties.map((property, index) => (
                <tr 
                  key={property.id || `property-${index}`} 
                  className={`hover:bg-blue-50 transition-colors duration-150 ease-in-out ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky left-0 z-10" style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <div className="flex justify-center space-x-3">
                      <button 
                        onClick={() => onView(property.property_id)} 
                        className="p-1.5 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-150"
                        title="View details"
                      >
                        <FaEye className="text-green-600" />
                      </button>
                      <button 
                        onClick={() => onEdit(property)} 
                        className="p-1.5 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
                        title="Edit property"
                      >
                        <FaEdit className="text-blue-600" />
                      </button>
                      <button 
                        onClick={() => onDelete(property.property_id )} 
                        className="p-1.5 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-150"
                        title="Delete property"
                      >
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.property_category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.property_subcategory_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.locality}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.developer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.bedrooms || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.bathrooms || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.carpet_area || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.built_up_area || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{property.expected_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.furnished_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.transaction_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{property.possession_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed scroll controls at the bottom */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-2 mt-2 flex justify-between items-center shadow-md z-10">
        <span className="text-sm text-gray-500">
          {properties?.length} {properties?.length === 1 ? 'property' : 'properties'} found
        </span>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Scroll to view more</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollHorizontal(-1)}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-blue-600" />
            </button>
            <button
              onClick={() => scrollHorizontal(1)}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}