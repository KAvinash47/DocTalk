// Centralized API configuration for deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
console.log("Current API Base URL:", API_BASE_URL);
