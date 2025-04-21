// DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import './DashboardLayoout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/property" className="nav-item">
            <span className="nav-icon">🏠</span> Property
          </NavLink>
          <NavLink to="/dashboard/amenities" className="nav-item">
            <span className="nav-icon">🛁</span> Amenities
          </NavLink>
          <NavLink to="/dashboard/developer" className="nav-item">
            <span className="nav-icon">👷</span> Developer
          </NavLink>
          <NavLink to="/dashboard/nearest" className="nav-item">
            <span className="nav-icon">📍</span> Nearest To
          </NavLink>
          <NavLink to="/dashboard/category" className="nav-item">
            <span className="nav-icon">🏬</span> property Category
          </NavLink>
          <NavLink to="/dashboard/blogs" className="nav-item">
            <span className="nav-icon">📝</span> Blog
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;