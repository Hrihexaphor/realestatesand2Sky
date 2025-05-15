import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBath, 
  FaHardHat, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaStar, 
  FaUserTie, 
  FaNewspaper,
  FaAtlas,
  FaSignOutAlt,
  FaBars,
  FaArrowLeft,
  FaRegFileAlt,
  FaHive
} from 'react-icons/fa';
import { useState } from 'react';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: "/dashboard/property", icon: <FaHome />, label: "Property" },
    { path: "/dashboard/amenities", icon: <FaBath />, label: "Amenities" },
    { path: "/dashboard/developer", icon: <FaHardHat />, label: "Developer" },
    { path: "/dashboard/nearest", icon: <FaMapMarkerAlt />, label: "Nearest To" },
    { path: "/dashboard/category", icon: <FaBuilding />, label: "Property Category" },
    { path: "/dashboard/featured", icon: <FaStar />, label: "Featured Property" },
    { path: "/dashboard/advertisement", icon: <FaAtlas />, label: "Advertisement" },
    { path: "/dashboard/review", icon: <FaHive />, label: "Review & Rating" },
    { path: "/dashboard/leads", icon: <FaUserTie />, label: "Leads",
      children: [
        { path: "/dashboard/inquiryleads", label: "Post Requirement" },
        { path: "/dashboard/privacypolicy", label: "Property Inquiry" }
      ]
     },
    {
      icon: <FaRegFileAlt />,
      label: "Pages",
      children: [
        { path: "/dashboard/aboutus", label: "About Us" },
        { path: "/dashboard/privacypolicy", label: "Privacy Policy" },
        { path: "/dashboard/cancelpolicy", label: "Cancellation Policy" },
        { path: "/dashboard/termandservice", label: "Terms and services" }
      ]
    },
    { path: "/dashboard/blogs", icon: <FaNewspaper />, label: "Blog", 
       children: [
        { path: "/dashboard/blog-category", label: "add Category" },
        { path: "/dashboard/blogs", label: "add Blog" }
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className={`font-bold transition-opacity duration-200 flex items-center ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 text-xl'}`}>
            <FaBuilding className="text-amber-400 mr-2" /> Admin Portal
          </h2>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            {isCollapsed ? <FaBars className="text-amber-400" /> : <FaArrowLeft className="text-amber-400" />}
          </button>
        </div>

        <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          <nav className="px-3 space-y-1">
          {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <div
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-amber-400 ${
                        openDropdown === item.label ? 'text-amber-400' : 'text-gray-300'
                      }`}
                    >
                      <span className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="ml-auto">{openDropdown === item.label ? '▴' : '▾'}</span>
                        </>
                      )}
                    </div>
                    {!isCollapsed && openDropdown === item.label && (
                      <div className="pl-12 space-y-1">
                        {item.children.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block py-2 text-sm rounded hover:text-amber-400 ${
                                isActive ? 'text-amber-400' : 'text-gray-300'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-amber-400 ${
                        isActive ? 'bg-gray-700 text-amber-400 shadow-md' : 'text-gray-300'
                      }`
                    }
                  >
                    <span className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
                    {!isCollapsed && (
                      <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
                    )}
                  </NavLink>
                )
              )}
          </nav>

          <div className={`mt-auto px-3 py-4 border-t border-gray-700 ${isCollapsed ? 'hidden' : 'block'}`}>
    
            <div className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-all duration-200">
              <FaSignOutAlt className="text-lg mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'} flex-1`}>
     
        <main className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;