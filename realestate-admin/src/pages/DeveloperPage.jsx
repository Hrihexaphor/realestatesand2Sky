import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBox from "../components/SearchBox";
import * as XLSX from "xlsx";
import { getMediaURL } from "../utils/imageUtils.js";
const DeveloperPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);

  const [dateFilter, setDateFilter] = useState({
    fromDate: "",
    toDate: "",
    showFilter: false,
  });

  const [form, setForm] = useState({
    name: "",
    company_name: "",
    contact_email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    partial_amount: "",
    developerImage: null,
  });

  const [errors, setErrors] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/developer`);
      setDevelopers(res.data);
    } catch (err) {
      toast.error("Failed to fetch developers");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!form.company_name.trim()) {
      newErrors.company_name = "Company name is required";
      isValid = false;
    }

    if (!form.contact_email.trim()) {
      newErrors.contact_email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.contact_email)) {
      newErrors.contact_email = "Email format is invalid";
      isValid = false;
    }

    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
      isValid = false;
    }

    if (form.developerImage && form.developerImage.size > 5 * 1024 * 1024) {
      newErrors.developerImage = "Logo must be less than 5MB";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, developerImage: "Logo must be less than 5MB" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setForm({ ...form, developerImage: file });

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.developerImage) {
        setErrors({ ...errors, developerImage: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "developerImage") {
          // Only append image if it's a new file (not editing) or if a new file is selected during edit
          if (form[key] && form[key] instanceof File) {
            formData.append(key, form[key]);
          }
        } else {
          formData.append(key, form[key]);
        }
      });

      if (editingId) {
        await axios.put(`${BASE_URL}/api/developer/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Developer updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/developer`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Developer added successfully");
      }
      resetForm();
      fetchDevelopers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving developer");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      company_name: "",
      contact_email: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      partial_amount: "",
      developerImage: null,
    });
    setEditingId(null);
    setErrors({});
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (dev) => {
    setForm({
      name: dev.name,
      company_name: dev.company_name,
      contact_email: dev.contact_email,
      phone_number: dev.phone_number,
      address: dev.address || "",
      city: dev.city || "",
      state: dev.state || "",
      partial_amount: dev.partial_amount || "",
      developerImage: null,
    });

    setEditingId(dev.id);

    if (dev.developer_logo) {
      setPreviewImage(`${BASE_URL}/${dev.developer_logo}`);
    } else {
      setPreviewImage(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await axios.delete(`${BASE_URL}/api/developer/${deleteModal.id}`);
      toast.success("Developer deleted successfully");
      fetchDevelopers();
    } catch (err) {
      toast.error("Error deleting developer");
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const filteredDevelopers = developers.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDateFilteredDevelopers = () => {
    if (!dateFilter.fromDate && !dateFilter.toDate) {
      return filteredDevelopers;
    }

    return filteredDevelopers.filter((dev) => {
      const devDate = new Date(dev.created_at || dev.updated_at);
      const fromDate = dateFilter.fromDate
        ? new Date(dateFilter.fromDate)
        : null;
      const toDate = dateFilter.toDate
        ? new Date(dateFilter.toDate + "T23:59:59")
        : null;

      if (fromDate && toDate) {
        return devDate >= fromDate && devDate <= toDate;
      } else if (fromDate) {
        return devDate >= fromDate;
      } else if (toDate) {
        return devDate <= toDate;
      }
      return true;
    });
  };

  const exportToExcel = async () => {
    try {
      setExporting(true);

      const dataToExport = getDateFilteredDevelopers();

      if (dataToExport.length === 0) {
        toast.warning("No data available for the selected date range");
        return;
      }

      const excelData = dataToExport.map((dev, index) => ({
        "S.No": index + 1,
        Name: dev.name,
        "Company Name": dev.company_name,
        Email: dev.contact_email,
        Phone: dev.phone_number,
        Address: dev.address || "",
        City: dev.city || "",
        State: dev.state || "",
        "Partial Amount": dev.partial_amount || "",
        "Created Date": dev.created_at
          ? new Date(dev.created_at).toLocaleDateString()
          : "",
        "Updated Date": dev.updated_at
          ? new Date(dev.updated_at).toLocaleDateString()
          : "",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 6 },
        { wch: 20 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Developers");

      let filename = "developers_list";
      if (dateFilter.fromDate || dateFilter.toDate) {
        const fromStr = dateFilter.fromDate || "start";
        const toStr = dateFilter.toDate || "end";
        filename += `_${fromStr}_to_${toStr}`;
      }
      filename += `_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(wb, filename);

      toast.success(
        `Excel file exported successfully! (${dataToExport.length} records)`
      );
    } catch (error) {
      toast.error("Failed to export Excel file");
    } finally {
      setExporting(false);
    }
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const clearDateFilters = () => {
    setDateFilter({
      fromDate: "",
      toDate: "",
      showFilter: dateFilter.showFilter,
    });
  };

  const dateFilteredDevelopers = getDateFilteredDevelopers();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Developer Management
      </h1>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          {editingId ? "Edit Developer" : "Add New Developer"}
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Developer Logo
            </label>
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  id="developerImage"
                  name="developerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.developerImage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.developerImage}
                  </p>
                )}
              </div>

              {previewImage && (
                <div className="w-1/2">
                  <img
                    src={getMediaURL(previewImage)}
                    alt="Preview"
                    className="h-20 w-20 object-contain border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setForm({ ...form, developerImage: null });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
                disabled={editingId !== null}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  editingId !== null ? "bg-gray-100 cursor-not-allowed" : ""
                } ${
                  errors.company_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.company_name}
                </p>
              )}
              {editingId && (
                <p className="mt-1 text-xs text-gray-500">
                  Company name cannot be edited
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.contact_email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact_email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partial Amount
              </label>
              <input
                name="partial_amount"
                value={form.partial_amount}
                onChange={handleChange}
                placeholder="Enter partial amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${
                editingId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting
                ? "Processing..."
                : editingId
                ? "Update Developer"
                : "Add Developer"}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Developer Directory ({dateFilteredDevelopers.length} records)
          </h2>

          <div className="flex gap-3">
            <SearchBox
              placeholder="Search developers..."
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
            />

            {/* <button
              onClick={() => setDateFilter(prev => ({ ...prev, showFilter: !prev.showFilter }))}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            >
              Filter
            </button> */}

            <button
              onClick={exportToExcel}
              disabled={exporting || dateFilteredDevelopers.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Date Filter Panel */}
        {dateFilter.showFilter && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFilter.fromDate}
                  onChange={(e) =>
                    handleDateFilterChange("fromDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateFilter.toDate}
                  onChange={(e) =>
                    handleDateFilterChange("toDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={clearDateFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : developers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No developers found. Add your first developer above.
          </div>
        ) : dateFilteredDevelopers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No developers match your search criteria.
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dateFilteredDevelopers.map((dev) => (
              <div key={dev.id} className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {dev.name}
                      </h3>
                      {/* <span className="text-sm text-gray-500">ID: {dev.id}</span> */}
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div>
                        <strong>Company:</strong> {dev.company_name}
                      </div>
                      <div>
                        <strong>Email:</strong> {dev.contact_email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {dev.phone_number}
                      </div>
                      {dev.partial_amount && (
                        <div>
                          <strong>Amount:</strong> ₹{dev.partial_amount}
                        </div>
                      )}
                      {(dev.address || dev.city || dev.state) && (
                        <div className="md:col-span-2">
                          <strong>Address:</strong>{" "}
                          {[dev.address, dev.city, dev.state]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      {dev.created_at && (
                        <span>
                          Created:{" "}
                          {new Date(dev.created_at).toLocaleDateString()}
                        </span>
                      )}
                      {dev.updated_at && (
                        <span className="ml-4">
                          Updated:{" "}
                          {new Date(dev.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(dev)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteModal({ show: true, id: dev.id })}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this developer? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPage;
