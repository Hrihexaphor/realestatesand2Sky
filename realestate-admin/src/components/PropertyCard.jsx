import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PropertyCard({
  properties = [],
  onEdit,
  onDelete,
  onView,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter properties based on search
  const filteredProperties = properties.filter(
    (property) =>
      property.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_category_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      property.locality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";

    if (sortField === "expected_price") {
      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = sortedProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleExpanded = (propertyId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:bg-gray-600 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-amber-100 p-3 rounded-lg mr-4 text-amber-600">
              <FaPlus />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Property Listings
              </h1>
              <p className="text-gray-600">
                Manage your {properties.length} properties efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by project name, city, category, or locality..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Clear filters */}
              {(searchTerm || sortField) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortField("");
                    setCurrentPage(1);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                    Actions
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Project Name
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-white uppercase">
                    FAQ
                  </th>
                  <SortableHeader field="property_category_name">
                    Category
                  </SortableHeader>
                  <SortableHeader field="city">City</SortableHeader>
                  <SortableHeader field="expected_price">Price</SortableHeader>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProperties.map((property, index) => (
                  <>
                    {/* Main Row */}
                    <tr
                      key={property.property_id || property.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Actions */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-1">
                          {/* <button 
                            onClick={() => onView(property.property_id || property.id)} 
                            className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-all"
                            title="View details"
                          >
                            <FaEye size={12} />
                          </button> */}
                          <button
                            onClick={() =>
                              window.open(
                                `https://sand2skyfrontendfile.vercel.app/details/${
                                  property.property_id || property.id
                                }`,
                                "_blank"
                              )
                            }
                            className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-all"
                            title="View details"
                          >
                            <FaEye size={12} />
                          </button>
                          <button
                            onClick={() => onEdit(property)}
                            className="p-2 text-amber-600 bg-amber-100 rounded-full hover:bg-amber-200 transition-all"
                            title="Edit property"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() =>
                              onDelete(property.property_id || property.id)
                            }
                            className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-all"
                            title="Delete property"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                      {/* Property Info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {property.project_name || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* FAQ Actions */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/property/${
                                  property.property_id || property.id
                                }/add-faq`
                              )
                            }
                            className="py-1 px-2 text-xs text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200 transition-all font-medium"
                          >
                            Add
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/property/${
                                  property.property_id || property.id
                                }/faqs`
                              )
                            }
                            className="py-1 px-2 text-xs text-purple-600 bg-purple-100 rounded hover:bg-purple-200 transition-all font-medium"
                          >
                            View
                          </button>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">
                            {property.property_category_name || "—"}
                          </div>
                          {property.property_subcategory_name && (
                            <div className="text-xs text-gray-500">
                              {property.property_subcategory_name}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {property.city || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-sm font-semibold text-green-600">
                        {formatPrice(property.expected_price)}
                      </td>

                      {/* Details Toggle */}
                      <td className="px-4 py-4 text-sm font-medium">
                        <button
                          onClick={() =>
                            toggleExpanded(property.property_id || property.id)
                          }
                          className="flex items-center text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          {expandedRows.has(
                            property.property_id || property.id
                          ) ? (
                            <>
                              <FaChevronDown className="mr-1" size={12} />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <FaChevronRight className="mr-1" size={12} />
                              Show Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedRows.has(property.property_id || property.id) && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="border-l-4 border-amber-500 pl-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Detailed Information for "{property.title}"
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Basic Info */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-700 text-sm">
                                  Basic Information
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      Developer:
                                    </span>{" "}
                                    {property.developer_name || "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Transaction:
                                    </span>{" "}
                                    {property.transaction_type || "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Possession:
                                    </span>{" "}
                                    {property.possession_status || "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Furnishing:
                                    </span>{" "}
                                    {property.furnished_status || "—"}
                                  </div>
                                </div>
                              </div>

                              {/* Property Details */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-700 text-sm">
                                  Property Details
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      Bedrooms:
                                    </span>{" "}
                                    {property.bedrooms || "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Bathrooms:
                                    </span>{" "}
                                    {property.bathrooms || "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Carpet Area:
                                    </span>{" "}
                                    {property.carpet_area
                                      ? `${property.carpet_area} sq ft`
                                      : "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Built-up Area:
                                    </span>{" "}
                                    {property.built_up_area
                                      ? `${property.built_up_area} sq ft`
                                      : "—"}
                                  </div>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-700 text-sm">
                                  Additional Information
                                </h5>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      Posted:
                                    </span>{" "}
                                    {property.created_at
                                      ? new Date(
                                          property.created_at
                                        ).toLocaleDateString()
                                      : "—"}
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Updated:
                                    </span>{" "}
                                    {property.updated_at
                                      ? new Date(
                                          property.updated_at
                                        ).toLocaleDateString()
                                      : "—"}
                                  </div>
                                  {property.description && (
                                    <div className="mt-2">
                                      <span className="text-gray-500">
                                        Description:
                                      </span>
                                      <p className="text-gray-600 text-xs mt-1">
                                        {property.description.substring(0, 100)}
                                        ...
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(
                          startIndex + itemsPerPage,
                          sortedProperties.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sortedProperties.length}
                      </span>{" "}
                      properties
                      {searchTerm && (
                        <span className="text-gray-500">
                          {" "}
                          (filtered from {properties.length} total)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {sortedProperties.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No properties found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `No properties match "${searchTerm}"`
                : "No properties available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
