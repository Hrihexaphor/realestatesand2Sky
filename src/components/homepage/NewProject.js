import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingUser } from "react-icons/fa6";
import { BsCurrencyRupee } from "react-icons/bs";
import { LuBedSingle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

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

// const properties = [
//   {
//     name: "DN Housing",
//     location: "Rasulgarh",
//     image:
//       "https://cdn.pixabay.com/photo/2019/02/23/22/15/architecture-4016642_640.jpg",
//     type: "3 BHK",
//     price: "85 Lac",
//     carpetarea: "900 sqft",
//     builder: "DN Groups",
//     featured: true,
//   },
//   {
//     name: "DTL Housing",
//     location: "Khandagiri",
//     image:
//       "https://cdn.pixabay.com/photo/2014/08/06/20/14/mansion-411969_640.jpg",
//     type: "2 BHK",
//     price: "55 Lac",
//     carpetarea: "1000 sqft",
//     builder: "DN Groups",
//     featured: false,
//   },
//   {
//     name: "Trident Galaxy",
//     location: "Patia",
//     image:
//       "https://cdn.pixabay.com/photo/2018/11/29/17/43/block-3846173_640.jpg",
//     type: "4 BHK",
//     price: "80 Lac",
//     carpetarea: "900 sqft",
//     builder: "DN Groups",
//     featured: true,
//   },
//   {
//     name: "TATA Arena",
//     location: "Bhimtangi",
//     image:
//       "https://cdn.pixabay.com/photo/2018/11/29/17/43/block-3846173_640.jpg",
//     type: "2 BHK",
//     price: "30 Lac",
//     carpetarea: "800 sqft",
//     builder: "DN Groups",
//     featured: false,
//   },
// ];

const NewProject = () => {

  const navigate = useNavigate();

   const [newproperty, setNewproperty] = useState([]);
      useEffect(() => {
              axios.get(`${process.env.REACT_APP_BASE_URL}/getnewproperty`, {
                  withCredentials: true, // replaces fetch's `credentials: 'include'`
              })
                  .then((res) => {
                      setNewproperty(res.data);
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
    <div className="bg-[#F4EFE5]">
      <div className="mb-3 container pt-5">
        <h2 className="mb-2 text-2xl font-bold font-geometric-regular text-[#3C4142] ">
          New Projects
        </h2>
        <div className="w-12 h-1 bg-yellow-500"></div>
      </div>
      <div className="flex justify-center items-center  px-4 pt-4">
        <div className="container mx-auto">
          <Slider {...settings}>
            {newproperty.map((property, index) => (
              <div key={index} className="p-2">
                <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                  <div className="h-[200px] w-[100%] img-box relative">
                    <img src={property.primary_image} className="h-[100%] w-[100%]" />

                    {property.is_featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-base text-[#3C4142]">{property.project_name}</h3>
                    <div className="card-body flex flex-wrap justify-between items-center">
                      <div className="flex gap-2 items-center w-[50%]  mb-2">
                        <LuBedSingle className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                          {/* <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.type}</p> */}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <BsCurrencyRupee className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.price)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.built_up_area} sq.ft.</p>
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
                        <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.locality}, {property.city}</p>
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                      onClick={() => handleDetailsClick(property.id)}
                    >
                      View Details
                    </button>
                  </div>

                  {/* <div className="p-3">

                  <span className="text-gray-800 font-base">{property.type}</span>
                  <div className="flex gap-2 my-1">
                    <span className="text-sm lg:text-lg font-bold">₹ {property.price}</span>
                    <span className="mx-2 text-gray-400 font-bold md:block hidden lg:block">|</span>
                    <span className="text-sm lg:text-lg font-bold">{property.persqft}</span>
                  </div>
                  <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-base">{property.location}</p>
                      <button className="bg-[#367588] hover:bg-[#1386a8] text-base text-white border-none rounded-[20px] px-3 py-1">View Details</button>
                  </div>
                </div> */}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
