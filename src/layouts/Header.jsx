import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.clear();
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavClick = (path) => {
    nav(path);
    setMenuOpen(false); // Close mobile menu
  };

  return (
    <div>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M9 17V9m4 8V5m4 8v4" />
              </svg>
              <span className="text-xl font-bold text-gray-800 tracking-tight">Charter</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <Link className="text-gray-700 hover:text-blue-600 transition duration-300" to="/">Home</Link>
              <Link className="text-gray-700 hover:text-blue-600 transition duration-300" to="/dashboard">Dashboard</Link>
              <Link className="text-gray-700 hover:text-blue-600 transition duration-300" to="/exel">Upload</Link>
              <Link className="text-gray-700 hover:text-blue-600 transition duration-300" to="/about">About</Link>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative group inline-block text-left">
                  <div className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full cursor-pointer">
                    hi! {user.username}
                  </div>
                  <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <button
                      onClick={logout}
                      className="text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => nav("/")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition">Login</button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-2 space-y-2 bg-white border-t border-gray-200">
            <button className="block text-gray-700 hover:text-blue-600" onClick={() => handleNavClick('/')}>Home</button>
            <button className="block text-gray-700 hover:text-blue-600" onClick={() => handleNavClick('/dashboard')}>Dashboard</button>
            <button className="block text-gray-700 hover:text-blue-600" onClick={() => handleNavClick('/exel')}>Upload</button>
            <button className="block text-gray-700 hover:text-blue-600" onClick={() => handleNavClick('/about')}>About</button>
            {user ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full text-left text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('/')}
                className="bg-blue-600 w-full text-white px-4 py-2 rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
