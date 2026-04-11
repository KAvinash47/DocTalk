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

      if (email.startsWith("doctor") && email.includes("@")) {
        navigate("/dashboard");
      } else {
        navigate("/my-bookings");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 px-4 dark:from-slate-900 dark:to-slate-800">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-2xl border border-transparent dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400 uppercase tracking-tight">
          DocTalk Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border dark:border-slate-700 p-3 mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-900 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full border dark:border-slate-700 p-3 mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-900 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer text-sm text-blue-500 font-bold"
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-lg flex justify-center items-center shadow-lg active:scale-95 transition-all">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "LOGIN"
          )}
        </button>

        {/* DEMO USERS */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-gray-500 dark:text-slate-500 text-center font-black uppercase tracking-widest">
              Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded text-[9px] text-slate-600 dark:text-slate-400 font-bold border border-slate-100 dark:border-slate-800">
                    Dr. Sarah: <br/> doctor1@test.com
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded text-[9px] text-slate-600 dark:text-slate-400 font-bold border border-slate-100 dark:border-slate-800">
                    Dr. Michael: <br/> doctor2@test.com
                </div>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-bold">
                Patient: patient@test.com
            </p>
        </div>
      </form>

    </div>
  );
};

export default Login;
