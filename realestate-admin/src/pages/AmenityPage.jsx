import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaSwimmingPool, FaWifi, FaParking, FaSnowflake, FaUtensils, 
  FaDumbbell, FaTv, FaBed, FaShower, FaCoffee, FaBaby, 
  FaWheelchair, FaUmbrellaBeach, FaHotTub, FaBicycle, 
  FaSprayCan, FaCocktail, FaDog, FaCar, FaShuttleVan,
  FaWater, FaFireExtinguisher, FaUserShield, FaChild, 
  FaUserTie, FaHome, FaStore, FaBroadcastTower, 
  FaRunning, FaBasketballBall, FaTableTennis, FaChessBoard,
  FaTrophy, FaBookReader, FaTree, FaRecycle, 
  FaLeaf, FaTint, FaSquareFull, FaDoorClosed, FaSink, 
  FaBolt, FaPhone, FaPaintRoller, FaPlug
} from 'react-icons/fa';
import { 
  MdLocalLaundryService, MdMeetingRoom, MdAir, MdSpa, 
  MdOutdoorGrill, MdSecurity, MdSportsBasketball, MdPool, 
  MdFitnessCenter, MdLocalLibrary, MdNature, MdWaterDrop,
  MdCleaningServices
} from 'react-icons/md';
import { GiLockers, GiCctvCamera, GiFireplace, } from 'react-icons/gi';
import { BsFillTelephoneFill, BsFillShieldLockFill } from 'react-icons/bs';
import { IoGameControllerOutline, IoWater } from 'react-icons/io5';
import { ImOffice } from 'react-icons/im';

const AmenityPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', icon: '', category: 'General' });
  const [errors, setErrors] = useState({ name: '', icon: '', category: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [submitting, setSubmitting] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Icon mapping object
  const iconComponents = {
    // Original icons
    'FaSwimmingPool': FaSwimmingPool,
    'FaWifi': FaWifi,
    'FaParking': FaParking,
    'FaSnowflake': FaSnowflake,
    'FaUtensils': FaUtensils,
    'FaDumbbell': FaDumbbell,
    'FaTv': FaTv,
    'FaBed': FaBed,
    'FaShower': FaShower,
    'FaCoffee': FaCoffee,
    'FaBaby': FaBaby,
    'FaWheelchair': FaWheelchair,
    'FaUmbrellaBeach': FaUmbrellaBeach,
    'FaHotTub': FaHotTub,
    'FaBicycle': FaBicycle,
    'FaSprayCan': FaSprayCan,
    'FaCocktail': FaCocktail,
    'FaDog': FaDog,
    'FaCar': FaCar,
    'FaShuttleVan': FaShuttleVan,
    'MdLocalLaundryService': MdLocalLaundryService,
    'MdMeetingRoom': MdMeetingRoom,
    'MdAir': MdAir,
    'MdSpa': MdSpa,
    'MdOutdoorGrill': MdOutdoorGrill,
    'GiLockers': GiLockers,
    'BsFillTelephoneFill': BsFillTelephoneFill,
    'IoGameControllerOutline': IoGameControllerOutline,
    
    // New icons
    'FaWater': FaWater,
    'FaFireExtinguisher': FaFireExtinguisher,
    'FaUserShield': FaUserShield,
    'FaChild': FaChild,
    'FaUserTie': FaUserTie,
    'FaHome': FaHome,
    'FaStore': FaStore,
    'FaBroadcastTower': FaBroadcastTower,
    'FaRunning': FaRunning,
    'FaBasketballBall': FaBasketballBall,
    'FaTableTennis': FaTableTennis,
    'FaChessBoard': FaChessBoard,
    'FaTrophy': FaTrophy,
    'FaBookReader': FaBookReader,
    'FaTree': FaTree,
    'FaRecycle': FaRecycle,
    'FaLeaf': FaLeaf,
    'FaTint': FaTint,
    'FaSquareFull': FaSquareFull,
    'FaDoorClosed': FaDoorClosed,
    'FaSink': FaSink,
    'FaBolt': FaBolt,
    'FaPhone': FaPhone,
    'FaPaintRoller': FaPaintRoller,
    'FaPlug': FaPlug,
    'MdSecurity': MdSecurity,
    'MdSportsBasketball': MdSportsBasketball,
    'MdPool': MdPool,
    'MdFitnessCenter': MdFitnessCenter,
    'MdLocalLibrary': MdLocalLibrary,
    'MdNature': MdNature,
    'MdWaterDrop': MdWaterDrop,
    'MdCleaningServices': MdCleaningServices,
    'GiCctvCamera': GiCctvCamera,
    'GiFireplace': GiFireplace,
    'BsFillShieldLockFill': BsFillShieldLockFill,
    'IoWater': IoWater,
    'ImOffice': ImOffice
  };

  // Category definitions
  const amenityCategories = [
    { id: 'general', name: 'General' },
    { id: 'safety', name: 'Safety' },
    { id: 'sports', name: 'Sports' },
    { id: 'leisure', name: 'Leisure' },
    { id: 'environment', name: 'Environment' },
    { id: 'home', name: 'Home Specifications' }
  ];

  // Predefined amenities with categories and icons
  const predefinedAmenities = [
    // General
    { name: '24X7 Water Supply', icon: 'FaWater', category: 'General' },
    { name: 'Fire Fighting System', icon: 'FaFireExtinguisher', category: 'General' },
    { name: 'Security', icon: 'MdSecurity', category: 'General' },
    { name: 'Visitor Parking', icon: 'FaParking', category: 'General' },
    { name: 'Mud Playing Zone', icon: 'FaChild', category: 'General' },
    { name: 'Pets Zone', icon: 'FaDog', category: 'General' },
    { name: 'Children Playing Zone', icon: 'FaChild', category: 'General' },
    { name: 'Senior Citizen Sitting Area', icon: 'FaUserTie', category: 'General' },
    { name: 'Crèche', icon: 'FaBaby', category: 'General' },
    { name: 'DTH And Broadband Connection', icon: 'FaBroadcastTower', category: 'General' },
    { name: 'Senior Citizens Walking Track', icon: 'FaRunning', category: 'General' },
    { name: 'Clubhouse', icon: 'FaHome', category: 'General' },
    { name: 'Society Office', icon: 'ImOffice', category: 'General' },
    { name: 'Convenience Store', icon: 'FaStore', category: 'General' },
    
    // Safety
    { name: 'Reserved Parking', icon: 'FaParking', category: 'Safety' },
    { name: 'CCTV Surveillance', icon: 'GiCctvCamera', category: 'Safety' },
    { name: 'Entrance Gate With Security', icon: 'BsFillShieldLockFill', category: 'Safety' },
    { name: 'Fire Fighting System', icon: 'FaFireExtinguisher', category: 'Safety' },
    { name: 'Fireplace', icon: 'GiFireplace', category: 'Safety' },
    
    // Sports
    { name: 'Kids Play Area', icon: 'FaChild', category: 'Sports' },
    { name: 'Lattu Game', icon: 'IoGameControllerOutline', category: 'Sports' },
    { name: 'Game Corners', icon: 'FaChessBoard', category: 'Sports' },
    { name: 'Indoor Games', icon: 'IoGameControllerOutline', category: 'Sports' },
    { name: 'Basketball Court', icon: 'FaBasketballBall', category: 'Sports' },
    { name: 'Multipurpose Play Court', icon: 'MdSportsBasketball', category: 'Sports' },
    { name: 'Badminton Court', icon: 'FaTrophy', category: 'Sports' },
    
    // Leisure
    { name: 'Community Club', icon: 'FaHome', category: 'Leisure' },
    { name: 'Recreation/Kids Club', icon: 'FaChild', category: 'Leisure' },
    { name: 'Swimming Pool', icon: 'FaSwimmingPool', category: 'Leisure' },
    { name: 'Play Area With Swimming Pool', icon: 'MdPool', category: 'Leisure' },
    { name: 'Study Library', icon: 'MdLocalLibrary', category: 'Leisure' },
    { name: 'Indoor Kids\' Play Area', icon: 'FaChild', category: 'Leisure' },
    { name: 'Indoor Games And Activities', icon: 'IoGameControllerOutline', category: 'Leisure' },
    { name: 'Gym', icon: 'MdFitnessCenter', category: 'Leisure' },
    { name: 'Kids Pool', icon: 'FaSwimmingPool', category: 'Leisure' },
    { name: 'Nature Walkway', icon: 'FaTree', category: 'Leisure' },
    { name: 'Green Wall', icon: 'MdNature', category: 'Leisure' },
    
    // Environment
    { name: 'Sewage Treatment Plant', icon: 'MdCleaningServices', category: 'Environment' },
    { name: 'Organic Waste Convertor', icon: 'FaRecycle', category: 'Environment' },
    { name: 'Eco Life', icon: 'FaLeaf', category: 'Environment' },
    { name: 'Drip Irrigation System', icon: 'FaTint', category: 'Environment' },
    
    // Home Specifications
    { name: 'Marble flooring', icon: 'FaSquareFull', category: 'Home Specifications' },
    { name: 'Laminate finish doors', icon: 'FaDoorClosed', category: 'Home Specifications' },
    { name: 'Premium sanitary and CP fittings', icon: 'FaShower', category: 'Home Specifications' },
    { name: 'Stainless steel sink', icon: 'FaSink', category: 'Home Specifications' },
    { name: 'False Ceiling', icon: 'FaHome', category: 'Home Specifications' },
    { name: 'Concealed Electrification', icon: 'FaBolt', category: 'Home Specifications' },
    { name: 'TV Point', icon: 'FaTv', category: 'Home Specifications' },
    { name: 'Telephone point', icon: 'FaPhone', category: 'Home Specifications' },
    { name: 'Acrylic Emulsion Paint', icon: 'FaPaintRoller', category: 'Home Specifications' },
   
    { name: 'Multi-stranded cables', icon: 'FaPlug', category: 'Home Specifications' },
    
    { name: 'Geyser Point', icon: 'FaShower', category: 'Home Specifications' }
  ];

  // Icon categories
  const iconCategories = [
    {
      name: 'Basic Amenities',
      icons: ['FaWifi', 'FaParking', 'FaSnowflake', 'FaUtensils', 'FaBed', 'FaShower', 'FaCoffee', 'FaWater']
    },
    {
      name: 'Activities & Recreation',
      icons: ['FaSwimmingPool', 'FaDumbbell', 'FaUmbrellaBeach', 'FaHotTub', 'FaBicycle', 'IoGameControllerOutline', 
             'FaBasketballBall', 'FaTableTennis', 'FaChessBoard',  'FaRunning']
    },
    {
      name: 'Special Services',
      icons: ['FaBaby', 'FaWheelchair', 'FaSprayCan', 'FaCocktail', 'FaDog', 'FaCar', 'FaShuttleVan', 
             'FaUserTie', 'FaChild', 'FaStore']
    },
    {
      name: 'Safety & Security',
      icons: ['FaFireExtinguisher', 'MdSecurity', 'GiCctvCamera', 'BsFillShieldLockFill', 'GiFireplace']
    },
    {
      name: 'Environment & Utilities',
      icons: ['FaTree', 'FaRecycle', 'FaLeaf', 'FaTint', 'MdNature', 'MdWaterDrop', 'MdCleaningServices']
    },
    {
      name: 'Room & Facility',
      icons: ['MdLocalLaundryService', 'MdMeetingRoom', 'MdAir', 'MdSpa', 'MdOutdoorGrill', 'GiLockers', 
             'BsFillTelephoneFill', 'FaTv', 'FaHome', 'FaSquareFull', 'FaDoorClosed', 'FaSink', 'FaBolt', 
             'FaPhone', 'FaPaintRoller', 'FaPlug']
    }
  ];

  // Filter icons based on search term
  const filteredCategories = searchTerm 
    ? [{ 
        name: 'Search Results', 
        icons: Object.keys(iconComponents).filter(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase()))
      }]
    : iconCategories;

  const validateForm = () => {
    const newErrors = { name: '', icon: '', category: '' };
    let isValid = true;
    
    if (!form.name.trim()) {
      newErrors.name = 'Amenity name is required';
      isValid = false;
    }
    
    if (!form.icon) {
      newErrors.icon = 'Please select an icon';
      isValid = false;
    }
    
    if (!form.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/amenities`);
      setAmenities(res.data);
    } catch (err) {
      // If API fails, use predefined amenities for demo purposes
      setAmenities(predefinedAmenities.map((item, index) => ({
        ...item,
        id: index + 1
      })));
      console.log('Using predefined amenities (API might not be available)');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = () => {
    // Simulate adding all predefined amenities
    toast.info('Bulk importing predefined amenities...');
    
    // In a real implementation, you would make API calls here
    setTimeout(() => {
      setAmenities(predefinedAmenities.map((item, index) => ({
        ...item,
        id: index + 1
      })));
      toast.success('Successfully imported all amenities');
    }, 1000);
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      // In a real implementation, this would be an API call
      await axios.post(`${BASE_URL}/api/amenities`, form);
      
      // For demo, just add to local state
      const newAmenity = {
        ...form,
        id: amenities.length > 0 ? Math.max(...amenities.map(a => a.id)) + 1 : 1
      };
      
      setAmenities([...amenities, newAmenity]);
      toast.success('Amenity added successfully');
      setForm({ name: '', icon: '', category: 'General' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add amenity');
      console.error('Error adding amenity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPredefined = (amenity) => {
    const exists = amenities.some(a => 
      a.name.toLowerCase() === amenity.name.toLowerCase() && 
      a.category === amenity.category
    );
    
    if (exists) {
      toast.info(`"${amenity.name}" already exists in the ${amenity.category} category`);
      return;
    }
    
    const newAmenity = {
      ...amenity,
      id: amenities.length > 0 ? Math.max(...amenities.map(a => a.id)) + 1 : 1
    };
    
    setAmenities([...amenities, newAmenity]);
    toast.success(`Added "${amenity.name}" to ${amenity.category} category`);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    try {
      // In a real implementation, this would be an API call
      await axios.delete(`${BASE_URL}/api/amenities/${deleteModal.id}`);
      
      // For demo, just remove from local state
      setAmenities(amenities.filter(amenity => amenity.id !== deleteModal.id));
      toast.success('Amenity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete amenity');
      console.error('Error deleting amenity:', err);
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const selectIcon = (iconName) => {
    setForm({ ...form, icon: iconName });
    setShowIconModal(false);
  };

  // Filter amenities based on active tab
  const filteredAmenities = activeTab === 'all' 
    ? amenities 
    : amenities.filter(amenity => amenity.category.toLowerCase() === activeTab);

  // Render icon component based on icon name
  const renderIconComponent = (iconName, size = 5) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent className={`h-${size} w-${size}`} /> : null;
  };

  // Get unused predefined amenities for quick-add
  const unusedPredefinedAmenities = predefinedAmenities.filter(pa => 
    !amenities.some(a => a.name.toLowerCase() === pa.name.toLowerCase() && a.category === pa.category)
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Manage Amenities</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Amenity</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swimming Pool"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowIconModal(true)}
                    className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {form.icon ? (
                      <div className="flex items-center space-x-2">
                        {renderIconComponent(form.icon)}
                        <span className="text-gray-700">{form.icon}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select an icon</span>
                    )}
                  </button>
                  {form.icon && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, icon: '' })}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full ${submitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Add Amenity'}
              </button>
            </form>
          </div>
        </div>
        
        {/* List Section */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Amenities</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : amenities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No amenities found. Add your first one!
              </div>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
                        {iconComponents[amenity.icon] ? 
                          renderIconComponent(amenity.icon) : 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        }
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{amenity.name}</h3>
                        <p className="text-sm text-gray-500">{amenity.icon}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteModal({ show: true, id: amenity.id })}
                      className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Icon Selection Modal */}
      {showIconModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select an Icon</h3>
              <button
                onClick={() => setShowIconModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="font-medium text-gray-700 mb-2">{category.name}</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {category.icons.map((iconName) => (
                      <button
                        key={iconName}
                        onClick={() => selectIcon(iconName)}
                        className={`p-3 flex flex-col items-center justify-center border rounded-lg hover:bg-blue-50 transition-colors ${
                          form.icon === iconName ? 'bg-blue-100 border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        {renderIconComponent(iconName, 6)}
                        <span className="text-xs mt-1 text-gray-500 truncate w-full text-center">{iconName.replace(/^(Fa|Md|Gi|Bs|Io)/, '')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredCategories.length === 1 && filteredCategories[0].icons.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No icons match your search. Try a different term.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this amenity? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenityPage;