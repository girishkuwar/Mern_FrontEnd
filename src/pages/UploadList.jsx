import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import moment from 'moment';

const UploadList = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/uploads', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUploads(res.data || []);
    } catch (err) {
      console.error('Failed to fetch uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading uploads...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload History</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <div className="overflow-auto max-h-[600px] border rounded-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2">File Name</th>
                <th className="px-4 py-2">Uploaded By</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Rows</th>
                <th className="px-4 py-2">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {uploads.map(upload => (
                <tr key={upload._id}>
                  <td className="px-4 py-2">{upload.fileName}</td>
                  <td className="px-4 py-2">{upload.user?.username || 'N/A'}</td>
                  <td className="px-4 py-2">{upload.user?.email || 'N/A'}</td>
                  <td className="px-4 py-2">{upload.data?.length || 0}</td>
                  <td className="px-4 py-2">
                    {upload.uploadedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadList;
