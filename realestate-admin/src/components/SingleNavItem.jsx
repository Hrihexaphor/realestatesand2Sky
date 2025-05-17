import { NavLink } from "react-router-dom";

const SingleNavItem = ({ item, isCollapsed }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) =>
            `flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-amber-400 ${isActive ? 'bg-gray-700 text-amber-400 shadow-md' : 'text-gray-300'
            }`
        }
    >
        <span className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
        {!isCollapsed && (
            <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
        )}
    </NavLink>
);

export default SingleNavItem;