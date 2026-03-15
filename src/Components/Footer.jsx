import React from 'react';
import { NavLink } from 'react-router';
import { FaFacebook, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className="bg-white py-6 md:py-10">
            <div className="w-11/12 max-w-6xl mx-auto px-4 md:px-0">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src="https://i.postimg.cc/1XmpxyVH/logo.png" alt="Phudu Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold">DocTalk</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-600 text-center">
                        <NavLink to="/" className={({ isActive }) => `hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Home</NavLink>
                        <NavLink to="/my-bookings" className={({ isActive }) => `hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>My-Bookings</NavLink>
                        <NavLink to="/blogs" className={({ isActive }) => `hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Blogs</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`}>Contact Us</NavLink>
                    </div>
                    <div className='border border-gray-200 w-full'></div>
                    {/* Social Media Icons */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-600 items-center">
                        <a href="https://web.facebook.com" target='_blank' className="hover:text-blue-600"><FaFacebook size={24} /></a>
                        <a href="https://github.com" target='_blank' className="hover:text-blue-600"><FaGithub size={24} /></a>
                        <a href="https://www.linkedin.com" target='_blank' className="hover:text-blue-600"><FaLinkedin size={24} /></a>
                        <a href="https://www.instagram.com/" target='_blank' className="hover:text-blue-600"><FaInstagram size={24} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;