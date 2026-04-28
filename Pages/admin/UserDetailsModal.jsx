import React from "react";
import {
  Ban,
  CheckCircle,
  Trash2,
  X,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Award,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
const UserDetailsModal = ({ user, onClose, onToggleBlock, onDeleteUser }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const toggleBlock = async (user) => {
    try {
      const newStatus = !user.isBlocked;

      await axiosInstance.put(
        `/api/AdminUser/block/${user.id}?status=${newStatus}`,
      );

      console.log("UPDATED STATUS:", newStatus);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: newStatus } : u,
        ),
      );
    } catch (err) {
      console.error("Block error:", err);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-3xl w-full border border-white/20 shadow-2xl overflow-hidden">
        <div className="bg-black/50 backdrop-blur-lg border-b border-white/10 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              User Details
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              View and manage user information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <X
              size={20}
              className="text-gray-400 hover:text-white transition-colors"
            />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-2 border-white/20">
                    <span className="text-white text-2xl font-bold">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`}
                  ></div>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {user.username}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={14} className="text-gray-400" />
                    <p className="text-gray-300 text-sm">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone size={14} className="text-gray-400" />
                      <p className="text-gray-300 text-sm">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-white/5 rounded-lg px-3 py-2 text-center min-w-[100px]">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    Role
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      user.role === "Admin" || user.role === "admin"
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {user.role || "User"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg px-3 py-2 text-center min-w-[100px]">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    Status
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      user.isBlocked ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </p>
                </div>

                {user.lastOrderDate && (
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-center min-w-[130px]">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">
                      Last Order
                    </p>
                    <p className="text-sm font-semibold text-gray-300 mt-1">
                      {formatDate(user.lastOrderDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-white mt-2 group-hover:scale-105 transition-transform">
                    {user.totalOrders || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ShoppingBag className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-white mt-2 group-hover:scale-105 transition-transform">
                    {formatCurrency(user.totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* ADDITIONAL INFO IF AVAILABLE */}
          {(user.address || user.city || user.state) && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 mb-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" />
                Shipping Address
              </h3>
              <div className="text-gray-300 text-sm space-y-1">
                {user.address && <p>{user.address}</p>}
                {user.city && user.state && (
                  <p>
                    {user.city}, {user.state} {user.zipCode || ""}
                  </p>
                )}
                {user.country && <p>{user.country}</p>}
              </div>
            </div>
          )}

          {/* RECENT ORDERS SECTION (if you have order data) */}
          {user.recentOrders && user.recentOrders.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag size={18} className="text-gray-400" />
                Recent Orders
              </h3>
              <div className="space-y-2">
                {user.recentOrders.map((order, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        Order #{order.id}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBER SINCE */}
          {user.createdAt && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                <Calendar size={12} />
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
