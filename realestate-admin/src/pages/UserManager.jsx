import { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_ROLES } from '../config';
// import { BASE_URL } from '../config';
import { useSession } from '../providers/SessionProvider';
import { toast } from 'react-toastify';

const UserManager = () => {
  const { session } = useSession();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [users, setUsers] = useState([]);
    const BASE_URL = 'http://localhost:3001'; // Change this to your backend URL
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/alluser`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/signup`, formData);
      toast.success('User added successfully');
      setFormData({ name: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
    }
  };
  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;
  try {
    await axios.delete(`${BASE_URL}/api/user/${id}`);
    toast.success('User deleted');
    fetchUsers(); // refresh list
  } catch (err) {
    toast.error('Error deleting user');
  }
};


  if (!session?.user?.role || session.user.role !== 'admin') {
    return <p className="text-center text-red-500 font-semibold mt-8">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add User</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <select
          className="w-full px-4 py-2 border rounded"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="">Select Role</option>
          {Object.values(USER_ROLES).map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Add User
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-4">All Users</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">slno</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border capitalize"><button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                        >
                        Delete
                        </button></td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
