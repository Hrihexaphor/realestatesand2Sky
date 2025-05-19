import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FaSearch, FaMapMarkerAlt, FaHome, FaRupeeSign, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';
import NewNav from "./NewNav";

const SearchDropdown = ({  activeTab, searchData, selectedTags, setSelectedTags, setFilteredData }) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const grouped = searchData.reduce((acc, item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = new Set();
      acc[key].add(value);
    });
    return acc;
  }, {});

  const availableGroups = Object.keys(grouped).filter(
    (group) => !selectedTags.find((tag) => tag.group === group)
  );

  const filteredGroups = availableGroups.map((group) => {
    const filtered = Array.from(grouped[group]).filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    return { group, items: filtered };
  });

  const handleSelect = (group, item) => {
    const newTags = [...selectedTags, { group, item }];
    setSelectedTags(newTags);
    setInputValue("");
    setIsDropdownOpen(false);

    const filtered = searchData.filter((entry) =>
      newTags.every((tag) => entry[tag.group] === tag.item)
    );
    setFilteredData(filtered);
  };

  const handleRemove = (tagToRemove) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);

    const filtered = searchData.filter((entry) =>
      newTags.every((tag) => entry[tag.group] === tag.item)
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#FFD700]" />
          <input
            className="py-2 px-2 outline-0 rounded-full w-full"
            onFocus={() => setIsDropdownOpen(true)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by Location, Project, Builder..."
          />
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>
        <div className="flex items-center gap-2 mt-[13px] md:mt-[0]">
          <FaHome className="text-[#FFD700] text-[1.4rem]" />
          <select className="w-full py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-[130px]">
            <option value="">Select Property</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="duplex">Duplex</option>
          </select>
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRupeeSign className="text-[#FFD700] text-[1.4rem]" />
          <select className="w-full py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-[90px]">
            <option value="">Min Price</option>
            <option value="1CR">1 CR</option>
            <option value="2CR">2 CR</option>
            <option value="3CR">3 CR</option>
          </select>
          <select className="w-full py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-[90px]">
            <option value="">Max Price</option>
            <option value="2CR">2 CR</option>
            <option value="3CR">3 CR</option>
            <option value="4CR">4 CR</option>
          </select>
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>
        <div className="search-box mt-[-8px] md:mt-[0]">
          <button
            className="ml-auto bg-[#FFD700] hover:bg-yellow-500 text-white px-3 lg:px-6 py-2 rounded-full flex items-center space-x-2 w-full"
            onClick={() => alert(`${activeTab} tab submitted`)}
          >
            <FaSearch className="me-2" />
            <span className="">Search</span>
          </button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex gap-2 mt-2 absolute md:relative mt-[20px] md:mt-[0]">
          <span className="bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center">
            {selectedTags[0].item}
            <FaTimes
              className="ml-2 cursor-pointer"
              onClick={() => handleRemove(selectedTags[0])}
            />
          </span>
          {selectedTags.length > 1 && (
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full flex items-center">
              +{selectedTags.length - 1} more
            </span>
          )}
        </div>
      )}

      {isDropdownOpen && inputValue && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg p-4 max-h-60 overflow-y-auto">
          {filteredGroups.map(({ group, items }) => (
            items.length > 0 && (
              <div key={group} className="mb-2">
                <div className="font-semibold text-gray-600 mb-1">{group}</div>
                {items.map((item) => (
                  <div
                    key={item}
                    className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded"
                    onClick={() => handleSelect(group, item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [selectedTagsByTab, setSelectedTagsByTab] = useState({ Buy: [], "New Projects": [], Projects: [] });
  const [filteredDataByTab, setFilteredDataByTab] = useState({ Buy: [], "New Projects": [], Projects: [] });

  const tabs = ["Buy", "New Projects", "Projects"];
  const searchData = [
    {
      location: "Bhubaneswar",
      locality: "Patia",
      project: "Dream Residency",
      keyword: "3 BHK",
      builder: "ABC Constructions",
    },
    {
      location: "Bhubaneswar",
      locality: "Saheed Nagar",
      project: "Dream Residency 25",
      keyword: "4 BHK",
      builder: "ABCD Constructions",
    },
    {
      location: "Cuttack",
      locality: "Bidanasi",
      project: "Green Homes",
      keyword: "Duplex",
      builder: "XYZ Constructions",
    },
    {
      location: "Puri",
      locality: "Gopalpur",
      project: "Sunshine Enclave",
      keyword: "Sea View",
      builder: "MegaBuild Pvt Ltd",
    },
  ];

  const handleTagUpdate = (tags) => {
    setSelectedTagsByTab({ ...selectedTagsByTab, [activeTab]: tags });
  };

  const handleFilterUpdate = (filteredData) => {
    setFilteredDataByTab({ ...filteredDataByTab, [activeTab]: filteredData });
  };

  // ============= add after 5 second ===========>

  const [formData, setFormData] = useState({ costomerData: "" });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsModalOpen(true);
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce max length of 10 if it starts with digit
    if (/^\d/.test(value) && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
    setErrors("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const input = formData.costomerData.trim();
    const newErrors = {};

    if (input === "") {
      newErrors.costomerData = "Please fill this field.";
    } else if (/^\d/.test(input)) {
      // Starts with a digit - Phone number
      if (input.startsWith("0")) {
        newErrors.costomerData = "Phone number should not start with 0.";
      } else if (input.length < 10) {
        newErrors.costomerData = "Phone number must be 10 digits.";
      }
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        newErrors.costomerData = "Please enter a valid email address.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success('Saved successfully!');
      setIsModalOpen(false); // close modal if `onClose` prop is passed
    }

  };

  // ============= add after 5 second End ===========>

     const slides = [
    "http://hompark.themezinho.net/wp-content/uploads/2020/03/slide03.jpg",
    "http://hompark.themezinho.net/wp-content/uploads/2020/03/slide01.jpg",
    "http://hompark.themezinho.net/wp-content/uploads/2020/03/slide02.jpg",
  ];

  const properties = [
    {
      id: 1,
      title: " Properties",
      count: "3308",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/owner-property.webp",
    },
    {
      id: 2,
      title: "Projects",
      count: "162",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/new-projects.webp",
    },
    {
      id: 3,
      title: "Ready to move-in",
      count: "2533",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/ready-to-move-in.webp",
    },
    {
      id: 4,
      title: "New Projects",
      count: "221",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/budget-homes.webp",
    },
    {
      id: 5,
      title: "New Projects",
      count: "221",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/budget-homes.webp",
    },
  ];

  return (
    <>
      <div className="relative w-full h-screen">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          className="w-full h-screen"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${slide})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#282521] bg-opacity-50"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-6 z-10">
        <h1 className="text-white mb-5 font-bold text-3xl md:text-5xl lg:text-5xl text-center font-roboto-bold">
          Luxury Living, Elevated
        </h1>

        <nav className="flex space-x-4 pb-3">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`font-bold cursor-pointer text-white ${activeTab === tab ? "border-b-2 border-[#FFD700]" : "hover:border-b-2 hover:border-[#FFD700]"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </nav>

        <div className="mt-2 search-box bg-white rounded-full shadow-sm px-4 py-2 mx-2 w-full lg:w-[802px]">
          <SearchDropdown
            activeTab={activeTab}
            searchData={searchData}
            selectedTags={selectedTagsByTab[activeTab]}
            setSelectedTags={handleTagUpdate}
            setFilteredData={handleFilterUpdate}
          />
        </div>
      </div>
      {/* Property Cards Inside Carousel */}
        {/* Container for the section */}
        <div className="z-[1] container mx-auto  absolute top-[70%] mt-16 left-1/2 transform -translate-x-1/2 w-full">
          <h2 className="font-bold text-white text-3xl font-geometric-regular">
            We've got properties for everyone
          </h2>
          <div className="w-16 border-b-4 border-yellow-500 my-2 "></div>

          <Swiper
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2000 }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <div className="sm:me-5 mt-4 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative hover:scale-105 transition transform duration-300">
                  <div
                    className="h-48 bg-cover bg-center relative rounded-xl"
                    style={{ backgroundImage: `url(${property.image})` }}
                  >
                    <div className="absolute inset-0 bg-black opacity-30 rounded-xl"></div>
                  </div>
                  <div className="absolute bottom-0 p-4 text-white">
                    <h4 className="font-bold text-[40px] font-geometric-regular">{property.count}</h4>
                    <p className="text-sm sm:text-lg font-geometric-regular">{property.title}</p>
                    <a
                      href="#"
                      className="text-yellow-400 font-bold flex items-center mt-1 font-geometric-regular no-underline"
                    >
                      Explore →
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>


        </div>

      {/* Navbar */}
      <NewNav />

      {/* =========== Add Modal Start =========== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="add-card bg-white w-full max-w-sm rounded shadow-lg p-6 relative">
            <button
              className="cancel absolute top-3 right-3 text-white-500"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl text-white-700 font-bold font-sans text-center  mt-2 mb-4">
              Please fill in your details to be shared with this advertiser
              only.
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Costomer data Field */}
              <div className="mb-4">
                <label
                  className="block text-base font-medium text-white-900"
                >
                  Email / Phone
                </label>
                <div className="mt-2">
                  <input
                    id="costomerData"
                    name="costomerData"
                    type="text"
                    value={formData.costomerData}
                    onChange={handleChange}
                    placeholder="Enter Email / Phone"
                    className={`h-[45px] block w-full py-1.5 px-3 text-base rounded-lg border ${errors.email ? "border-red-500" : "border-white-800"
                      } text-white-900 placeholder:text-white-400 focus:outline-none`}
                  />
                  {errors.costomerData && (
                    <small className="text-red-500">{errors.costomerData}</small>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 submit py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
      {/* =========== Add Modal Start =========== */}
    </>
  );
};

export default SearchBar;