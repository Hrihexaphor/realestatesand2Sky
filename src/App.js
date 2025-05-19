// App.jsx
import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/routing/Home";
import BlogPage from "./components/blogpage/BlogPage";
import BlogDetails from "./components/blogpage/BlogDetails";
import AboutPage from "./components/aboutpage/AboutPage";
import ContantPage from "./components/contactpage/ContactPage";
import TermofService from "./components/privacyterm/TermofService";
import PrivacyPolicy from "./components/privacyterm/PrivacyPolicy";
import CancellationPolicy from "./components/privacyterm/CancellationPolicy";
import NewProjects from "./components/newprojects/NewProjects";
import BuilderProject from "./components/builderProject/BuilderProject";
import DetailPage from "./components/homepage/DetailPage";
import ListingSection from "./components/homepage/ListingSection";
import PostReq from "./components/PostReq";
import Error from "./components/Error";
import AdminLogin from "./server/AdminLogin";
import AddProperties from "./server/AddProperties";
import Imgsec from "./components/homepage/Imgsec";
import Projects from "./components/projects/Projects";
import ScrollToTop from "./utills/ScrollToTop";
import ProperyByArea from "./components/properties/PropertyByArea";
import EmaiCalculator from "./components/emiCalculator/EmiCalculator";
import BlogCard from "./components/homepage/BlogCard";
import SearchBar from "./components/searchbar/searchbar";
import { FaSpinner } from "react-icons/fa";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., for API or initial render)
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <FaSpinner />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newprojects" element={<NewProjects />} />
          <Route path="/builderProject" element={<BuilderProject />} />
          <Route path="/details/:id" element={<DetailPage />} />
          <Route path="/listing" element={<ListingSection />} />
          <Route path="/postreq" element={<PostReq />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogDetails" element={<BlogDetails />} />
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/contact" element={<ContantPage />} />
          <Route path="/termofService" element={<TermofService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cancellationPolicy" element={<CancellationPolicy />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/addproperties" element={<AddProperties />} />
          <Route path="/imgsec" element={<Imgsec />} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/propertyByArea" element={<ProperyByArea/>} />
          <Route path="/emiCalculator" element={<EmaiCalculator/>} />
          <Route path="/blogCard" element={<BlogCard/>} />
          <Route path="/searchbar" element={<SearchBar/>}/>
          <Route path="/*" element={<Error />} />
        </Routes>
    </Router>
  );
};

export default App;
