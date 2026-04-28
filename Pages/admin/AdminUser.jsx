import React, { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Users,
  Shield,
  User,
  Search,
  Filter,
  X,
} from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";
import axiosInstance from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://localhost:7096/api/AdminUser";

// Custom toast configurations
const toastConfig = {
  success: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#ffffff" },
    icon: "✓",
  },
  error: {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#fca5a5" },
    icon: "⚠",
  },
  delete: {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    style: {
      background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
      color: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #ef4444",
      fontWeight: "600",
      fontSize: "14px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      padding: "14px 20px",
      letterSpacing: "0.3px",
    },
    progressStyle: { background: "#ef4444", height: "4px" },
    icon: "🗑️",
  },
  warning: {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#fde68a" },
    icon: "⚠️",
  },
  info: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#bfdbfe" },
    icon: "ℹ️",
  },
};

const AdminUsers = ({ isDark = true }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(false);

  // Theme-based classes
  const bgClass = isDark ? "bg-gradient-to-br from-gray-100 via-white to-gray-100" : "bg-gradient-to-br from-gray-900 via-black to-gray-900";
  const cardBgClass = isDark ? "bg-white" : "bg-white/5";
  const borderClass = isDark ? "border-gray-200" : "border-white/20";
  const textPrimaryClass = isDark ? "text-gray-900" : "text-white";
  const textSecondaryClass = isDark ? "text-gray-500" : "text-gray-400";
  const inputBgClass = isDark ? "bg-gray-50" : "bg-black/50";
  const inputBorderClass = isDark ? "border-gray-200" : "border-gray-700";
  const tableHeaderBgClass = isDark ? "bg-gray-100" : "bg-black/90";

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (roleFilter !== "All Roles") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "All Status") {
      if (statusFilter === "Active") {
        filtered = filtered.filter((u) => !u.isBlocked);
      } else if (statusFilter === "Blocked") {
        filtered = filtered.filter((u) => u.isBlocked);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "username") {
          aValue = aValue?.toLowerCase() || "";
          bValue = bValue?.toLowerCase() || "";
        } else if (sortConfig.key === "isBlocked") {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        } else {
          aValue = aValue || "";
          bValue = bValue || "";
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/AdminUser/viewalluser");
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err.response || err);
      toast.error("Failed to load users", toastConfig.error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (user) => {
    try {
      const res = await axiosInstance.get(`/api/AdminUser/detaileduser/${user.id}`);
      setSelectedUser(res.data.data || res.data);
      setShowDetails(true);
      toast.info(`Loading details for ${user.username}`, toastConfig.info);
    } catch (err) {
      console.error("Details error:", err);
      toast.error("Failed to load user details", toastConfig.error);
    }
  };

  const toggleBlock = async (user) => {
    try {
      await axiosInstance.put(`/api/AdminUser/block/${user.id}?status=${!user.isBlocked}`);
      const action = user.isBlocked ? "unblocked" : "blocked";
      const message = `User ${user.username} has been ${action} successfully`;

      if (!user.isBlocked) {
        toast.warning(message, toastConfig.warning);
      } else {
        toast.success(message, toastConfig.success);
      }
      fetchUsers();
    } catch (err) {
      console.error("Block error:", err);
      toast.error("Failed to update user status", toastConfig.error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const userToDelete = users.find((u) => u.id === id);
      await axiosInstance.patch(`/api/AdminUser/softdelete/${id}`);
      toast.error(`User ${userToDelete?.username || ""} has been permanently deleted`, toastConfig.delete);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user", toastConfig.error);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
  };

  const uniqueRoles = ["All Roles", ...new Set(users.map((user) => user.role).filter(Boolean))];
  const adminCount = users.filter((u) => u.role === "Admin" || u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "User" || u.role === "user").length;
  const activeCount = users.filter((u) => !u.isBlocked).length;

  if (loading && users.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-100" : "bg-black"} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-gray-600" : "border-white"} mx-auto mb-4`}></div>
          <p className={isDark ? "text-gray-600" : "text-white"}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover toastClassName="custom-toast" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${isDark ? "from-gray-800 to-gray-500" : "from-white to-gray-400"} bg-clip-text text-transparent`}>
            User Management
          </h1>
          <p className={`${textSecondaryClass} mt-2`}>Manage all user accounts and permissions</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={users.length} isDark={isDark} />
          <StatCard icon={<Shield className="w-6 h-6" />} label="Admins" value={adminCount} isDark={isDark} />
          <StatCard icon={<User className="w-6 h-6" />} label="Regular Users" value={userCount} isDark={isDark} />
          <StatCard icon={<div className={`w-3 h-3 rounded-full ${activeCount > 0 ? "bg-green-400" : "bg-gray-600"} animate-pulse`} />} label="Active Users" value={activeCount} isDark={isDark} />
        </div>

        {/* SEARCH + FILTERS */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 border ${borderClass}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`}
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={16} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`pl-9 pr-8 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} appearance-none cursor-pointer focus:outline-none focus:border-white transition-colors`}
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ROLE TABS */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl p-2 mb-6 border ${borderClass}`}>
          <div className="flex flex-wrap gap-2">
            <TabButton active={roleFilter === "All Roles"} onClick={() => setRoleFilter("All Roles")} label="All Roles" count={users.length} isDark={isDark} />
            <TabButton active={roleFilter === "Admin"} onClick={() => setRoleFilter("Admin")} label="Admin" count={adminCount} icon={<Shield size={14} />} isDark={isDark} />
            <TabButton active={roleFilter === "User"} onClick={() => setRoleFilter("User")} label="User" count={userCount} icon={<User size={14} />} isDark={isDark} />
          </div>
        </div>

        {/* USERS TABLE */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl border ${borderClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className={`sticky top-0 ${tableHeaderBgClass} backdrop-blur-lg border-b ${borderClass}`}>
                  <tr className={`text-xs uppercase tracking-wider ${textSecondaryClass}`}>
                    <th className="p-4 text-left cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort("username")}>
                      <div className="flex items-center gap-1">USER {getSortIcon("username")}</div>
                    </th>
                    <th className="p-4 text-left cursor-pointer hover:bg-white/5 transition-colors hidden sm:table-cell" onClick={() => requestSort("role")}>
                      <div className="flex items-center gap-1">ROLE {getSortIcon("role")}</div>
                    </th>
                    <th className="p-4 text-left cursor-pointer hover:bg-white/5 transition-colors" onClick={() => requestSort("isBlocked")}>
                      <div className="flex items-center gap-1">STATUS {getSortIcon("isBlocked")}</div>
                    </th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-100" : "divide-white/10"}`}>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:${isDark ? "bg-gray-50" : "bg-white/5"} transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${isDark ? "from-gray-200 to-gray-300" : "from-gray-700 to-gray-900"} text-${isDark ? "gray-700" : "white"} flex items-center justify-center rounded-xl text-sm font-semibold border ${borderClass}`}>
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-medium ${textPrimaryClass}`}>{user.username}</p>
                            <p className={`text-xs ${textSecondaryClass}`}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.role === "Admin" || user.role === "admin" ? (isDark ? "bg-gray-200 text-gray-800 border border-gray-300" : "bg-white/10 text-white border border-white/20") : (isDark ? "bg-gray-100 text-gray-600 border border-gray-200" : "bg-gray-800 text-gray-300 border border-gray-700")}`}>
                          {user.role}
                        </span>
                       </td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.isBlocked ? (isDark ? "bg-red-100 text-red-700 border border-red-200" : "bg-red-900/50 text-red-300 border border-red-700") : (isDark ? "bg-green-100 text-green-700 border border-green-200" : "bg-green-900/50 text-green-300 border border-green-700")}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                       </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => viewDetails(user)} className={`p-1.5 ${textSecondaryClass} hover:${textPrimaryClass} transition-colors`} title="View Details">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => toggleBlock(user)} className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${user.isBlocked ? "text-green-400 hover:text-green-300 hover:bg-green-400/10" : "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"}`} title={user.isBlocked ? "Unblock User" : "Block User"}>
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button onClick={() => setDeleteConfirm(user.id)} className={`p-1.5 ${textSecondaryClass} hover:text-red-400 transition-colors`} title="Delete User">
                            <Trash2 size={16} />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className={`w-16 h-16 ${isDark ? "text-gray-300" : "text-gray-600"} mx-auto mb-4`} />
              <p className={`text-lg ${textSecondaryClass}`}>No Users Found</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* RESULTS COUNT */}
        <div className="mt-4 flex justify-between items-center">
          <p className={`text-sm ${textSecondaryClass}`}>
            Showing <span className={`font-medium ${textPrimaryClass}`}>{filteredUsers.length}</span> of <span className={`font-medium ${textPrimaryClass}`}>{users.length}</span> users
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className={`text-sm ${textSecondaryClass} hover:${textPrimaryClass} transition-colors flex items-center gap-1`}>
              <X size={14} /> Clear search
            </button>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`bg-gradient-to-br ${isDark ? "from-gray-100 to-white" : "from-gray-900 to-black"} rounded-2xl max-w-md w-full border ${borderClass} shadow-2xl`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textPrimaryClass}`}>Confirm Delete</h3>
                  <p className={`text-sm ${textSecondaryClass}`}>This action cannot be undone</p>
                </div>
              </div>
              <p className={`${isDark ? "text-gray-600" : "text-gray-300"} mb-6`}>Are you sure you want to delete this user? All associated data will be permanently removed.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className={`px-4 py-2 text-sm font-medium ${textSecondaryClass} ${cardBgClass} rounded-xl hover:bg-white/20 transition-colors`}>
                  Cancel
                </button>
                <button onClick={() => deleteUser(deleteConfirm)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL - Pass isDark to modal */}
      {showDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowDetails(false)}
          onToggleBlock={toggleBlock}
          onDeleteUser={deleteUser}
          isDark={isDark}
        />
      )}
    </div>
  );
};

// STAT CARD COMPONENT
const StatCard = ({ icon, label, value, isDark }) => (
  <div className={`group ${isDark ? "bg-white" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-gray-200" : "border-white/20"} hover:border-white/40 transition-all duration-300 hover:scale-105`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
        <p className={`text-2xl sm:text-3xl font-bold mt-2 ${isDark ? "text-gray-900" : "text-white"}`}>{value}</p>
      </div>
      <div className={`${isDark ? "text-gray-400 group-hover:text-gray-600" : "text-gray-400 group-hover:text-white"} transition-colors`}>{icon}</div>
    </div>
  </div>
);

// TAB BUTTON COMPONENT
const TabButton = ({ active, onClick, label, count, icon, isDark }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      active ? (isDark ? "bg-black text-white" : "bg-white text-black") : (isDark ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white")
    }`}
  >
    {icon && icon}
    {label}
    <span className={`text-xs px-2 py-0.5 rounded-full ${active ? (isDark ? "bg-gray-700 text-white" : "bg-black/10 text-black") : (isDark ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400")}`}>
      {count}
    </span>
  </button>
);

export default AdminUsers;