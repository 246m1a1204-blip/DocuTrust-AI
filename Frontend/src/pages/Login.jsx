import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaRobot } from "react-icons/fa";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);

      toast.success("Welcome Back!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 top-0 left-0 animate-pulse"></div>

      <div className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 bottom-0 right-0 animate-pulse"></div>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="relative w-[420px] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <FaRobot className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-gray-300 text-center mt-2 mb-8">
          Login to DocuTrust AI
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-5 rounded-xl bg-white/20 p-4 text-white outline-none placeholder-gray-300"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl bg-white/20 p-4 text-white outline-none placeholder-gray-300"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-5 text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:scale-105 transition"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-300 font-semibold">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
