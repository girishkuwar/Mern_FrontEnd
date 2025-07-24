import { BrowserRouter, Route, Routes } from 'react-router'
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExcelGraphUploader from "./pages/ExcelGraphUploader";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from './dashboard/Dashboard';
import AdminDashboard from './dashboard/AdminDashboard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/exel" element={<ProtectedRoute><ExcelGraphUploader /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
