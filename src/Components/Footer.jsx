import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedin, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Send } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinkStyle = "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium text-sm block py-1";

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-20 pb-10 transition-colors">
            <div className="w-11/12 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                                <img src="https://i.postimg.cc/1XmpxyVH/logo.png" alt="Logo" className="w-6 h-6 brightness-0 invert" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent tracking-tighter">
                                DocTalk
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Connecting patients with verified experts across the globe. Quality healthcare, delivered digitally with care and precision.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: <FaFacebook size={18} />, link: "https://facebook.com" },
                                { icon: <FaGithub size={18} />, link: "https://github.com/KAvinash47" },
                                { icon: <FaLinkedin size={18} />, link: "https://linkedin.com" },
                                { icon: <FaInstagram size={18} />, link: "https://instagram.com" }
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Explore</h4>
                        <ul className="space-y-2">
                            <li><NavLink to="/" className={footerLinkStyle}>Home Page</NavLink></li>
                            <li><NavLink to="/blogs" className={footerLinkStyle}>Latest Blogs</NavLink></li>
                            <li><NavLink to="/contact" className={footerLinkStyle}>Support Center</NavLink></li>
                            <li><NavLink to="/login" className={footerLinkStyle}>Member Login</NavLink></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Support</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-blue-600 mt-1" />
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">123 Health Ave, Medical District,<br/> New York, NY 10001</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-blue-600" />
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">+1 (234) 567-890</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-600" />
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">contact@doctalk.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-6">Newsletter</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-4 uppercase tracking-tighter">Stay updated with health tips</p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Your email" 
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium"
                            />
                            <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        © {currentYear} DocTalk. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
