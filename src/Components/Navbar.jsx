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
    <div className="hidden lg:flex items-center gap-2">
      <NavLink to="/" className={linkStyle}>Home</NavLink>
      {user?.role === "patient" && (
        <NavLink to="/my-bookings" className={linkStyle}>My Bookings</NavLink>
      )}
      {user?.role === "doctor" && (
        <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
      )}
      <NavLink to="/health-guide" className={linkStyle}>Health Guide</NavLink>
      <NavLink to="/health-tools" className={linkStyle}>Health Tools</NavLink>
      <NavLink to="/ai-chat" className={linkStyle}>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          AI Assistant
        </span>
      </NavLink>
      <NavLink to="/blogs" className={linkStyle}>Blogs</NavLink>

      <NavLink to="/contact" className={linkStyle}>Contact</NavLink>
    </div>
  );

  return (
    <nav className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-[5000] border-b border-gray-100 dark:border-slate-800 transition-colors py-3">
      <div className="w-11/12 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO AREA - No Hamburger logic at all */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <img 
                src="https://i.postimg.cc/1XmpxyVH/logo.png" 
                alt="Logo" 
                className="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert" 
              />
          </div>
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent tracking-tighter">
            DocTalk
          </span>
          <span className="text-[8px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md ml-1 hidden sm:inline-block">LIVE v2.0</span>
        </div>

        {/* CENTER LINKS (Desktop Only) */}
        {navLinks}

        {/* ACTIONS (Theme + Login/Logout) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 transition-all hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-yellow-400" />}
          </button>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 sm:px-8 py-2 bg-blue-600 text-white rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all active:scale-95"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 border-2 border-red-500 text-red-500 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
