import React, { useContext } from "react";
import { Home, Users, Package, Lock, LogOut, User, ChevronRight, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext"; 

const Sidebar = ({ expanded, setExpanded, isDark, setIsDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); 
    navigate("/login", { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } ${expanded ? "w-64" : "w-20"} shadow-lg`}
    >
      {/* Header with Toggle */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        {expanded && (
          <span className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-1.5 rounded-md transition-colors ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          <ChevronRight
            className={`h-5 w-5 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            } ${isDark ? "text-gray-400" : "text-gray-600"}`}
          />
        </button>
      </div>

      {/* User Info */}
      <div className={`flex items-center gap-3 p-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${isDark ? "from-blue-500 to-purple-600" : "from-blue-600 to-purple-700"} flex items-center justify-center flex-shrink-0`}>
          <User className="w-4 h-4 text-white" />
        </div>
        {expanded && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || user?.username || "Admin"}
            </p>
            <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {user?.email || "admin@example.com"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4">
        <NavItem 
          expanded={expanded}
          icon={<Home className="w-5 h-5" />}
          label="Dashboard"
          isActive={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
          isDark={isDark}
        />
        <NavItem 
          expanded={expanded}
          icon={<Users className="w-5 h-5" />}
          label="Users"
          isActive={isActive("/dashboard/users")}
          onClick={() => navigate("/dashboard/users")}
          isDark={isDark}
        />
        <NavItem 
          expanded={expanded}
          icon={<Package className="w-5 h-5" />}
          label="Products"
          isActive={isActive("/dashboard/products")}
          onClick={() => navigate("/dashboard/products")}
          isDark={isDark}
        />
        <NavItem 
          expanded={expanded}
          icon={<Lock className="w-5 h-5" />}
          label="Orders"
          isActive={isActive("/dashboard/orders")}
          onClick={() => navigate("/dashboard/orders")}
          isDark={isDark}
        />
      </div>

      {/* Bottom Section */}
      <div className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"} space-y-2`}>
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
          } ${expanded ? "justify-start" : "justify-center"}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {expanded && <span className="text-sm">Theme</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isDark ? "hover:bg-red-900/20 text-red-400" : "hover:bg-red-50 text-red-600"
          } ${expanded ? "justify-start" : "justify-center"}`}
        >
          <LogOut className="w-5 h-5" />
          {expanded && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ expanded, icon, label, onClick, isActive, isDark }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
        expanded ? "justify-start" : "justify-center"
      } ${
        isActive
          ? isDark
            ? "bg-gray-800 text-white border-r-2 border-blue-500"
            : "bg-gray-100 text-gray-900 border-r-2 border-blue-600"
          : isDark
          ? "text-gray-400 hover:bg-gray-800 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      {expanded && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};

export default Sidebar;