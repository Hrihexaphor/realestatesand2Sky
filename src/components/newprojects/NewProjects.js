import React, { useState, useRef, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaBath, FaHome, FaFilter, FaTimes } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import { LuBedSingle } from "react-icons/lu";
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


const AdComponent = () => (
  <div className="w-full bg-yellow-100 text-center p-4 my-4 rounded">
    📢 This is an Ad Banner
  </div>
);

const NewProjects = () => {

  const navigate = useNavigate();

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
  // --------------- API INTEGRATION --------->
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch('https://realestatesand2sky.onrender.com/api/getnewproperty', {
  //     credentials: 'include' // important if using sessions or cookies
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error('Failed to fetch data');
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setProperties(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching data:', err);
  //       setLoading(false);
  //     });
  // }, []);

    useEffect(() => {
          axios.get(`${process.env.REACT_APP_BASE_URL}/getnewproperty`, {
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

  // const newProject = [
  //   {
  //     id: 1,
  //     carpetArea: "900 sqft",
  //     furnishing: "Unfurnished",
  //     bathroom: "2",
  //     bhk: "2",
  //     totalPrice: "1 Cr",
  //     projectName: "Flat for Sale in Mysore Road, Bangalore",
  //     location: "Yelahanka, Bangalore",
  //     posession: "Construction",
  //     image:
  //       "https://media.istockphoto.com/id/1170947768/photo/houses-in-the-sunlight.jpg?s=1024x1024&w=is&k=20&c=zE5WsT7NYvpDxAn7v7rB0D0TFRH6IR2whDtqjqI8fQE=",
  //   },
  //   {
  //     id: 2,
  //     carpetArea: "1200 sqft",
  //     furnishing: "Semi-Furnished",
  //     bathroom: "2",
  //     bhk: "3",
  //     totalPrice: "85 Lac",
  //     projectName: "Flat for Sale in Nayapalli, Bhubaneswar",
  //     location: "Nayapalli, Bhubaneswar",
  //     posession: "Ready to Move",
  //     image:
  //       "https://media.istockphoto.com/id/1170947768/photo/houses-in-the-sunlight.jpg?s=1024x1024&w=is&k=20&c=zE5WsT7NYvpDxAn7v7rB0D0TFRH6IR2whDtqjqI8fQE=",
  //   },
  // ];

  // ======================== main filter ===================>
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    // purpose: "",  
    bhk: "",
    minBudget: "",
    maxBudget: "",
    locality: "",
    propertyType: "",
    houseType: "",
    possession: ""
  });
  const [page, setPage] = useState(1);
  const listRef = useRef();
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);
  const [searchQuery, setSearchQuery] = useState("");
  const propertiesPerPage = 5;

  const parseCr = (value) => {
    if (!value) return null;
    return parseFloat(value.replace(/[^\d.]/g, '')) * 10000000;
  };

  const parseBudget = (val) => {
    if (!val) return null;
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return val.includes('CR') ? num * 10000000 : num;
  };

  const minBudget = parseBudget(filter.minBudget);
  const maxBudget = parseBudget(filter.maxBudget);

  const filteredProperties = properties.filter((p) => {
    const propertyPrice = parseBudget(p.expected_price);

    const matchesBudget =
      (!minBudget && !maxBudget) || // no filter set
      (propertyPrice != null &&
        (!minBudget || propertyPrice >= minBudget) &&
        (!maxBudget || propertyPrice <= maxBudget));

    // Other filters (same as before)
    const matchesSearch = !searchQuery || p.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurpose = !filter.purpose || p.purpose?.toLowerCase() === filter.purpose.toLowerCase();
    const matchesBHK = !filter.bhk || String(p.bedrooms) === filter.bhk;
    const matchesPropertyType = !filter.propertyType || p.property_type?.toLowerCase() === filter.propertyType.toLowerCase();
    const matchesHouseType = !filter.houseType || p.apartment_type?.toLowerCase() === filter.houseType.toLowerCase();
    const matchesPossession = !filter.possession || p.possession_status?.toLowerCase() === filter.possession.toLowerCase();
    const matchesLocality = !filter.locality || (p.locality?.toLowerCase() || '').includes(filter.locality.toLowerCase());

    return (
      matchesSearch &&
      matchesPurpose &&
      matchesBHK &&
      matchesPropertyType &&
      matchesHouseType &&
      matchesPossession &&
      matchesLocality &&
      matchesBudget
    );
  });

  const uniqueCities = Array.from(
    new Set(
      properties.map((p) =>
        p.city.trim().replace(/:$/, '') // remove trailing ":" and trim spaces
      )
    )
  );

  const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
  }

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5] pb-5 pt-10 md:pt-8 lg:pt-16" ref={listRef}>
        <div className="container">
          <div className="mt-5">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
              New Projects
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* ------------ Left box ------------> */}
            <div className="lg:col-span-2">
              <h4 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                All {properties.length} new project in {uniqueCities.join(', ')}.
              </h4>
              <div className="flex gap-2 items-center mt-4 mb-4">
                <div className="flex items-center bg-[#fff] w-full py-[5px] px-[10px] rounded-[20px]">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search Project"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="search outline-none w-full bg-transparent"
                  />
                </div>
                <button className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full flex items-center h-[34px]"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <FaFilter className="me-2" /> Filter
                </button>
              </div>
              {/* ----------- Filter Model ----------> */}
              {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  z-50">
                  <div className="bg-white filter-modal w-full mx-3 lg:w-[600px] top-[18%] max-w-4xl rounded shadow-lg p-6 relative">
                    <button
                      className="absolute top-3 right-3 text-gray-500"
                      onClick={() => setIsFilterModalOpen(false)}
                    >
                      <FaTimes size={20} />
                    </button>
                    <h4 className="text-lg font-bold text-center mb-2">Filters</h4>
                    <div className="inner-filter bordered border-2 py-2 px-3">
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Buy/Rent:</label>
                          <div className="flex items-center">
                            <select
                              name="buyrent"
                              value={filter.purpose}
                              onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Buy/Rent</option>
                              <option value="Buy">Buy</option>
                              <option value="Rent">Rent</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">BHK:</label>
                          <div className="flex items-center">
                            <select
                              name="bhk"
                              value={filter.bhk}
                              onChange={(e) => setFilter({ ...filter, bhk: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select BHK</option>
                              {[...new Set(properties.map(p => p.bedrooms))]
                                .filter(Boolean)
                                .sort((a, b) => a - b)
                                .map((val, index) => (
                                  <option key={index} value={val}>{val} BHK</option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label className="text-base font-semibold">Budget:</label>
                        <div className="flex gap-2 items-center">
                          <select
                            name="minBudget"
                            value={filter.minBudget}
                            onChange={(e) => setFilter({ ...filter, minBudget: e.target.value })}
                            className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Min</option>
                            <option value="1 CR">₹1 CR</option>
                            <option value="2 CR">₹2 CR</option>
                            <option value="3 CR">₹3 CR</option>
                          </select>
                          <div className="font-semibold text-gray-800">To</div>
                          <select
                            name="maxBudget"
                            value={filter.maxBudget}
                            onChange={(e) => setFilter({ ...filter, maxBudget: e.target.value })}
                            className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Max</option>
                            <option value="2 CR">₹2 CR</option>
                            <option value="3 CR">₹3 CR</option>
                            <option value="4 CR">₹4 CR</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Localities:</label>
                          <div className="flex items-center">
                            <select
                              name="locality"
                              value={filter.locality}
                              onChange={(e) => setFilter({ ...filter, locality: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Locality</option>
                              {[...new Set(properties.map(p => p.locality))]
                                .filter(Boolean)
                                .sort((a, b) => a.localeCompare(b))
                                .map((val, index) => (
                                  <option key={index} value={val}>{val}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Properties:</label>
                          <div className="flex items-center">
                            <select
                              name="propertyType"
                              value={filter.propertyType}
                              onChange={(e) => setFilter({ ...filter, propertyType: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Property</option>
                              <option value="Flat">Flat</option>
                              <option value="House">House</option>
                              <option value="OfficeSpace">Office Space</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">House Type:</label>
                          <div className="flex items-center">
                            <select
                              name="houseType"
                              value={filter.houseType}
                              onChange={(e) => setFilter({ ...filter, houseType: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Type</option>
                              <option value="Duplex">Duplex</option>
                              <option value="PentHouse">Pent House</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Posession Status:</label>
                          <div className="flex items-center">
                            <select
                              name="possession"
                              value={filter.possession}
                              onChange={(e) => setFilter({ ...filter, possession: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Status</option>
                              <option value="Construction">Construction</option>
                              <option value="R2M">Ready to Move</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8] mt-3 float-right"
                      onClick={() => {
                        setPage(1); // Reset to first page
                        setIsFilterModalOpen(false);
                      }}
                    >Done</button>
                  </div>
                </div>
              )}

              {/* ======== Project Card ==========> */}
              {loading ? (
                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
              ) : (
                [...filteredProperties]
                  .sort((a, b) => (b.is_featured === true) - (a.is_featured === true)) // Featured first
                  .map((property, index) => (
                    <>
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
                      {index === 1 && <AdComponent />}
                    </>
                  ))
              )}
            </div>

            {/* ------- right box ------- */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md p-4 sticky top-20">
              <div>
                <h2 className="text-lg font-roboto-bold ">If want to list your property   <Link to={`/postreq`}> contact us</Link></h2>

              </div>
              {/* Advertise Section */}
              <div className="hidden md:block bg-white rounded-lg shadow-md p-4  ">
                <div className="bg-yellow-100 text-center p-4 rounded-lg">
                  <img
                    src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                    alt="Advertise"
                    className="mx-auto mb-3"
                  />
                  <h3 className="text-xl font-semibold">Advertise With Us</h3>
                  <p className="text-gray-600">
                    Reach millions of potential customers
                  </p>
                </div>
                <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md w-full hover:bg-yellow-600">
                  Post Property
                </button>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold">
                    Why Advertise With Us?
                  </h4>
                  <ul className="list-disc pl-4 text-gray-600">
                    <li>Millions of Active Users</li>
                    <li>Targeted Audience</li>
                    <li>High Conversion Rates</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 mt-5">
                <img
                  src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                  alt="3 BHK Flat"
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold mt-3">3 BHK Flat</h3>
                <p className="text-gray-600">Electronic City, Bangalore</p>
                <p className="mt-2 text-gray-700">Ready to Move</p>
                <p className="text-lg font-semibold text-black mt-1">₹2.1 Cr</p>
                <p className="text-gray-500 mt-1">Owner Arun</p>
              </div>{" "}
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default NewProjects;
