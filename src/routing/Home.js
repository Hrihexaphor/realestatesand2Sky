import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Propertys from "../components/header/Propertys";
import ProjectGallery from "../components/homepage/ProjectGallery";
import FeatureProject from "../components/homepage/FeatureProject";
import NewFeature from "../components/homepage/NewFeature";
import ListingSection from "../components/homepage/ListingSection";
import ListingWf from "../components/homepage/ListingWf";
import DetailsDemo from "../components/homepage/DetailsDemo";
import DetailsPage from "../components/detailspage/DetailsPage";
import DetailPage from "../components/homepage/DetailPage";
import ReadyToMove from "../components/homepage/ReadyMove";
import Footer from "../components/footer/Footer";
import PropertListingWf from "../components/homepage/PropertListingWf";
import BlogPage from "../components/blogpage/BlogPage";
import NewProject from "../components/homepage/NewProject";
import ToolsAdvice from "../components/homepage/ToolsAdvice";
import Faq from "../components/aboutpage/Faq";
import TrandProperties from "../components/homepage/TrandProperties";
import PropertyOption from "../components/homepage/PropertyOption";

const Home = () => {
  return (
    <div>
      <Propertys />
      <FeatureProject />
      <NewProject />
      <ProjectGallery />
      {/* ----- */}

      <ReadyToMove />
      <NewFeature />
      <TrandProperties />
      {/* <ListingSection /> */}
      {/* ------ */}
      <ListingWf />
      <PropertListingWf />
      <DetailsDemo />
      {/* <DetailPage /> */}
      {/* <DetailsPage /> */}
      <Faq />
      <ToolsAdvice />
      {/* <BlogPage /> */}
      <PropertyOption/>
      <Footer />
    </div>
  );
};

export default Home;
