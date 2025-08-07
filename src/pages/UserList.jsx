import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update UI immediately
      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert("Error updating user role.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-gray-500 p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-auto max-h-[500px] border rounded-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Uploaded Files</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.uploadCount || 0}</td>
                  <td className="px-4 py-2">
                    {user.role === 'admin' && user.canCreateAdmin ? (
                      <span className="text-indigo-600 font-medium">Super Admin</span>
                    ) : (
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.role === 'admin' && user.canCreateAdmin ? (
                      <span className="text-gray-400 text-xs">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Remove
                      </button>
                    )}
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

export default UserList;
