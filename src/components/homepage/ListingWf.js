import React from "react";
import Marquee from "react-fast-marquee";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import BudgetRange from "./BudgetRange";
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";

const ListingWf = () => {
  const navigate = useNavigate();

  const topLocations = [
    { icon: "📍", title: "Patia", value: "45+", unit: "Properties" },
    { icon: "📍", title: "Khandagiri", value: "32+", unit: "Projects" },
    { icon: "📍", title: "Chandaka", value: "28+", unit: "Listings" },
    { icon: "📍", title: "Cuttack Road", value: "50+", unit: "Deals" },
    { icon: "📍", title: "Jagamara", value: "20+", unit: "Flats" },
  ];
  const properties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      price: "₹1.2 Cr",
      type: "2 BHK",
      area: "1850 sqft",
      location: "Patia, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Luxury",
      builder: "RK Builders",
    },
    {
      id: 2,
      title: "Affordable 2BHK Flat",
      price: "₹52 Lac",
      type: "2 BHK",
      area: "1250 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
    {
      id: 3,
      title: "Affordable 1BHK Flat",
      price: "₹52 Lac",
      type: "2 BHK",
      area: "1250 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
    {
      id: 4,
      title: "Affordable 2BHK Flat",
      price: "₹53 Lac",
      type: "2 BHK",
      area: "1350 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
  ];

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


  return (
    <div className="bg-[#F4EFE5]">
      <div className="text-center container mx-auto pb-16 pt-10">
        <h2 className="text-yellow-700 text-lg font-semibold uppercase tracking-widest mb-10">
          Top Locations
        </h2>
        <h1 className=" font-bold text-[#3C4142] mt-1 text-2xl  font-geometric-regular">
          Find Property in Popular Areas
        </h1>
        <p className="text-gray-500 mt-2 mb-10 max-w-xl mx-auto font-sans">
          Explore trending locations where your dream home might be waiting for
          you.
        </p>

        {/* Marquee Image Section */}
        <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
          <Marquee
            pauseOnHover={true}
            speed={50}
            gradient={true}
            gradientWidth={100}
          >
            {topLocations.map((loc, i) => (
              <div
                key={i}
                className="relative cursor-pointer rounded-lg overflow-hidden shadow-md me-4 h-40 group w-[260px] object-cover"
                style={{
                  backgroundImage: `url('https://houssed.com/assets/images/locality/locality2.webp')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => navigate('/propertyByArea')}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2 text-center">
                  <h3 className="text-lg font-semibold">{loc.title}</h3>
                  <p className="text-sm">
                    <span className="text-lg font-bold text-[#FFD700]">
                      {loc.value}
                    </span>{" "}
                    {loc.unit}
                  </p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      <BudgetRange />

      {/* property listing section */}
      <div className="container mx-auto pt-10">
        <div className="flex items-center justify-between">
          {/* Left Side - Title with Underline */}
          <div className="mb-3">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
              Featured Listings
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          <Link
            to="/listing"
            className="text-[#367588] font-bold flex items-center no-underline"
          >
            See all Listings <span className="ml-1">→</span>
          </Link>
        </div>
        <Slider {...settings}>
          {/* Card 1 */}
          {properties.map((property) => (
            <div key={property.id} className="p-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Image wrapper with overflow-hidden */}
                <div className="overflow-hidden relative rounded-t-lg">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                    {property.rentsell}
                  </p>
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
                  {/* <h3 className="text-lg font-semibold text-[#3C4142]">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">
                        {property.area} | {property.status}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {property.price}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/details`)}
                      className="mt-3 bg-[#367588] text-white text-sm px-4 py-2 rounded-md hover:bg-[#1386a8] transition"
                    >
                      View Details
                    </button> */}
                </div>
              </div>
            </div>
          ))}
        </Slider>

      </div>
      {/* ------------------------------------------------ */}
    </div>
  );
};

export default ListingWf;
