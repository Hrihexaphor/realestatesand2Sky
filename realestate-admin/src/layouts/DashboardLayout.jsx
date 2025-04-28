import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-6 shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink 
            to="/dashboard/property" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">🏠</span> Property
          </NavLink>
          <NavLink 
            to="/dashboard/amenities" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">🛁</span> Amenities
          </NavLink>
          <NavLink 
            to="/dashboard/developer" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">👷</span> Developer
          </NavLink>
          <NavLink 
            to="/dashboard/nearest" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">📍</span> Nearest To
          </NavLink>
          <NavLink 
            to="/dashboard/category" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">🏬</span> Property Category
          </NavLink>
          <NavLink 
            to="/dashboard/featured" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">🏩</span> Featured Property
          </NavLink>
          <NavLink 
            to="/dashboard/leads" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">👨‍✈️</span> Leads 
          </NavLink>
          <NavLink 
            to="/dashboard/blogs" 
            className={({ isActive }) => 
              `p-2 rounded flex items-center transition-all duration-200 hover:bg-gray-800 hover:text-amber-400 
              ${isActive ? 'bg-gray-800/50 text-amber-400 font-medium' : ''}`
            }
          >
            <span className="mr-2">📝</span> Blog
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="ml-64 p-8 w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;