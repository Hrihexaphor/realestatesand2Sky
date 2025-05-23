import { useEffect, useState } from 'react';
import { User, Plus, Edit3, Trash2, Shield, Mail, UserCheck, Crown, Users, Search, Filter, Eye, EyeOff } from 'lucide-react';

// Mock data and functions to simulate the original functionality
const BASE_URL = 'https://api.example.com';
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

const mockPermissions = [
  { value: 'read_posts', label: 'Read Posts' },
  { value: 'write_posts', label: 'Write Posts' },
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'analytics', label: 'View Analytics' },
  { value: 'reports', label: 'Generate Reports' },
  { value: 'settings', label: 'System Settings' }
];

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'admin', permissions: [] },
  { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'manager', permissions: ['read_posts', 'write_posts'] },
  { id: 3, name: 'Carol Davis', email: 'carol@company.com', role: 'user', permissions: ['read_posts'] },
  { id: 4, name: 'David Wilson', email: 'david@company.com', role: 'manager', permissions: ['read_posts', 'analytics'] }
];

const mockSession = { user: { role: 'admin' } };

const initialForm = { name: '', email: '', password: '', role: '', permissions: [] };

const UserManager = () => {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState(mockUsers);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const permissions = mockPermissions;
  const session = mockSession;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingUserId) {
      setUsers(prev => prev.map(user => 
        user.id === editingUserId 
          ? { ...user, ...formData, id: editingUserId }
          : user
      ));
    } else {
      const newUser = { ...formData, id: Date.now() };
      setUsers(prev => [...prev, newUser]);
    }
    
    resetForm();
    setIsLoading(false);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions || [],
    });
    setEditingUserId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingUserId(null);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'manager': return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'manager': return 'bg-gradient-to-r from-blue-400 to-purple-500 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white';
    }
  };

  if (!session?.user?.role || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-red-200/50">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-red-500">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">Manage your team members and their permissions</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) resetForm();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                       text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/80 
                         focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl bg-white/80 
                         focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 min-w-[150px]"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8 
                        transform transition-all duration-500 animate-in slide-in-from-top-4">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/50 
                               focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/50 
                               focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={editingUserId ? 'Leave blank to keep current password' : 'Enter password'}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl bg-white/50 
                               focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUserId}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/50 
                               focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      {Object.values(USER_ROLES).map((role) => (
                        <option key={role} value={role} className="capitalize">{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {(formData.role && formData.role !== USER_ROLES.ADMIN) && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Permissions</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((perm) => (
                      <label key={perm.value} 
                             className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 border border-gray-200 
                                      hover:bg-white/80 cursor-pointer transition-all duration-200 hover:shadow-md">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.value)}
                          onChange={() => handlePermissionToggle(perm.value)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-700">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                           text-white px-8 py-3 rounded-2xl font-medium transition-all duration-300 
                           transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
                           flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{editingUserId ? 'Update User' : 'Add User'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-medium 
                           transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-800">All Users ({filteredUsers.length})</h3>
            <p className="text-gray-600 text-sm mt-1">Manage your team members and their access levels</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-full">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions?.length > 0 ? (
                            user.permissions.slice(0, 2).map((perm) => (
                              <span key={perm} className="inline-flex px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-800">
                                {permissions.find(p => p.value === perm)?.label || perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No permissions</span>
                          )}
                          {user.permissions?.length > 2 && (
                            <span className="inline-flex px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600">
                              +{user.permissions.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 
                                     hover:bg-blue-50 p-2 rounded-lg"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 
                                     hover:bg-red-50 p-2 rounded-lg"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;