import React, { useEffect, useState } from 'react';
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { FaHome, FaMapMarkerAlt, FaRupeeSign, FaBath, FaFilter, FaTimes } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { GiSofa } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { LuBedSingle } from "react-icons/lu";
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

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

function BlogCard() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://realestatesand2sky.onrender.com/api/getminimumproperty', {
            credentials: 'include' // important if using sessions or cookies
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch data');
                return res.json();
            })
            .then((data) => {
                setProperties(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
                setLoading(false);
            });
    }, []);


    if (loading) return <p>Loading properties...</p>;

    return (
        <>
            <NewNav />
            <section className="bg-[#F4EFE5] pb-5 pt-10 md:pt-8 lg:pt-16">
                <div className="container">
                    <div className="mt-5 mb-4">
                        <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                            New Projects
                        </h2>
                        <div className="w-12 h-1 bg-yellow-500"></div>
                    </div>
                    {properties.map((property, index) => (
                        <div
                            key={index}
                            className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]"
                        >
                            <Link to={`/imgsec`} className="md:w-[40%] h-[330px] relative list-imgbox">
                                <img
                                    src={property.primary_image}
                                    alt={property.project_name}
                                    className="w-[100%] h-[100%] rounded-tl-md md:rounded-bl-md object-cover"
                                />
                                <p className="text-white font-bold mt-2 absolute top-[1px] left-[3%] bg-[red] text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                                    Hot Deal
                                </p>
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
                                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.expected_price)}</p>
                                        </div>

                                    </div>
                                    <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                        <div>
                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builtup Area</p>
                                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.built_up_area}</p>
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
                                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.carpet_area}</p>
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
                                <div className="flex justify-between items-center">

                                    <div className="flex flex-col bg-[#f4efe5] py-[2px] px-[13px] rounded-[5px]">
                                        <small className="text-[12px] font-bold">Property Listed By:</small>
                                        <p className="text-gray-600 mb-0 mt-[-4px]">{property.developer_name}</p>
                                    </div>
                                    <button
                                        className=" px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                    >
                                        Get Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>

    );
}

export default BlogCard;