import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import {
  FaRupeeSign,
  FaMapMarkerAlt
} from "react-icons/fa";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
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
    featured: false,
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
    featured: true,
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
const DetailsDemo = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-[#F4EFE5] ">
        <div className="container mx-auto p-6">
          <div className="mb-3">
            <h2 className="mb-2  text-2xl text-[#3C4142] font-bold font-geometric-regular">Top Projects from Builders</h2>
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

export default DetailsDemo;
