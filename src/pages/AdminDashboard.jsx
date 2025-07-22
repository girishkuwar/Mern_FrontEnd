import React from 'react'

const AdminDashboard = () => {
  return (
    <div>AdminDashboard

      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  )
}

export default AdminDashboard