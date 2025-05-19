import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import {
  FaSwimmingPool,
  FaRupeeSign,
  FaCar,
  FaDumbbell,
  FaMapMarkerAlt
} from "react-icons/fa";

const PropertyListing = () => {

  const navigate = useNavigate();

  const amenities = [
    { icon: <FaSwimmingPool />, label: "House" },
    { icon: <FaCar />, label: "PG" },
    { icon: <FaCar />, label: "Plots" },
    { icon: <FaDumbbell />, label: "Apartments" },
    // { icon: <FaUtensils />, label: "Restaurant" },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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

  const properties = [
    {
      id: 1,
      name: "Luxury Apartment",
      price: "₹2.5 Cr",
      type: "3 BHK",
      area: "1200 sq.ft.",
      builder: "DN Groups",
      location: "Rasulgarh",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 2,
      name: "Modern Villa",
      price: "₹3.8 Cr",
      type: "3 BHK",
      area: "1200 sq.ft.",
      builder: "DN Groups",
      location: "Khandagiri",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 3,
      name: "Skyline Towers",
      price: "₹1.2 Cr",
      type: "3 BHK",
      area: "1200 sq.ft.",
      builder: "DN Groups",
      location: "Nayapalli",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 4,
      name: "Green Residency",
      price: "₹90 Lakh",
      type: "3 BHK",
      area: "1200 sq.ft.",
      builder: "DN Groups",
      location: "Patia",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 5,
      name: "Sunrise Heights",
      price: "₹1.5 Cr",
      type: "3 BHK",
      area: "1200 sq.ft.",
      builder: "DN Groups",
      location: "Badagada",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
  ];

  return (
    <>
      <div className="bg-[#F4EFE5]">
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 ">
          {/* Left Side - Property Listings */}
          <div className="lg:col-span-3 space-y-6 pt-20">
            {/* Featured Property Carousel */}
            <div>
              <div className="mb-3">
                <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Listing project</h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Slider {...settings}>
                {properties.map((property) => (
                  <div key={property.id} className="p-2">
                    <div className="bg-white rounded-lg overflow-hidden relative">
                      <img
                        src={property.img}
                        alt={property.name}
                        className="w-full h-48 object-cover"
                      />
                      {property.featured === true && (
                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                          Featured
                        </p>
                      )}
                      <div className="p-3">
                        <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{property.name}</h3>
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex gap-2 items-center w-[50%] mb-2">
                            <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.price}</p>
                            </div>

                          </div>
                          <div className="flex gap-2 items-center w-[50%]  mb-2">
                            <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.type}</p>
                            </div>

                          </div>
                          <div className="flex gap-2 items-center w-[50%] mb-2">
                            <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.area}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center w-[50%]">
                            <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px] cursor-pointer" onClick={() => navigate(`/builderProject`)}>{property.builder}</p>
                            </div>

                          </div>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                          <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.location}</p>
                          </div>
                        </div>
                        <button
                          className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                          onClick={() => navigate(`/details`)}
                        >
                          View Details
                        </button>
                        {/* <h3 className="text-lg font-semibold">
                          {property.name}
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-600 text-sm lg:text-sm price-tag mb-0 hover:bg-[#1386a8]">{property.price}</p>
                          <div className="flex gap-2 items-center">
                            <FaMapMarkerAlt className="color-[#395D66]" />
                            <p className="text-gray-600 mb-0">{property.location}</p>
                          </div>
                        </div>
                        
                        <button className="mt-2 px-2 py-1 center bg-[#367588] text-white rounded-xl hover:bg-[#1386a8]">
                          View Details
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Property Categories */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={property.img}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className="text-gray-600">{property.price}</p>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div> */}
          </div>

          {/* Right Sidebar - Special Offers */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg sticky top-10 h-fit mt-20">
            <h2 className="text-xl font-bold mb-4">Special Offers</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">Limited-Time Discount</h3>
              <p className="text-gray-600">
                Get up to 10% off on select properties.
              </p>
              <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Claim Offer
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Zero Brokerage</h3>
              <p className="text-gray-600">
                Exclusive properties with no agent fee.
              </p>
              <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                View Deals
              </button>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  container mx-auto">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-gray-800 text-white p-3 rounded-lg"
            >
              <span className="text-2xl text-red-500">{amenity.icon}</span>
              <span className="text-lg">{amenity.label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default PropertyListing;
