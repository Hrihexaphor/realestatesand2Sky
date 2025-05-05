import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/auth/me`, {
          withCredentials: true
        });
        console.log(res);
        setUserRole(res.data.role);
      } catch (err) {
        console.error("Session check failed:", err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
