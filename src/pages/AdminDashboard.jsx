import React from 'react'

const AdminDashboard = () => {
  return (
    <div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-5">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-yellow-400">Dashboard</a></li>
              <li><a href="#" className="hover:text-yellow-400">Users</a></li>
              <li><a href="#" className="hover:text-yellow-400">Uploads</a></li>
              <li><a href="#" className="hover:text-yellow-400">Settings</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 bg-gray-100">
          <h1 className="text-3xl font-semibold mb-4">Welcome, Admin!</h1>
          <p className="text-gray-700">Here’s a quick overview of the system activity.</p>
          {/* Add stats, charts, tables here */}
        </main>
      </div>
      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  )
}

export default AdminDashboard