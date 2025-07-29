import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user)); // user has role info
    res.data.user.role === "admin" ? nav("/admin") : nav("/dashboard");
  };

  return (
    <div>
      <div style={{
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: `url('/bg.png')`
    }} className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <img src={logo} className="w-20 md:w-32 lg:w-40 mx-auto mb-4" alt="" />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account? <a href="/register" onClick={() => { nav("/register") }} className="text-blue-500 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
