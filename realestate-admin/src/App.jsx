import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import PropertyPage from './pages/PropertyPage';
import ViewPropertyDetails from './pages/ViewPropertyDetails';
import AmenityPage from './pages/AmenityPage';
import DeveloperPage from './pages/DeveloperPage';
import NearestPage from './pages/NearestPage';
import BlogPage from './pages/BlogPage';
import CategoryManager from './pages/CategoryManager';
import FeaturedManager from './pages/FeaturedManager';
import LeadPage from './pages/LeadPage';
import AddFAQPage from './pages/AddFAQPage';
import ViewFAQsPage from './pages/ViewFAQsPage';
import PropertyTable from './components/PropertyCard';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';
// Set globally once in your main file (e.g., App.jsx or axios.js)

axios.defaults.withCredentials = true;
function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'seller']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<ProtectedRoute allowedRoles={['admin', 'manager', 'seller']}><PropertyTable /></ProtectedRoute>} />
        <Route path="property" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'seller']}><PropertyPage /></ProtectedRoute>} />
        <Route path="property/:id" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'seller']}><ViewPropertyDetails /></ProtectedRoute>} />
        <Route path="amenities" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AmenityPage /></ProtectedRoute>} />
        <Route path="developer" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><DeveloperPage /></ProtectedRoute>} />
        <Route path="nearest" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><NearestPage /></ProtectedRoute>} />
        <Route path="category" element={<ProtectedRoute allowedRoles={['admin']}><CategoryManager /></ProtectedRoute>} />
        <Route path="featured" element={<ProtectedRoute allowedRoles={['admin']}><FeaturedManager /></ProtectedRoute>} />
        <Route path="leads" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><LeadPage /></ProtectedRoute>} />
        <Route path="property/:id/add-faq" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><AddFAQPage /></ProtectedRoute>} />
        <Route path="property/:id/faqs" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><ViewFAQsPage /></ProtectedRoute>} />
        <Route path="blogs" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'seller']}><BlogPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default App;
