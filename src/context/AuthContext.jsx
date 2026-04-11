import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // Restore user on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (email) => {
    let role = "patient";
    let id = null;

    if (email === "doctor@test.com") {
      role = "doctor";
      id = 1; // Default ID for demo doctor
    }

    const userData = { email, role, id };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("user");   // ✅ FIXED
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;