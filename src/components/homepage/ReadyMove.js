import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaRupeeSign, FaBath, FaHome, } from "react-icons/fa";
import { FaBuildingCircleExclamation, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';



const ReadyToMove = () => {

  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --------------- API INTEGRATION START -------> 
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/getreadytomoveproperty`, {
      withCredentials: true, // replaces fetch's `credentials: 'include'`
    })
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  // --------------- API INTEGRATION END -------> 


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

  // Format date string to "DD MMM YYYY"
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // ------- Search Filter ------>
  const filteredProperties = properties.filter((property) =>
    property.project_name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <>
      <div className="bg-[#F4EFE5]">
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-20">
          {/* Left - Property Listings */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <h2 className="mb-2 text-2xl font-bold  font-geometric-regular text-[#3C4142] ">
                Ready to Move-In Projects
              </h2>
              <div className="w-12 h-1 bg-yellow-500"></div>
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full p-3 border outline-[#F5F5DC] border-gray-300 rounded-lg mb-6 font-sans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-6 h-[800px] overflow-y-auto p-2">
              {loading ? (
                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
              ) : (
                [...filteredProperties]
                  .sort((a, b) => (b.is_featured === true) - (a.is_featured === true)) // Featured first
                  .map((property, index) => (
                      <div
                        key={index}
                        className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]"
                      >
                        <Link to={`/imgsec`} className="md:w-[40%] relative list-imgbox">
                          <img
                            src={property.primary_image}
                            alt={property.project_name}
                            className="w-[100%] h-[100%] rounded-tl-md md:rounded-bl-md object-cover"
                          />
                          {property.is_featured === true && (
                            <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 py-[5px] px-[10px] rounded-[5px]">
                              Featured
                            </p>
                          )}
                        </Link>
                        <div className="flex-1 p-4 md:w-[60%]">
                          <h3 className="text-sm text-gray-500 semibold mb-0">
                            {property.title}
                          </h3>
                          <h3 className="text-lg text-[#3C4142] bold mb-3">
                            {property.project_name}
                          </h3>
                          <div className="flex gap-2 items-center mb-2">
                            <FaMapMarkerAlt className="text-[17px] text-[#367588]" />
                            <p className="text-gray-600 mb-0">{property.locality}, {property.city}</p>
                          </div>
                          <div className="flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 mb-2">
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                              <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.price)}</p>
                              </div>

                            </div>
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                              <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.built_up_area} sq.ft.</p>
                              </div>

                            </div>
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                              <RiMoneyRupeeCircleLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Per sq.ft.</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.price_per_sqft}</p>
                              </div>
                            </div>
                            {/* </div>
                                                                                           <div className="flex justify-between items-center bg-[#F4EFE5] p-2 mb-2"> */}
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                              <FaHome className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Carpet Area</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.carpet_area} sq.ft.</p>
                              </div>

                            </div>
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                              <FaBath className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bathroom</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.bathrooms}</p>
                              </div>

                            </div>
                            <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                              <GiSofa className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                              <div>
                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Furnishing</p>
                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.furnished_status}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 items-center mb-2">

                            <div className="flex gap-2 items-center">
                              <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                              <p className="text-gray-600 mb-0">Posessioned By : {formatDate(property.available_from)}</p>
                            </div>
                          </div>
                          <div className="flex bg-[#f4efe5] py-[2px] px-[13px]">
                            <small className="text-[12px] font-bold">Property Listed By : </small>
                            <p className="text-gray-600 mb-0 mt-[-4px]">{property.developer_name}</p>
                          </div>
                          <div className="flex float-right mt-2">
                            <button
                              className=" px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                              onClick={() => handleDetailsClick(property.id)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>
          {/* Right - Ads & Promotions */}
          <div className="hidden lg:block space-y-4">
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <img
                src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                alt="Ad"
                className="w-full rounded-lg"
              />
              <p className="text-sm mt-2 font-sans">₹90.0 L - 2.13 Cr</p>
              <p className="text-sm text-gray-600 font-sans mb-0">JBMR Green Vista, Alwar</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <img
                src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                alt="Loan Ad"
                className="w-full rounded-lg"
              />
              <p className="text-sm mt-2 font-bold font-sans">
                Get Zero Brokerage Properties with Premium
              </p>
              <button className="bg-[#008080] text-white px-4 py-2 rounded mt-2 w-full font-sans">
                View Now
              </button>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <p className="text-sm font-bold font-sans">
                Are you a property owner looking to rent/sell?
              </p>
              <button className="bg-purple-500 text-white px-4 py-2 rounded mt-2 w-full font-sans">
                Post your property for FREE
              </button>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default ReadyToMove;
