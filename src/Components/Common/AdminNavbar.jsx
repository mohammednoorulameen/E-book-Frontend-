import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaTimes, FaBook } from "react-icons/fa";

const AdminNavbar = ({ sidebarOpen, toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
      
  };

  return (
    <header className="bg-white border-b ">
      <div className="flex items-center justify-between px-6 py-4 ">
        <div className="flex items-center gap-6">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h3
        className="flex items-center justify-center mt-"
        style={{ fontSize: "20px", fontWeight: "bold" }}
      >
    <FaBook className="ml-4 text-black" /> <span>E-book (Admin)</span>
</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl text-black" />
            <span className="text-black">Admin</span>
          </button>
          {/* dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
              >
                <FaCog /> <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center space-x-2"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
