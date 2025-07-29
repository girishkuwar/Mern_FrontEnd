import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const nav = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div><nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M9 17V9m4 8V5m4 8v4" />
            </svg>
            <span class="text-xl font-bold text-gray-800 tracking-tight">Charter</span>
          </div>

          <div class="hidden md:flex space-x-8 text-sm font-medium">
            <div class="text-gray-700 hover:text-blue-600 transition duration-300"><Link to={"/"} >Home</Link></div>
            <div class="text-gray-700 hover:text-blue-600 transition duration-300"><Link to={"/dashboard"} >Dashboard</Link></div>
            <div class="text-gray-700 hover:text-blue-600 transition duration-300"><Link to={"/exel"} >Upload</Link></div>
            <div class="text-gray-700 hover:text-blue-600 transition duration-300"><Link to={"/about"} >About</Link></div>
          </div>

          <div class="hidden md:flex items-center space-x-4">
            {
              user ? <div className="hidden md:flex items-center space-x-4">
                {/* User Dropdown */}
                <div className="relative group inline-block text-left">
                  <div className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full cursor-pointer">
                    hi! {user.username}
                  </div>

                  <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <button
                      onClick={() => {localStorage.clear(); nav("/")}}
                      className="text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div> :
                  <button onClick={() => { nav("/")}} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition">Login</button>
            }
          </div>

          <div class="md:hidden flex items-center">
            <button class="text-gray-700 hover:text-blue-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    </div>
  )
}

export default Header