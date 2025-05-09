import React, { useRef } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlus, 
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PropertyTable({ properties, onEdit, onDelete, onView }) {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  
  const scrollHorizontal = (direction) => {
    if (tableRef.current) {
      const scrollAmount = 300;
      tableRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  // Table column definitions - keeps code DRY and easier to maintain
  const columns = [
    { id: 'index', label: 'S.No', className: '' },
    { id: 'title', label: 'Title', className: 'font-medium text-gray-900' },
    { id: 'property_category_name', label: 'Category', className: '' },
    { id: 'property_subcategory_name', label: 'Subcategory', className: '' },
    { id: 'city', label: 'City', className: '' },
    // { id: 'locality', label: 'Location', className: '' },
    // { id: 'developer_name', label: 'Developer', className: '' },
    // { id: 'bedrooms', label: 'Bedrooms', className: '' },
    // { id: 'bathrooms', label: 'Bathrooms', className: '' },
    // { id: 'carpet_area', label: 'Carpet Area', className: '' },
    // { id: 'built_up_area', label: 'Built-up Area', className: '' },
    // { id: 'expected_price', label: 'Price (₹)', className: 'font-semibold text-green-600' },
    // { id: 'furnished_status', label: 'Furnishing', className: '' },
    // { id: 'transaction_type', label: 'Transaction', className: '' },
    // { id: 'possession_status', label: 'Possession', className: '' }
  ];

  // Render cell content based on column ID
  const renderCell = (property, columnId, index) => {
    if (columnId === 'index') return index + 1;
    
    const value = property[columnId];
    if (columnId === 'expected_price') {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value);
    }
    
    return value || '—';
  };

  return (
    <div className="w-full flex flex-col h-full bg-white p-6 rounded-xl shadow-sm">
      {/* Header with search and filter options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-amber-100 p-2 rounded-lg mr-3 text-amber-600">
            <FaPlus />
          </span>
          Property Listings
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Table container */}
      <div 
        ref={tableRef}
        className="w-full overflow-x-auto rounded-lg shadow border border-gray-200 flex-grow"
        style={{ 
          scrollbarWidth: 'thin', 
          scrollbarColor: '#f59e0b #e5e7eb',
          maxHeight: 'calc(100vh - 240px)'
        }}
      >
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-700 sticky top-0 z-20">
            <tr>
              {/* Fixed action columns */}
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-center text-white uppercase sticky left-0 z-30 bg-gray-800 shadow-sm">
                Actions
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-center text-white uppercase sticky left-24 z-30 bg-gray-800 shadow-sm">
                FAQ
              </th>
              
              {/* Dynamic columns */}
              {columns.map(column => (
                <th 
                  key={column.id}
                  scope="col" 
                  className="px-4 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {properties?.length > 0 ? (
              properties.map((property, index) => (
                <tr 
                  key={property.id || `property-${index}`} 
                  className={`hover:bg-amber-50 transition-colors duration-150 ease-in-out ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* Fixed action column */}
                  <td className="py-3 whitespace-nowrap text-sm font-medium sticky left-0 z-10 shadow-sm" 
                      style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <div className="flex justify-center space-x-1">
                      <button 
                        onClick={() => onView(property.property_id)} 
                        className="p-1.5 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-all"
                        title="View details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button 
                        onClick={() => onEdit(property)} 
                        className="p-1.5 text-amber-600 bg-amber-100 rounded-full hover:bg-amber-200 transition-all"
                        title="Edit property"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete(property.property_id)} 
                        className="p-1.5 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-all"
                        title="Delete property"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                  
                  {/* FAQ actions column */}
                  <td className="py-3 whitespace-nowrap text-sm font-medium sticky left-24 z-10 shadow-sm" 
                      style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <div className="flex justify-center space-x-1">
                      <button 
                        onClick={() => navigate(`/dashboard/property/${property.property_id}/add-faq`)} 
                        className="py-1 px-2 text-xs text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200 transition-all font-medium"
                      >
                        Add
                      </button>
                      <button 
                        onClick={() => navigate(`/dashboard/property/${property.property_id}/faqs`)} 
                        className="py-1 px-2 text-xs text-purple-600 bg-purple-100 rounded hover:bg-purple-200 transition-all font-medium"
                      >
                        View
                      </button>
                    </div>
                  </td>
                  
                  {/* Dynamic columns */}
                  {columns.map(column => (
                    <td 
                      key={`${property.id}-${column.id}`} 
                      className={`px-4 py-3 whitespace-nowrap text-sm text-gray-600 ${column.className}`}
                    >
                      {renderCell(property, column.id, index)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-gray-500 bg-gray-50">
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

      {/* Footer controls */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {properties?.length} {properties?.length === 1 ? 'property' : 'properties'} found
        </span>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Scroll to view more</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollHorizontal(-1)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button
              onClick={() => scrollHorizontal(1)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}