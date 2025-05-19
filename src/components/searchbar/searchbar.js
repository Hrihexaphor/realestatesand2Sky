import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FaSearch, FaMapMarkerAlt, FaHome, FaRupeeSign, FaTimes } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';

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
      <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
        <div className="search-box">
          <button
            className="ml-auto bg-[#FFD700] hover:bg-yellow-500 text-white px-3 lg:px-6 py-2 rounded-full flex items-center space-x-2"
            onClick={() => alert(`${activeTab} tab submitted`)}
          >
            <FaSearch className="me-2" />
            <span className="hidden lg:block">Search</span>
          </button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex gap-2 mt-2">
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

  return (
    <>
      <div className="relative w-full h-screen">
        <Swiper modules={[Navigation, Autoplay]} navigation autoplay={{ delay: 3000 }} loop className="w-full h-screen">
          {["slide03", "slide01", "slide02"].map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(http://hompark.themezinho.net/wp-content/uploads/2020/03/${img}.jpg)` }}
              >
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
    </>
  );
};

export default SearchBar;