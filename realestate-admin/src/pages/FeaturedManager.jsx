import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeaturedManager = () => {
  const [properties, setProperties] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchProperties();
    fetchFeaturedIds();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/property`);
      setProperties(res.data);
    } catch (err) {
      toast.error('Error fetching properties');
    }
  };

  const fetchFeaturedIds = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/featuredids');
      setFeaturedIds(res.data);
    } catch (err) {
      toast.error('Error fetching featured IDs');
    }
  };

  const handleAdd = async (id) => {
    try {
      await axios.post('http://localhost:3001/api/addtofeatured', { property_id: id });
      toast.success('Added to featured');
      fetchFeaturedIds();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/featured/:property_id/${id}`);
      toast.success('Removed from featured');
      fetchFeaturedIds();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Featured Properties</h2>
      {properties.map((property, index) => (
        <div key={property.id} className="border p-4 rounded mb-3 shadow">
          <p><strong>{index + 1}. {property.title}</strong></p>
          <p>{property.location}</p>
          {featuredIds.includes(property.id) ? (
            <button
              className="bg-red-500 text-white px-4 py-1 rounded mt-2"
              onClick={() => handleRemove(property.id)}
            >
              Remove from Featured
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-1 rounded mt-2"
              onClick={() => handleAdd(property.id)}
            >
              Add to Featured
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedManager;
