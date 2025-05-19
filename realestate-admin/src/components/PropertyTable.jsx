import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import SearchBox from './SearchBox';

const PropertyTable = ({ 
  properties = [], 
  onEdit, 
  onDelete, 
  onView, 
  onFeature,
  featuredProperties = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ml-1 text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-blue-600" /> : <FaSortDown className="ml-1 text-blue-600" />;
  };
  
  // Filter properties by search term
  const filteredProperties = properties.filter(property => 
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (property.address && property.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (property.property_category_name && property.property_category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let valueA = a[sortField] || '';
    let valueB = b[sortField] || '';
    
    if (sortField === 'expected_price') {
      valueA = parseFloat(valueA) || 0;
      valueB = parseFloat(valueB) || 0;
    } else {
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table controls */}
      <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Properties ({properties.length})</h2>
        <SearchBox  placeholder="Search properties..." containerClassName="relative w-full sm:w-auto" value={searchTerm} onChange={(val) => setSearchTerm(val)} />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center">
                  Property {getSortIcon('title')}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('property_category_name')}>
                <div className="flex items-center">
                  Category {getSortIcon('property_category_name')}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specifications
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('expected_price')}>
                <div className="flex items-center">
                  Price {getSortIcon('expected_price')}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProperties.length > 0 ? (
              sortedProperties.map((property, index) => (
                <PropertyTableRow
                  key={property.id}
                  property={property}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onFeature={onFeature}
                  isFeatured={featuredProperties.includes(property.id)}
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No properties match your search criteria' : 'No properties available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table footer */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="text-sm text-gray-500">
          Showing {sortedProperties.length} of {properties.length} properties
        </div>
      </div>
    </div>
  );
};

export default PropertyTable;