import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropertyForm from '../components/PropertyForm';
import PropertyCard from '../components/PropertyCard';
import ErrorBoundary from '../components/ErrorBoundary';

export default function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/property`);
      console.log(res.data)
      setProperties(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch properties');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/property/${id}`);
      toast.success('Property deleted');
      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

   const handleEdit = (property) => {
    console.log('Editing property:', property);
    
    // Make sure we're passing the complete property data
    if (property && property.id) {
      setEditData(property);
      setShowForm(true);
    } else {
      console.error('Invalid property data for editing:', property);
      toast.error('Invalid property data');
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Properties</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditData(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
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