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
import { Autoplay } from "swiper/modules";

const BudgetRange = () => {

    const navigate = useNavigate();

    const properties = [
        {
            id: 1,
            title: "Luxury 3BHK Apartment",
            price: "₹1.2 Cr",
            type: "2 BHK",
            area: "1850 sqft",
            location: "Patia, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Luxury",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 2,
            title: "Affordable 2BHK Flat",
            price: "₹1.5 Cr",
            type: "2 BHK",
            area: "1250 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: false,
        },
        {
            id: 3,
            title: "Affordable 1BHK Flat",
            price: "₹2 Cr",
            type: "2 BHK",
            area: "1250 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: false,
        },
        {
            id: 4,
            title: "Affordable 2BHK Flat",
            price: "₹2.5 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 5,
            title: "Affordable 2BHK Flat",
            price: "₹2.8 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 6,
            title: "Affordable 2BHK Flat",
            price: "₹2.9 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 7,
            title: "Affordable 2BHK Flat",
            price: "₹3 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: false,
        },
        {
            id: 8,
            title: "Affordable 2BHK Flat",
            price: "₹3.5 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: false,
        },
        {
            id: 9,
            title: "Affordable 2BHK Flat",
            price: "₹3.9 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 10,
            title: "Affordable 2BHK Flat",
            price: "₹4 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
        {
            id: 11,
            title: "Affordable 2BHK Flat",
            price: "₹1 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: false,
        },
        {
            id: 12,
            title: "Affordable 2BHK Flat",
            price: "₹4.5 Cr",
            type: "2 BHK",
            area: "1350 sqft",
            location: "Jayadev Vihar, Bhubaneswar",
            image:
                "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
            category: "Affordable",
            builder: "RK Builders",
            featured: true,
        },
    ];

    const settings = {
        dots: false,
        infinite: true,
        Autoplay: true,
        speed: 500,
        slidesToShow: 3,
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
        <>
            <div className="container">
                {/* ---- 1 cr to 2cr ---- */}
                <div className="text-center mx-auto mt-5">
                    <h2 className="text-yellow-700 text-lg font-semibold  uppercase tracking-wide mb-10">
                        Budget Range
                    </h2>
                    <h1 className=" font-bold text-[#3C4142]  text-2xl  font-geometric-regular mt-1">
                        Properties Between ₹1 Cr – ₹2 Cr
                    </h1>
                    <p className="text-gray-500 mt-2 mb-8 max-w-xl mx-auto font-sans">
                        Browse premium apartments, villas, and independent homes that suit
                        your dream lifestyle.
                    </p>
                </div>
                <Slider {...settings}>
                    {/* Card 1 */}
                    {properties.filter((property) => {
                        const priceStr = property.price.replace(/[₹,\s]/g, '').toLowerCase(); // remove ₹, commas, spaces
                        let priceInNumber = 0;

                        if (priceStr.includes('cr')) {
                            priceInNumber = parseFloat(priceStr) * 10000000; // convert Cr to number
                        } else if (priceStr.includes('lac')) {
                            priceInNumber = parseFloat(priceStr) * 100000; // convert Lac to number
                        }

                        return priceInNumber >= 10000000 && priceInNumber <= 20000000;
                    }).map((property) => (
                        <div key={property.id} className="p-2">
                            <div className="border rounded-xl  shadow-sm hover:shadow-md transition bg-white">
                                <div className="h-[250px] w-full relative">
                                    <img className="w-[100%] h-[100%]" src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="blog dtl image" />
                                    {property.featured === true && (
                                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                                            Featured
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 text-left">
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
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

                {/* ---- 2 cr to 3 cr ---- */}
                <div className="text-center mx-auto mt-5">
                    <h1 className=" font-bold text-[#3C4142]  text-2xl  font-geometric-regular mt-1">
                        Properties Between ₹2 Cr – ₹3 Cr
                    </h1>
                    <p className="text-gray-500 mt-2 mb-8 max-w-xl mx-auto font-sans">
                        Browse premium apartments, villas, and independent homes that suit
                        your dream lifestyle.
                    </p>
                </div>
                <Slider {...settings}>
                    {/* Card 1 */}
                    {properties.filter((property) => {
                        const priceStr = property.price.replace(/[₹,\s]/g, '').toLowerCase(); // remove ₹, commas, spaces
                        let priceInNumber = 0;

                        if (priceStr.includes('cr')) {
                            priceInNumber = parseFloat(priceStr) * 10000000; // convert Cr to number
                        } else if (priceStr.includes('lac')) {
                            priceInNumber = parseFloat(priceStr) * 100000; // convert Lac to number
                        }

                        return priceInNumber > 20000000 && priceInNumber <= 30000000;
                    }).map((property) => (
                        <div key={property.id} className="p-2">
                            <div className="border rounded-xl  shadow-sm hover:shadow-md transition bg-white">
                                <div className="h-[250px] w-full relative">
                                    <img className="w-[100%] h-[100%]" src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="blog dtl image" />
                                    {property.featured === true && (
                                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                                            Featured
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 text-left">
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
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
                {/* ---- 3 cr to above ---- */}
                <div className="text-center mx-auto mt-5">
                    <h1 className=" font-bold text-[#3C4142]  text-2xl  font-geometric-regular mt-1">
                        Properties Between ₹3 Cr to above
                    </h1>
                    <p className="text-gray-500 mt-2 mb-8 max-w-xl mx-auto font-sans">
                        Browse premium apartments, villas, and independent homes that suit
                        your dream lifestyle.
                    </p>
                </div>
                <Slider {...settings}>
                    {/* Card 1 */}
                    {properties.filter((property) => {
                        const priceStr = property.price.replace(/[₹,\s]/g, '').toLowerCase(); // remove ₹, commas, spaces
                        let priceInNumber = 0;

                        if (priceStr.includes('cr')) {
                            priceInNumber = parseFloat(priceStr) * 10000000; // convert Cr to number
                        } else if (priceStr.includes('lac')) {
                            priceInNumber = parseFloat(priceStr) * 100000; // convert Lac to number
                        }

                        return priceInNumber > 30000000;
                    }).map((property) => (
                        <div key={property.id} className="p-2">
                            <div className="border rounded-xl  shadow-sm hover:shadow-md transition bg-white">
                                <div className="h-[250px] w-full relative">
                                    <img className="w-[100%] h-[100%]" src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="blog dtl image" />
                                    {property.featured === true && (
                                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                                            Featured
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 text-left">
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
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default BudgetRange;