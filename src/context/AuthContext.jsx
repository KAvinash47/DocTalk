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

    // Smart matching for demo: doctor1@test.com -> ID 1, doctor2@test.com -> ID 2, etc.
    if (email.startsWith("doctor") && email.includes("@")) {
      role = "doctor";
      const match = email.match(/doctor(\d+)/i);
      id = match ? parseInt(match[1]) : 1;
    } else if (email === "doctor@test.com") {
      role = "doctor";
      id = 1;
    }

    const userData = { email, role, id };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  Applied fuzzy match at line 18-31.
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