import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        console.log("Checking authentication...");
        
        // First, check if we already have role information
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          console.log("Found stored role:", storedRole);
          setUserRole(storedRole);
          setLoading(false);
          return;
        }
        
        // Otherwise make the API call
        console.log("Making auth request to:", `${BASE_URL}/api/admin/auth/me`);
        const res = await axios.get(`${BASE_URL}/api/admin/auth/me`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Auth response:", res.data);
        
        if (res.data && res.data.role) {
          // Store the role in localStorage for future checks
          localStorage.setItem('userRole', res.data.role);
          setUserRole(res.data.role);
        } else {
          setError('No role information received');
          setUserRole(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setError(err.response?.status || err.message);
        setUserRole(null);
        
        // Clear any stored role on auth failure
        localStorage.removeItem('userRole');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, [BASE_URL]);

  // Handle logout - can be called from anywhere by importing this function
  const logout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    // You can also call your logout API here if needed
  };
  
  // Make logout function available globally
  window.logoutUser = logout;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Authentication error:", error);
  }
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;