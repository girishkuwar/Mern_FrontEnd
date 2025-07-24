import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import UserList from '../pages/UserList'
import UploadList from '../pages/UploadList'

const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
      <div className="text-2xl font-semibold text-white-500">Welcome to the Admin Dashboard</div>
        <nav>
          <ul className="space-y-8">
            <li><Link to="" className="hover:text-yellow-400">Dashboard</Link></li>
            <li><Link to="/admin/users" className="hover:text-yellow-400">Users</Link></li>
            <li><Link to="/admin/uploads" className="hover:text-yellow-400">Uploads</Link></li>
            <li><Link to="/admin/settings" className="hover:text-yellow-400">Settings</Link></li>
            <li>
              <button onClick={handleLogout} className="hover:text-yellow-500 w-full text-left">Log Out</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="/" element={ <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600">120</p>
        </div>

        {/* Total Uploads */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Uploads</h2>
          <p className="text-3xl font-bold text-green-600">430</p>
        </div>

        {/* Active Users */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-orange-500">87</p>
        </div>
      </div>
    </div>} />
          <Route path="users" element={<UserList />} />
          <Route path="uploads" element={<UploadList />} />
          <Route path="settings" element={<div>Settings Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
