import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaMoon, FaSun, FaBell, FaUserCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import API from "../services/api";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left */}

        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <FaRobot className="text-white text-2xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              DocuTrust AI
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              AI Powered Document Intelligence
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-4">
          {/* Notification */}

          <button className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 hover:scale-110 transition">
            <FaBell />
          </button>

          {/* Dark Mode */}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 hover:scale-110 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* AI Ready */}

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900">
            <MdVerified className="text-green-600 dark:text-green-400 text-lg" />

            <span className="text-green-700 dark:text-green-300 font-medium">
              AI Ready
            </span>
          </div>

          {/* User */}

          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
            <FaUserCircle className="text-3xl text-blue-600" />

            <div>
              <h3 className="font-semibold dark:text-white">{user.username}</h3>

              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Logout */}

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
