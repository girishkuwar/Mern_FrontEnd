import React from 'react'

const Dashboard = () => {
  return (
    <div>Dashboard
      <div className="text-2xl font-bold text-blue-600">Hello Tailwind!</div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click Me
</button>
      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  )
}

export default Dashboard