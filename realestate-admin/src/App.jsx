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
import FeaturedManager from './pages/FeaturedManager';
// import LeadPage from './pages/LeadPage';
import AddFAQPage from './pages/AddFAQPage';
import ViewFAQsPage from './pages/ViewFAQsPage';
import PropertyTable from './components/PropertyCard';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import InquiryLeadsPage from './pages/InquiryLeadsPage';
import BlogCategoryManager from './pages/BlogCategoryManager';
import CancellationPolicy from './pages/CancellationPolicy';
import TermaAndServicesPage from './pages/TermaAndServicesPage';
import AdvertisementForm from './pages/AdvertisementForm ';
import ReviewTable from './pages/ReviewTable';


function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<PropertyTable />} />
        <Route path="property" element={<PropertyPage />} />
        <Route path="property/:id" element={<ViewPropertyDetails />} />
        <Route path="amenities" element={<AmenityPage />} />
        <Route path="developer" element={<DeveloperPage />} />
        <Route path="nearest" element={<NearestPage />} />
        <Route path="category" element={<CategoryManager />} />
        <Route path="featured" element={<FeaturedManager />} />
        <Route path="review" element={<ReviewTable />} />
        <Route path="advertisement" element={<AdvertisementForm />} />
        {/* <Route path="leads" element={<LeadPage/>}/> */}
        <Route path="inquiryleads" element={<InquiryLeadsPage />} />
        <Route path="aboutus" element={<AboutUsPage />} />
        <Route path="privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="cancelpolicy" element={<CancellationPolicy />} />
        <Route path="termandservice" element={<TermaAndServicesPage />} />
        <Route path="property/:id/add-faq" element={<AddFAQPage />} />
        <Route path="property/:id/faqs" element={<ViewFAQsPage />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path="blog-category" element={<BlogCategoryManager />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default App;