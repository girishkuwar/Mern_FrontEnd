import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const fetchUserUploads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/excel/getsheets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setUploadHistory(res.data);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserUploads();
  }, []);
  return (<>
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">📊 User Dashboard</h1>
      <button
        onClick={() => (nav('/exel'))}
        className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 transition"
      >
        ➕ Add New Chart
      </button>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Upload History</h2>
        {
          loading ? (
            <p>Loading uploads....</p>
          ) : uploadHistory.length === 0 ? (
            <p>No uploads found</p>
          ) : (


            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Filename</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Uploaded At</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Analysis Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uploadHistory.map((item, index) => (
                  <tr key={item._id} className="text-center">
                    <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-blue-600 font-medium">{item.fileName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(item.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.analysis || 'No summary'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>



    <button className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }}>Logout</button>
  </>
  )
}

export default Dashboard