import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import UserList from '../pages/UserList';
import UploadList from '../pages/UploadList';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalUploads: 0
  });

  const [loading, setLoading] = useState(true);
  const location = useLocation(); // for active nav highlight

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-gray-500 p-10">Loading dashboard...</div>;
  }

  const navItemClass = (path) =>
    location.pathname === path
      ? "text-yellow-400 font-semibold"
      : "hover:text-yellow-400";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <div className="text-2xl font-semibold mb-6">Admin Dashboard</div>
        <nav>
          <ul className="space-y-6">
            <li><Link to="/admin" className={navItemClass("/admin")}>Dashboard</Link></li>
            <li><Link to="/admin/users" className={navItemClass("/admin/users")}>Users</Link></li>
            <li><Link to="/admin/uploads" className={navItemClass("/admin/uploads")}>Uploads</Link></li>
            <li><Link to="/admin/settings" className={navItemClass("/admin/settings")}>Settings</Link></li>
            <li>
              <button onClick={handleLogout} className="hover:text-yellow-500 w-full text-left">Log Out</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Routes>
          <Route path="/" element={
            <div>
              <h1 className="text-2xl font-bold mb-6 text-gray-700">Dashboard Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={stats.totalUsers} color="indigo" />
                <StatCard label="Total Uploads" value={stats.totalUploads} color="green" />
                <StatCard label="Active Users" value={stats.activeUsers} color="orange" />
              </div>
              <h2 className="text-xl font-bold mt-10 mb-4 text-gray-700">Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users Bar Chart */}
                <div className="bg-white shadow-md rounded-2xl p-6">
                  <h3 className="text-md font-semibold text-gray-600 mb-4">User Overview</h3>
                  <Bar
                    data={{
                      labels: ['Total Users', 'Active Users'],
                      datasets: [
                        {
                          label: 'Users',
                          data: [stats.totalUsers, stats.activeUsers],
                          backgroundColor: ['#6366f1', '#f97316']
                        }
                      ]
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } } }}
                  />
                </div>

                {/* Upload Line Chart (Mocked Time Series) */}
                <div className="bg-white shadow-md rounded-2xl p-6">
                  <h3 className="text-md font-semibold text-gray-600 mb-4">Uploads Over Time</h3>
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Uploads',
                          data: [5, 12, 9, 20, 25, stats.totalUploads],
                          fill: false,
                          borderColor: '#22c55e',
                          tension: 0.4
                        }
                      ]
                    }}
                    options={{ responsive: true }}
                  />
                </div>
              </div>

            </div>
          } />
          <Route path="users" element={<UserList />} />
          <Route path="uploads" element={<UploadList />} />
          <Route path="settings" element={<div>Settings Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
    <h2 className="text-lg font-semibold text-gray-600 mb-2">{label}</h2>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default AdminDashboard;
