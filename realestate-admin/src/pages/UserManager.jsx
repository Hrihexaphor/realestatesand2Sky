import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, ROUTES, USER_ROLES } from '../config';
import { useSession } from '../providers/SessionProvider';
import { toast } from 'react-toastify';
import { getTopLevelPermissions } from '../helpers/routes';

const initialForm = { name: '', email: '', password: '', role: '', permissions: [] };

const permissions = getTopLevelPermissions(ROUTES);

const UserManager = () => {
  const { session } = useSession();
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermissionToggle = (perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        // Update user
        await axios.put(`${BASE_URL}/api/users/${editingUserId}`, formData, { withCredentials: true });
        toast.success('User updated successfully');
      } else {
        // Create user
        await axios.post(`${BASE_URL}/api/users/signup`, formData, { withCredentials: true });
        toast.success('User added successfully');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Do not pre-fill passwords
      role: user.role,
      permissions: user.permissions || [],
    });
    setEditingUserId(user.id);
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingUserId(null);
  };

  if (!session?.user?.role || session.user.role !== 'admin') {
    return <p className="text-center text-red-500 font-semibold mt-8">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{editingUserId ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder={editingUserId ? 'Leave blank to keep current password' : 'Password'}
          className="w-full px-4 py-2 border rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editingUserId}
        />
        <select
          className="w-full px-4 py-2 border rounded"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="" disabled>Select Role</option>
          {Object.values(USER_ROLES).map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        {(formData.role && formData.role !== USER_ROLES.ADMIN) && (
          <div className="mt-2">
            <label className="block mb-1 font-medium">Select Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {permissions.map((perm) => (
                <label key={perm.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.value)}
                    onChange={() => handlePermissionToggle(perm.value)}
                  />
                  <span className="text-sm">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {editingUserId ? 'Update User' : 'Add User'}
          </button>
          {editingUserId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-4">All Users</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Sl No</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border flex space-x-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
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
