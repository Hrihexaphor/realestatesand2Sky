import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaBed,
  FaRulerCombined,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const DetailsPage = () => {
  const projectImages = [
    "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-35-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
    "https://img.staticmb.com/mbimages/project/Photo_h470_w1080/2023/01/17/Project-Photo-27-Khushi-Capella-Bhubaneswar-5333617_1800_2400_470_1080.jpg",
    "https://img.staticmb.com/mbimages/project/Photo_h470_w1080/2023/01/17/Project-Photo-30-Khushi-Capella-Bhubaneswar-5333617_1800_2400_470_1080.jpg",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <div className="container mx-auto mb-5 px-4">
        <div className="row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Image Slider (col-6) */}
          <div className="col-12 col-md-6 p-0 h-[400px] ">
            <Slider {...settings}>
              {projectImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Project ${index + 1}`}
                  className="w-100 h-100 object-cover"
                />
              ))}
            </Slider>
          </div>

          {/* Project Details (col-6) */}
          <div className="col-12 col-md-6 p-2   ps-5" >
            <div style={{backgroundColor:"#e3c6dc", padding:"20px" , }} className="pb-5">
            <h2 className="text-2xl fw-bold text-primary pb-4">
              Shubham Artesia{" "}
              <span className="bg-warning text-xs px-2 py-1 rounded ms-2">
                Luxury
              </span>
            </h2>

            <p className="text-muted mt-2 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2 text-primary" />
              Shubham Artesia, Ghatkopar East, Mumbai
            </p>

            {/* Details Section */}
            <div className="mt-4 row">
              <div className="col-6 d-flex align-items-center">
                <FaBed className="text-primary me-2" />
                <div>
                  <p className="text-muted small mb-0">BHK</p>
                  <p className="fw-semibold">2,3 BHK</p>
                </div>
              </div>

              <div className="col-6 d-flex align-items-center">
                <MdOutlineDateRange className="text-primary me-2" />
                <div>
                  <p className="text-muted small mb-0">Possession</p>
                  <p className="fw-semibold">30-Dec-2027</p>
                </div>
              </div>

              <div className="col-6 d-flex align-items-center">
                <FaRulerCombined className="text-primary me-2" />
                <div>
                  <p className="text-muted small mb-0">Carpet Area</p>
                  <p className="fw-semibold">670 - 1350 Sq Ft</p>
                </div>
              </div>

              <div className="col-6 d-flex align-items-center">
                <FaBuilding className="text-primary me-2" />
                <div>
                  <p className="text-muted small mb-0">No. of Units</p>
                  <p className="fw-semibold">152 Units</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <p className="text-dark fw-bold fs-5 mt-4">₹ 2.35 Cr - 4.7 Cr</p>

            {/* Buttons */}
            <div className="mt-4 d-flex gap-3">
              <button className="btn btn-outline-primary">Get Brochure</button>
              <button className="btn btn-primary">View Gallery</button>
            </div>

            {/* Footer */}
            <p className="text-muted small mt-3">
              RERA Approved | Developed by Shubham Group
            </p>
            </div>

          </div>
        </div>
      </div>
      {/* ------------------------ */}
    </div>
  );
};

export default DetailsPage;
