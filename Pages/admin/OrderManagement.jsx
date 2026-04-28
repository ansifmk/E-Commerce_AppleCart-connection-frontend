import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import {
  Search,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  X,
  ChevronDown,
  Eye,
  Filter,
  ArrowUpDown,
  Clock,
  ShoppingBag,
  Edit,
  Rocket,
  Gift,
  Ban,
  AlertCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom toast configurations for different statuses
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
  },
  pending: {
    position: "top-right",
    autoClose: 3000,
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
  },
  confirmed: {
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
  },
  packed: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#c4b5fd" },
  },
  shipped: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      color: "#ffffff",
      borderRadius: "12px",
      border: "none",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "12px 16px",
    },
    progressStyle: { background: "#a5f3fc" },
  },
  delivered: {
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
    progressStyle: { background: "#a7f3d0" },
  },
  cancelled: {
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
  },
};

const OrderManagement = ({ isDark = true }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  // Theme-based classes
  const bgClass = isDark ? "bg-gradient-to-br from-gray-100 via-white to-gray-100" : "bg-gradient-to-br from-gray-900 via-black to-gray-900";
  const cardBgClass = isDark ? "bg-white" : "bg-white/5";
  const borderClass = isDark ? "border-gray-200" : "border-white/20";
  const textPrimaryClass = isDark ? "text-gray-900" : "text-white";
  const textSecondaryClass = isDark ? "text-gray-500" : "text-gray-400";
  const inputBgClass = isDark ? "bg-gray-50" : "bg-black/50";
  const inputBorderClass = isDark ? "border-gray-200" : "border-gray-700";
  const tableHeaderBgClass = isDark ? "bg-gray-100" : "bg-black/90";

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/Order/UpdateStatus/${orderId}?status=${newStatus}`);

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));

      const statusMessages = {
        Pending: "Order is now pending",
        Confirmed: "Order has been confirmed",
        Packed: "Order has been packed",
        Shipped: "Order has been shipped",
        Delivered: "Order has been delivered",
        Cancelled: "Order has been cancelled",
      };

      const statusIcons = {
        Pending: <Clock className="w-5 h-5" />,
        Confirmed: <CheckCircle className="w-5 h-5" />,
        Packed: <Package className="w-5 h-5" />,
        Shipped: <Rocket className="w-5 h-5" />,
        Delivered: <Gift className="w-5 h-5" />,
        Cancelled: <Ban className="w-5 h-5" />,
      };

      const toastConfigs = {
        Pending: toastConfig.pending,
        Confirmed: toastConfig.confirmed,
        Packed: toastConfig.packed,
        Shipped: toastConfig.shipped,
        Delivered: toastConfig.delivered,
        Cancelled: toastConfig.cancelled,
      };

      toast(<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">{statusIcons[newStatus]}</div><div><p className="font-semibold text-white text-sm">Status Updated</p><p className="text-white/80 text-xs">{statusMessages[newStatus]}</p></div></div>, toastConfigs[newStatus] || toastConfig.success);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status", toastConfig.error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Order/GetAllOrders");
      const ordersData = res.data?.data?.data || res.data?.data || res.data || [];
      const mapped = ordersData.map((o) => ({
        id: o.orderId?.toString(),
        user: o.userName || "User",
        date: o.orderDate,
        total: o.totalAmount,
        status: o.status,
        cancelledBy: o.cancelledBy,
        fullName: o.shippingFullName || o.fullName || "N/A",
        phone: o.shippingPhone || o.phone || "N/A",
        addressLine1: o.shippingAddressLine1 || o.addressLine1 || "N/A",
        addressLine2: o.shippingAddressLine2 || o.addressLine2 || "",
        city: o.shippingCity || o.city || "N/A",
        state: o.shippingState || o.state || "",
        pincode: o.shippingPincode || o.pincode || "",
        country: o.shippingCountry || o.country || "",
        items: o.items || [],
      }));
      setOrders(mapped);
      setFilteredOrders(mapped);
    } catch (err) {
      console.error("FETCH ORDER ERROR:", err.response || err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.", toastConfig.error);
      } else if (err.response?.status === 403) {
        toast.error("Access denied (Admin only)", toastConfig.error);
      } else {
        toast.error("Failed to load orders", toastConfig.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (search) data = data.filter((o) => o.user.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));
    if (statusFilter !== "all") data = data.filter((o) => o.status === statusFilter);
    if (sortBy === "newest") data.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "oldest") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "highest") data.sort((a, b) => b.total - a.total);
    else if (sortBy === "lowest") data.sort((a, b) => a.total - b.total);
    setFilteredOrders(data);
  }, [search, statusFilter, orders, sortBy]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const shipped = orders.filter((o) => o.status?.toLowerCase() === "shipped").length;
  const delivered = orders.filter((o) => o.status?.toLowerCase() === "delivered").length;

  const getStatusColor = (status) => {
    const colors = {
      Pending: isDark ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-yellow-900/50 text-yellow-300 border-yellow-700",
      Confirmed: isDark ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-blue-900/50 text-blue-300 border-blue-700",
      Packed: isDark ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-purple-900/50 text-purple-300 border-purple-700",
      Shipped: isDark ? "bg-cyan-100 text-cyan-800 border-cyan-200" : "bg-cyan-900/50 text-cyan-300 border-cyan-700",
      Delivered: isDark ? "bg-green-100 text-green-800 border-green-200" : "bg-green-900/50 text-green-300 border-green-700",
      Cancelled: isDark ? "bg-red-100 text-red-800 border-red-200" : "bg-red-900/50 text-red-300 border-red-700",
    };
    return colors[status] || (isDark ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-gray-800 text-gray-300 border-gray-700");
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-100" : "bg-black"} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-gray-600" : "border-white"} mx-auto mb-4`}></div>
          <p className={isDark ? "text-gray-600" : "text-white"}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${isDark ? "from-gray-800 to-gray-500" : "from-white to-gray-400"} bg-clip-text text-transparent`}>
            Order Management
          </h1>
          <p className={`${textSecondaryClass} mt-2`}>Track and manage all customer orders</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard icon={<Package className="w-6 h-6" />} label="Total Orders" value={totalOrders} isDark={isDark} />
          <StatCard icon={<DollarSign className="w-6 h-6" />} label="Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}k`} isDark={isDark} />
          <StatCard icon={<Truck className="w-6 h-6" />} label="Shipped" value={shipped} isDark={isDark} />
          <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Delivered" value={delivered} isDark={isDark} />
        </div>

        {/* SEARCH + FILTERS */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 border ${borderClass}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={18} />
              <input type="text" placeholder="Search by user or order ID..." className={`w-full pl-10 pr-4 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} placeholder-${isDark ? "gray-400" : "gray-400"} focus:outline-none focus:border-white transition-colors`} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={16} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`pl-9 pr-8 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} appearance-none cursor-pointer focus:outline-none focus:border-white transition-colors`}>
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} pointer-events-none`} size={14} />
              </div>
              <div className="relative">
                <ArrowUpDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`pl-9 pr-8 py-2.5 ${inputBgClass} border ${inputBorderClass} rounded-xl ${textPrimaryClass} appearance-none cursor-pointer focus:outline-none focus:border-white transition-colors`}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} pointer-events-none`} size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className={`${cardBgClass} backdrop-blur-lg rounded-2xl border ${borderClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className={`sticky top-0 ${tableHeaderBgClass} backdrop-blur-lg border-b ${borderClass}`}>
                  <tr className={`text-xs uppercase tracking-wider ${textSecondaryClass}`}>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left hidden sm:table-cell">Date</th>
                    <th className="p-4 text-left">Items</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-100" : "divide-white/10"}`}>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className={`hover:${isDark ? "bg-gray-50" : "bg-white/5"} transition-colors`}>
                      <td className={`p-4 font-mono text-sm ${textPrimaryClass}`}>#{o.id.slice(0, 8)}</td>
                      <td className={`p-4 ${textPrimaryClass}`}>{o.user}</td>
                      <td className={`p-4 ${textSecondaryClass} hidden sm:table-cell`}>{new Date(o.date).toLocaleDateString()}</td>
                      <td className="p-4"><span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${isDark ? "bg-gray-100 text-gray-700" : "bg-white/10 text-white"}`}>{o.items.length} items</span></td>
                      <td className={`p-4 font-semibold ${textPrimaryClass}`}>₹{o.total.toLocaleString()}</td>
                      <td className="p-4">
                        {o.status === "Cancelled" ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? "bg-red-100 text-red-800 border border-red-200" : "bg-red-900/50 text-red-300 border border-red-700"}`}>
                            Cancelled by {o.cancelledBy || "Admin"}
                          </span>
                        ) : (
                          <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${getStatusColor(o.status)}`}>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="p-4">
                        <button onClick={() => setSelectedOrder(o)} className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium ${isDark ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-white bg-white/10 hover:bg-white/20"} rounded-lg transition-all duration-200`}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className={`w-16 h-16 ${isDark ? "text-gray-300" : "text-gray-600"} mx-auto mb-4`} />
              <p className={`text-lg ${textSecondaryClass}`}>No Orders Found</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`bg-gradient-to-br ${isDark ? "from-gray-100 to-white" : "from-gray-900 to-black"} rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border ${borderClass} shadow-2xl`}>
            <div className={`sticky top-0 ${isDark ? "bg-white" : "bg-black/90"} backdrop-blur-lg border-b ${borderClass} p-6 flex justify-between items-center`}>
              <div>
                <h2 className={`text-2xl font-bold ${textPrimaryClass}`}>Order Details</h2>
                <p className={`${textSecondaryClass} text-sm mt-1`}>#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className={`p-2 hover:${isDark ? "bg-gray-100" : "bg-white/10"} rounded-xl transition-colors`}>
                <X className={`w-5 h-5 ${textSecondaryClass}`} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className={`${isDark ? "bg-gray-50" : "bg-white/5"} rounded-xl p-4 border ${borderClass}`}>
                <h3 className={`font-semibold ${textPrimaryClass} mb-3`}>Shipping Address</h3>
                <div className={`space-y-1 ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                  <p>{selectedOrder.fullName}</p>
                  <p>{selectedOrder.phone}</p>
                  <p>{selectedOrder.addressLine1}</p>
                  <p>{selectedOrder.addressLine2}</p>
                  <p>{selectedOrder.city}</p>
                  <p>{selectedOrder.state} - {selectedOrder.pincode}</p>
                  <p>{selectedOrder.country}</p>
                </div>
              </div>
              <div className={`${isDark ? "bg-gray-50" : "bg-white/5"} rounded-xl p-4 border ${borderClass}`}>
                <h3 className={`font-semibold ${textPrimaryClass} mb-3`}>Order Summary</h3>
                <div className={`flex justify-between py-2 border-b ${borderClass}`}>
                  <span className={textSecondaryClass}>Order Date:</span>
                  <span className={textPrimaryClass}>{new Date(selectedOrder.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className={textSecondaryClass}>Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
              </div>
              <div>
                <h3 className={`font-semibold ${textPrimaryClass} mb-3`}>Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className={`${isDark ? "bg-gray-50" : "bg-white/5"} rounded-xl p-4 border ${borderClass} hover:${isDark ? "bg-gray-100" : "bg-white/10"} transition-colors`}>
                      <div className="flex gap-4">
                        {item.thumbnail && <img src={item.thumbnail} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />}
                        <div className="flex-1">
                          <p className={`font-medium ${textPrimaryClass}`}>{item.productName}</p>
                          <p className={`text-sm ${textSecondaryClass} mt-1`}>Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${textPrimaryClass}`}>₹{item.price.toLocaleString()}</p>
                          <p className={`text-sm ${textSecondaryClass} mt-1`}>Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`bg-gradient-to-r ${isDark ? "from-gray-100 to-transparent" : "from-white/10 to-transparent"} rounded-xl p-4 border-t-2 border-white`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${textPrimaryClass}`}>Total Amount</span>
                  <span className={`text-2xl font-bold ${textPrimaryClass}`}>₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default OrderManagement;