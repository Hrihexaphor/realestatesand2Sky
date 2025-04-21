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
import ProtectedRoute from './components/ProtectedRoute';
import CategoryManager from './pages/CategoryManager';

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<div>Welcome to Dashboard</div>} />
        <Route path="property" element={<ProtectedRoute><PropertyPage /></ProtectedRoute>} />
        <Route path="property/:id" element={<ProtectedRoute><ViewPropertyDetails /></ProtectedRoute>} />
        <Route path="amenities" element={<ProtectedRoute><AmenityPage /></ProtectedRoute>} />
        <Route path="developer" element={<ProtectedRoute><DeveloperPage /></ProtectedRoute>} />
        <Route path="nearest" element={<ProtectedRoute><NearestPage /></ProtectedRoute>} />
        <Route path="category" element={<ProtectedRoute><CategoryManager/></ProtectedRoute>}/>
        <Route path="blogs" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default App;