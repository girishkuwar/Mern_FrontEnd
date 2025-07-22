import React from 'react'

const Dashboard = () => {
  return (
    <div>Dashboard

      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  )
}

export default Dashboard