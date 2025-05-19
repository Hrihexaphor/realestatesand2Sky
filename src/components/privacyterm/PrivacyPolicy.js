import React, { useState, useEffect } from 'react';
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";


const tabData = {
  buy: [
    { location: 'Delhi', locality: 'Dwarka' },
    { location: 'Mumbai', locality: 'Andheri' },
    { location: 'Bangalore', locality: 'Whitefield' },
  ],
  newProject: [
    { location: 'Chennai', locality: 'Velachery' },
    { location: 'Hyderabad', locality: 'Banjara Hills' },
  ],
  project: [
    { location: 'Pune', locality: 'Kothrud' },
    { location: 'Ahmedabad', locality: 'Satellite' },
  ],
};


const PrivacyPolicy = () => {

  const [activeTab, setActiveTab] = useState('buy');
  const [tabStates, setTabStates] = useState({
    buy: { searchTerm: '', suggestions: [], selectedTags: [] },
    newProject: { searchTerm: '', suggestions: [], selectedTags: [] },
    project: { searchTerm: '', suggestions: [], selectedTags: [] },
  });

  const updateTabState = (key, value) => {
    setTabStates(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }));
  };

  const currentTabState = tabStates[activeTab];

  useEffect(() => {
    const term = currentTabState.searchTerm.toLowerCase();
    if (!term.trim()) {
      updateTabState('suggestions', []);
      return;
    }

    const selectedLocation = currentTabState.selectedTags.find(tag => tag.type === 'Location')?.value;

    const locationSuggestions = selectedLocation
      ? []
      : tabData[activeTab]
        .map(item => item.location)
        .filter((value, index, self) => self.indexOf(value) === index && value.toLowerCase().includes(term))
        .map(location => ({ type: 'Location', value: location }));

    const localitySuggestions = tabData[activeTab]
      .filter(item => selectedLocation ? item.location === selectedLocation : false)
      .map(item => item.locality)
      .filter((value, index, self) => self.indexOf(value) === index && value.toLowerCase().includes(term))
      .map(locality => ({ type: 'Locality', value: locality }));

    updateTabState('suggestions', [...locationSuggestions, ...localitySuggestions]);
  }, [currentTabState.searchTerm, currentTabState.selectedTags, activeTab]);

  const handleSelect = (item) => {
    const exists = currentTabState.selectedTags.some(tag => tag.type === item.type && tag.value === item.value);
    if (!exists) {
      updateTabState('selectedTags', [...currentTabState.selectedTags, item]);
    }
    updateTabState('searchTerm', '');
    updateTabState('suggestions', []);
  };

  const removeTag = (itemToRemove) => {
    updateTabState(
      'selectedTags',
      currentTabState.selectedTags.filter(
        tag => !(tag.type === itemToRemove.type && tag.value === itemToRemove.value)
      )
    );
  };

  const groupedSuggestions = currentTabState.suggestions.reduce((groups, item) => {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
    return groups;
  }, {});

  const locationTag = currentTabState.selectedTags.find(tag => tag.type === 'Location');
  const localityCount = currentTabState.selectedTags.filter(tag => tag.type === 'Locality').length;


  return (
    <div>
      <NewNav />
      <div className="bg-[#F4EFE5]">
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Privacy Policy</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          {/* Contact Form Section */}
          <div className="bg-white p-2 rounded-lg w-[70%] m-auto items-center justify-center">
            <h2 className="text-lg font-bold text-center my-2">Privacy Policy</h2>
            <div>
              {/* ------------> */}
              {/* <div className="p-4 max-w-xl mx-auto">
                <nav className="flex space-x-4 pb-3">
                  {['buy', 'newProject', 'project'].map(tab => (
                    <span
                      key={tab}
                      className={`font-bold font-geometric-regular cursor-pointer text-black ${activeTab === tab
                ? "border-b-2 border-[#FFD700]"
                : "hover:border-b-2 hover:border-[#FFD700]"
                }`}
              onClick={() => setActiveTab(tab)}
                    >
                      {tab.replace(/([A-Z])/g, ' $1')}
                    </span>
                  ))}
                </nav>

                <input
                  type="text"
                  value={currentTabState.searchTerm}
                  onChange={e => updateTabState('searchTerm', e.target.value)}
                  placeholder="Search location or locality..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />

                {currentTabState.suggestions.length > 0 && (
                  <div className="border border-gray-300 rounded bg-white mb-2 max-h-60 overflow-auto">
                    {Object.entries(groupedSuggestions).map(([type, items]) => (
                      <div key={type} className="border-b border-gray-200">
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-100">{type}</div>
                        <ul>
                          {items.map((item, idx) => (
                            <li
                              key={idx}
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => handleSelect(item)}
                            >
                              {item.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {currentTabState.selectedTags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.value} <span className="text-xs text-gray-500">({tag.type})</span>
                      {idx >= 1 && <span className="ml-1">+{idx}</span>}
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => removeTag(tag)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div> */}
              {/* -----------> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
