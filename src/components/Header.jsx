import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import useAuth from "../Hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";


const Header = ({ footerRef }) => {
  const user = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const scrollToFooter = () => {
    footerRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-3">
          <img src={logo} className="h-10" alt="EmpIQ" />
          <span className="text-2xl font-semibold dark:text-white">EmpIQ</span>
        </Link>

        {/* Navigation */}
        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <Link to="/home" className="text-gray-700 hover:text-blue-600 dark:text-white">
              Home
            </Link>
          </li>
          <li>
            <button onClick={scrollToFooter} className="text-gray-700 hover:text-blue-600 dark:text-white">
              About
            </button>
          </li>
          <li>
            <button onClick={scrollToFooter} className="text-gray-700 hover:text-blue-600 dark:text-white">
              Contact
            </button>
          </li>
        </ul>

        {/* User Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={
                  user.photoURL ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjVVGbbUVwxs-XddkRNkny7S3r5UT-qS5quA&s"
                }
                alt="User"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;