import React from 'react'

const Dashboard = () => {
  return (
    <div>Dashboard

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  )
}

export default Dashboard