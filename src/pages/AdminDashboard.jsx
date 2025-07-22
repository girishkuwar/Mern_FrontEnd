import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/admin/uploads", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUploads(res.data))
    .catch(err => {
      console.error(err);
      setError("Failed to load upload history");
    });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard - Upload History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Uploaded By</th>
            <th>Email</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(upload => (
            <tr key={upload._id}>
              <td>{upload.filename}</td>
              <td>{upload.uploadedBy?.username}</td>
              <td>{upload.uploadedBy?.email}</td>
              <td>{new Date(upload.uploadedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
