import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PropertyForm from "../components/PropertyForm";
import PropertyCard from "../components/PropertyCard";
import ErrorBoundary from "../components/ErrorBoundary";

export default function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/property`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      console.log(res.data);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch properties");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    try {
      const previousProperties = [...properties];
      setProperties((prev) =>
        prev.filter((property) => (property.property_id || property.id) !== id)
      );

      toast.info("Deleting property...");
      await axios.delete(`${BASE_URL}/api/property/${id}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      toast.success("Property deleted");
      await fetchProperties();
    } catch (err) {
      setProperties(previousProperties);
      console.error("Delete error:", err);
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (property) => {
    console.log("Editing property:", property);

    // Make sure we're passing the complete property data
    if (property && property.id) {
      setEditData(property);
      setShowForm(true);
    } else {
      console.error("Invalid property data for editing:", property);
      toast.error("Invalid property data");
    }
  };

  const handleView = (propertyId) => {
    navigate(`/dashboard/property/${propertyId}`);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
    fetchProperties();
  };
  // Add refresh button for manual refresh
  const handleRefresh = () => {
    fetchProperties();
    toast.info("Refreshing properties...");
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Properties</h2>
        {/* <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button> */}
        <button
          onClick={() => {
            setShowForm(true);
            setEditData(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Property
        </button>
      </div>

      {showForm ? (
        <div className="mb-6">
          <PropertyForm editData={editData} onClose={handleFormClose} />
        </div>
      ) : (
        <PropertyCard
          properties={properties}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
}
