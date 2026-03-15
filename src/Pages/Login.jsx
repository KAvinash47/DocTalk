import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      login(email);

      if (email === "doctor@test.com") {
        navigate("/dashboard");
      } else {
        navigate("/my-bookings");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          DocTalk Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer text-sm text-blue-500"
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-blue-600 text-white py-2 rounded flex justify-center items-center">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Login"
          )}
        </button>

        {/* DEMO USERS */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Demo Accounts: <br />
          Doctor → doctor@test.com <br />
          Patient → patient@test.com
        </p>
      </form>

    </div>
  );
};

export default Login;