import { BrowserRouter, Route, Routes } from 'react-router'
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExcelGraphUploader from "./pages/ExcelGraphUploader";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from './dashboard/Dashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import ThreedGraph from './pages/ThreedGraph';
import Layout from './layouts/Layout';
import About from './pages/About';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/exel" element={<ProtectedRoute><ExcelGraphUploader /></ProtectedRoute>} />
          <Route path="/exel/:id" element={<ProtectedRoute><ExcelGraphUploader /></ProtectedRoute>} />
          <Route path="/3dexel" element={<ProtectedRoute><ThreedGraph /></ProtectedRoute>} />
          </Route>
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
