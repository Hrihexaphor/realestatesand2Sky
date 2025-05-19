import { NavLink } from "react-router-dom";

const DropdownNavItem = ({ item, isCollapsed, openDropdown, onClick }) => {
  const isOpen = openDropdown === item.label;

  return (
    <div className="space-y-1">
      <div
        onClick={() => onClick(item.label)}
        className={`flex items-center px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-amber-400 ${
          isOpen ? 'text-amber-400' : 'text-gray-300'
        }`}
      >
        <span className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
        {!isCollapsed && (
          <>
            <span className="text-sm font-medium">{item.label}</span>
            <span className="ml-auto">{isOpen ? '▴' : '▾'}</span>
          </>
        )}
      </div>
      {!isCollapsed && isOpen && (
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
  );
};

export default DropdownNavItem