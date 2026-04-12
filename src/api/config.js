// Centralized API configuration for deployment
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocalhost 
    ? 'http://localhost:5001' 
    : (import.meta.env.VITE_API_URL || 'https://doctalk-pnmt.onrender.com');

console.log("Using API Base URL:", API_BASE_URL);
