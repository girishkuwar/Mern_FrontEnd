import React, { useEffect, useState } from 'react';


const Dashboard = () => {
  const [uploadHistory, setUploadHistory] = useState([]);
  const mockUploads = [
    { id: 1, filename: 'sales_data.xlsx', uploadedAt: '2025-07-21', analysis: 'Bar Chart of Sales vs Region' },
    { id: 2, filename: 'inventory.xlsx', uploadedAt: '2025-07-22', analysis: 'Line Chart of Stock Trends' },
    { id: 3, filename: 'employee.xlsx', uploadedAt: '2025-07-23', analysis: 'Pie Chart of Department Count' },
  ];


  useEffect(() => {
    // Simulating fetch from backend/database
    setUploadHistory(mockUploads);
  }, []);
  return (<>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 User Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Upload History</h2>
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Filename</th>
              <th className="px-4 py-2 border">Uploaded At</th>
              <th className="px-4 py-2 border">Analysis Summary</th>
            </tr>
          </thead>
          <tbody>
            {uploadHistory.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.filename}</td>
                <td className="px-4 py-2 border">{item.uploadedAt}</td>
                <td className="px-4 py-2 border">{item.analysis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>



    <button onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }}>Logout</button>
  </>
  )
}

export default Dashboard