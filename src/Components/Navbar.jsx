import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `relative px-4 py-2 rounded-full font-bold transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
    }`;

  const navLinks = (
    <>
      <li><NavLink to="/" className={linkStyle}>Home</NavLink></li>
      {user?.role === "patient" && (
        <li><NavLink to="/my-bookings" className={linkStyle}>My Bookings</NavLink></li>
      )}
      {user?.role === "doctor" && (
        <li><NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink></li>
      )}
      <li><NavLink to="/blogs" className={linkStyle}>Blogs</NavLink></li>
      <li><NavLink to="/contact" className={linkStyle}>Contact</NavLink></li>
    </>
  );

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="w-11/12 mx-auto py-3 flex items-center justify-between">

        {/* LOGO AREA - Optimized for Mobile */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <img 
                src="https://i.postimg.cc/1XmpxyVH/logo.png" 
                alt="Logo" 
                className="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert object-contain" 
              />
          </div>
          <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent tracking-tight">
            DocTalk
          </span>
        </div>

        {/* CENTER LINKS - Desktop Only */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {navLinks}
          </ul>
        </div>

        {/* RIGHT ACTIONS - Responsive padding */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm"
          >
            {theme === 'light' ? <Moon size={18} className="text-slate-700" /> : <Sun size={18} className="text-yellow-400" />}
          </button>

          {!user ? (
            <NavLink
              to="/login"
              className="px-4 sm:px-8 py-2 bg-blue-600 text-white rounded-full font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-full font-black hover:bg-red-500 hover:text-white transition-all text-xs sm:text-sm uppercase tracking-wider"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
