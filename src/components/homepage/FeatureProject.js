import Slider from "react-slick";
import { useState, useEffect } from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  gap: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const FeatureProject = () => {

  const navigate = useNavigate();
  const [featureProperty, setFeatureProperty] = useState([]);
    useEffect(() => {
            axios.get(`${process.env.REACT_APP_BASE_URL}/featured-properties-lite`, {
                withCredentials: true, // replaces fetch's `credentials: 'include'`
            })
                .then((res) => {
                    setFeatureProperty(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
    }, []);

     const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
     }

  // Convert price to Lac or Cr format
  function formatPrice(price) {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString(); // fallback
  }

  return (
    <>
      <div className=" bg-[#F4EFE5]">
        <div className="container pt-44">
          <div className="flex items-center justify-between mb-4">
            {/* Left Side - Title with Underline */}
            <div className="mb-3">
              <h2 className="mb-2 color-[#3C4142] text-2xl font-bold font-geometric-regular">
                Featured Projects
              </h2>
              <div className="w-12 h-1 bg-yellow-500"></div>
            </div>

            {/* Right Side - Link */}
            <Link
              to={'/Projects'}
              className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline font-roboto-light"
            >
              See all Projects <span className="ml-1">→</span>
            </Link>
          </div>

          <Slider {...settings}>
            {featureProperty.map((property, index) => (
              <div key={index} className="p-2">
                <div className="card border rounded font-geometric-regular mb-3">
                        <img
                          src={property.primary_image}
                          className="card-img-top"
                          alt={property.project_name}
                          style={{ height: "300px", objectFit: "cover" }}
                        />
                        <div className="card-body font-roboto-light justify-between flex lg:items-center flex-col lg:flex-row px-4 pb-0">
                          <h5 className="card-title font-bold text-[#3C4142] md:text-md sm:text-md mb-2 lg:mb-0">{property.project_name}</h5>
                          <button
                            className=" px-4 py-1 bg-[#367588] text-white text-base rounded-md hover:bg-[#1386a8]"
                            onClick={() => handleDetailsClick(property.id)}
                          >
                            View Details
                          </button>
                        </div>
                        <div className="card-body flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 m-4">
                          <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                            <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.expected_price)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                            <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                              {/* <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.bhk}</p> */}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                            <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.locality}, {property.city}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                            <HiMiniBuildingOffice2 className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bulider</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px] cursor-pointer" onClick={() => navigate(`/builderProject`)}>{property.developer_name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default FeatureProject;
