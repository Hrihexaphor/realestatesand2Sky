import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  gap: 3,
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
    title: "Shree Omkar Ressidency",
    image:
      "https://cdn.pixabay.com/photo/2019/02/23/22/15/architecture-4016642_640.jpg",
    type: "3 BHK",
    price: "1 CR",
    area: "1340 sq.ft.",
    builder: "RK Builders",
    location: "Patia, Bhubaneswar",
    featured: true,
  },
  {
    title: "Raghuram Properties",
    image:
      "https://cdn.pixabay.com/photo/2014/08/06/20/14/mansion-411969_640.jpg",
    type: "2 BHK",
    price: "3 CR",
    area: "1340 sq.ft.",
    builder: "RK Builders",
    location: "Patia, Bhubaneswar",
    featured: false,
  },
  {
    title: "Pavitra Villa",
    image:
      "https://cdn.pixabay.com/photo/2018/11/29/17/43/block-3846173_640.jpg",
    type: "4 BHK",
    price: "5 CR",
    area: "1340 sq.ft.",
    builder: "RK Builders",
    location: "Patia, Bhubaneswar",
    featured: true,
  },
  {
    title: "Rathi House",
    image:
      "https://cdn.pixabay.com/photo/2018/11/29/17/43/block-3846173_640.jpg",
    type: "2 BHK",
    price: "30 Lac",
    area: "1340 sq.ft.",
    builder: "RK Builders",
    location: "Patia, Bhubaneswar",
    featured: false,
  },
];

const TrandProperties = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#F4EFE5]">
      <div className="container mx-auto  sm:p-10 md:p-16 pt-5">
        <div className="mb-3">
          <h2 className="mb-2 text-2xl font-bold  font-geometric-regular text-[#3C4142]">Trending Properties</h2>
          <div className="w-12 h-1 bg-yellow-500"></div>
        </div>
        <Slider {...settings}>
          {properties.map((property, index) => (
            <div key={index} className="p-2">
              <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                <div className="h-[200PX] w-[100%] img-box relative">
                  <img src={property.image} className="h-[100%] w-[100%]" />
                  {property.featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                </div>
                <div className="p-3">
                  <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{property.title}</h3>
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
                  {/* <div className="flex justify-between mt-3">
                    <span className="flex items-center">
                      <MdBedroomParent style={{ fontSize: '21px', color: '#367588' }} />
                      <span className="ml-1 font-bold">{property.type}</span>
                    </span>
                    <span className="flex items-center">
                      <FaRupeeSign style={{ fontSize: '18px', color: '#367588' }} />
                      <span className="ml-1 font-bold">{property.price}</span>
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TrandProperties;
