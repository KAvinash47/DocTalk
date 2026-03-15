import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");   // redirect after logout
    };
    return (
        <div className="navbar w-11/12 mx-auto py-4">
            <div className="navbar-start">
                <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600" : ""}>Home</NavLink></li>
                        {user?.role === "patient" && (
                            <li>
                                <NavLink to="/my-bookings" className={({ isActive }) => isActive ? "text-blue-600" : ""}>
                                    My-Bookings
                                </NavLink>
                            </li>
                        )}
                        {user?.role === "doctor" && (
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600" : ""}>
                                    My-Bookings
                                </NavLink>
                            </li>
                        )}
                        <li><NavLink to="/blogs" className={({ isActive }) => isActive ? "text-blue-600" : ""}>Blogs</NavLink></li>
                        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-600" : ""}>Contact Us</NavLink></li>
                    </ul>
                </div>
                <a className="flex items-center gap-2 text-xl font-bold cursor-pointer">
                    <img src="https://i.postimg.cc/1XmpxyVH/logo.png" alt="Phudu Logo" className="w-8 h-8" /><span>DocTalk</span>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6">
                    <li><NavLink to="/" className={({ isActive }) => `text-base font-medium hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Home</NavLink></li>
                    <li><NavLink to="/my-bookings" className={({ isActive }) => `text-base font-medium hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>My-Bookings</NavLink></li>
                    <li><NavLink to="/blogs" className={({ isActive }) => `text-base font-medium hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Blogs</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive }) => `text-base font-medium hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Contact Us</NavLink></li>
                </ul>
            </div>
            <div className="navbar-end">
                {!user && (
                    <NavLink to="/login" className="btn bg-blue-600 text-white px-6 rounded-full">Login</NavLink>
                )}

                {user && (
                    <button onClick={handleLogout} className="btn bg-red-500 text-white px-6 rounded-full">Logout</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;