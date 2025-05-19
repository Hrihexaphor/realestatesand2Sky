import { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaTimes, FaSearch, FaMapMarkerAlt, FaRupeeSign, FaHome, FaBath, FaUserTie } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import { FaFilter } from "react-icons/fa";
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const AdComponent = () => (
    <div className="w-full bg-yellow-100 text-center p-4 my-4 rounded">
        📢 This is an Ad Banner
    </div>
);

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

const ListingSection = () => {
    // --------------- API INTEGRATION --------->
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch('https://realestatesand2sky.onrender.com/api/getminimumproperty', {
    //         credentials: 'include' // important if using sessions or cookies
    //     })
    //         .then((res) => {
    //             if (!res.ok) throw new Error('Failed to fetch data');
    //             return res.json();
    //         })
    //         .then((data) => {
    //             setProperties(data);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             console.error('Error fetching data:', err);
    //             setLoading(false);
    //         });
    // }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
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

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [siteVisit, setSiteVisit] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState({
        reason: '',
        dealer: '',
        name: '',
        email: '',
        phone: '',
        planToBuy: '',
        homeLoan: false,
        siteVisit: false,
        terms: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePhone = (phone) =>
        /^\d{10}$/.test(phone);

    const handleValidation = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.reason) newErrors.reason = true;
        if (!formData.dealer) newErrors.dealer = true;
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Contact is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Contact should be 10 digits';
        }

        if (!formData.planToBuy) newErrors.planToBuy = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // alert(JSON.stringify(formData, null, 2));
            setShowToast(true);
            setIsModalOpen(false); // <-- close the form/modal
            setTimeout(() => setShowToast(false), 5000);
        }
    };



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

    const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
    }
    // const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    // const totalItems = properties.length;
    // const startIndex = (page - 1) * propertiesPerPage + 1;
    // const endIndex = Math.min(page * propertiesPerPage, totalItems);

    // const paginatedProperties = filteredProperties.slice(
    //     (page - 1) * propertiesPerPage,
    //     page * propertiesPerPage
    // );

    return (

        <div>
            <NewNav />
            <div className="bg-[#F4EFE5] pt-[10%]" ref={listRef}>
                <div className="container">
                    {/* --------- Filter Bar -----------> */}
                    <div className="bg-[#367588] main-banner text-white px-4 py-3 shadow-md w-[100%] left-0 fixed md:top-[57px] lg:top-[70px] z-[1] ">
                        <div className="btn-badge flex gap-2 items-center ms-[40px]">
                            <div className="relative bg-white text-gray-700 px-3 py-1 rounded-full flex items-center h-[40px] w-[100%] md:w-[50%]">
                                <div className="flex items-center w-full">
                                    <FaSearch className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setPage(1);
                                        }}
                                        className="search outline-none w-full bg-transparent"
                                    />
                                </div>
                            </div>
                            <button className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full flex items-center h-[40px]"
                                onClick={() => setIsFilterModalOpen(true)}
                            >
                                <FaFilter className="me-2" /> Filter
                            </button>
                        </div>
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
                    {/* --------- Filter Bar ----------> */}
                    <div className="pl-heading">
                        <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                            Property Listing
                        </h2>
                        <div className="w-12 h-1 bg-yellow-500"></div>
                    </div>
                </div>
            </div>
            <div className="bg-[#F4EFE5] pt-[10%] min-h-screen p-4">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    {/* ------------ left box ---------- */}
                    <div className="lg:col-span-2">
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
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.expected_price)}</p>
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
                                                <div className="flex justify-between items-center mt-2">
                                                    <button
                                                        className=" px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                                        onClick={() => handleDetailsClick(property.id)}
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        className=" px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                                        onClick={() => setIsModalOpen(true)}
                                                    >
                                                        Get Info
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {index === 1 && <AdComponent />}
                                    </>
                                ))
                        )}

                        {/* ---------- Pagination ------------> */}
                        {/* <div className="bg-white p-3 rounded-lg gap-2 flex flex-col md:flex-row items-center  justify-between">
                            <div>
                                <p className="text-sm text-gray-700 mb-0">
                                    Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                                    <span className="font-medium">{totalItems}</span> results
                                </p>
                            </div>
                            <nav className="flex justify-center mt-0 gap-1">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronLeftIcon className="size-5" />
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ${page === i + 1
                                            ? "bg-[#367588] text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronRightIcon className="size-5" />
                                </button>
                            </nav>
                        </div> */}
                        {/* ---------- Pagination -------------> */}

                        {showToast && (
                            <div className="fixed top-24 items-center md:right-20 lg:right-52 bg-white shadow-lg rounded-lg p-4 w-[350px] md:w-[600px] z-50 border transition-all duration-300 animate-fade-in-up">
                                <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
                                    {/* Left Info */}
                                    <div>
                                        <p className="text-gray-600 font-semibold">
                                            POSTED BY OWNER:
                                        </p>
                                        <p className="text-gray-800">
                                            +91 98***543** | ******@******.com
                                        </p>
                                        <p className="text-gray-700 font-medium mt-1">AASHAY</p>
                                        <p className="text-blue-600 font-bold mt-1">DELL</p>
                                    </div>

                                    {/* Right Info */}
                                    <div className="text-left md:text-right">
                                        <p className="text-gray-600 font-semibold">
                                            POSTED ON 01ST APR, 2025:
                                        </p>
                                        <p className="text-black font-semibold">
                                            ₹ 21 Lac | AMSB Bhu Devi Apartments
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            280 SQ.FT. | 2 BHK RESIDENTIAL APARTMENT
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white w-full mx-2 md:mx-5 max-w-4xl rounded shadow-lg p-6 relative modal-mobile">
                                <button
                                    className="absolute top-3 right-3 text-gray-500"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <FaTimes size={20} />
                                </button>
                                <h3 className="text-lg text-[#3C4142] font-bold text-center mb-4">
                                    Please fill in your details to be shared with this advertiser
                                    only.
                                </h3>
                                <form onSubmit={handleValidation}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* BASIC INFORMATION */}
                                        <div>
                                            <h4 className="text-base bg-[#FFD700] text-white text-center py-2 font-semibold mb-4">
                                                BASIC INFORMATION
                                            </h4>

                                            {/* Reason to buy */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Your reason to buy is
                                                </label>
                                                <select
                                                    name="reason"
                                                    value={formData.reason}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border ${errors.reason ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                >
                                                    <option value="">Select an option</option>
                                                    <option value="Investment">Investment</option>
                                                    <option value="SelfUse">Self Use</option>
                                                </select>
                                            </div>

                                            {/* Property dealer */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Are You a Property Dealer
                                                </label>
                                                <select
                                                    name="dealer"
                                                    value={formData.dealer}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border ${errors.dealer ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                >
                                                    <option value="">Select an option</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>

                                            {/* Name */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    placeholder="Enter your Email"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    maxLength={10}
                                                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    placeholder="Enter your Contact"
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* OPTIONAL INFORMATION */}
                                        <div>
                                            <h4 className="text-base bg-[#FFD700] text-white text-center py-2 font-semibold mb-4">
                                                OPTIONAL INFORMATION
                                            </h4>

                                            {/* Plan to buy */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    By when are you planning to buy the property?
                                                </label>
                                                <select
                                                    name="planToBuy"
                                                    value={formData.planToBuy}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border ${errors.planToBuy ? 'border-red-500 bg-red-100' : 'border-gray-300'
                                                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                >
                                                    <option value="">Select an option</option>
                                                    <option value="3 months">3 months</option>
                                                    <option value="6 months">6 months</option>
                                                    <option value="More than 6 months">More than 6 months</option>
                                                </select>
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="flex flex-col gap-3 text-sm text-gray-800 mt-4">
                                                {/* Home Loan */}
                                                <label className="flex items-start gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.homeLoan}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, homeLoan: e.target.checked }))
                                                        }
                                                        className="mt-1 accent-blue-600 cursor-pointer"
                                                    />
                                                    <span>I am interested in home loan</span>
                                                </label>

                                                {/* Site Visit */}
                                                <label className="flex items-start gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.siteVisit}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, siteVisit: e.target.checked }))
                                                        }
                                                        className="mt-1 accent-blue-600 cursor-pointer"
                                                    />
                                                    <span className="text-blue-700 font-medium">I am interested in site visits.</span>
                                                </label>

                                                {/* Terms & Conditions */}
                                                <label className="flex items-start gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.termsAgreed}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, termsAgreed: e.target.checked }))
                                                        }
                                                        className="mt-1 accent-blue-600 cursor-pointer"
                                                    />
                                                    <span>
                                                        I agree to the{" "}
                                                        <span className="text-blue-600 underline">Terms & Conditions</span> and{" "}
                                                        <span className="text-blue-600 underline">Privacy Policy</span>.
                                                    </span>
                                                </label>
                                            </div>

                                            <button
                                                className="w-full bg-[#367588] hover:bg-[#1386a8] text-white text-sm font-semibold py-2 mt-6 rounded"
                                                type="submit"
                                            >
                                                View Advertiser Details
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListingSection;
