import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  Calendar,
  Activity,
  Zap,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const AdminDashboard = ({ isDark = true }) => {
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, usersRes, ordersRes] = await Promise.all([
        axiosInstance.get("/api/AdminUser/dashboard"),
        axiosInstance.get("/api/AdminUser/viewalluser"),
        axiosInstance.get("/api/Order/GetAllOrders"),
      ]);

      setDashboard(dashboardRes.data);
      setUsers(usersRes.data.data || usersRes.data);
      setOrders(ordersRes.data.data || ordersRes.data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response || err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  
  const allOrders = orders;
  const totalUsers = users.length;
  const totalProducts = dashboard?.totalProductsPurchased || 0;
  const totalOrders = allOrders.length;
  const totalRevenue = dashboard?.totalRevenue || 0;

  const orderCount = {
    Pending: 0,
    Confirmed: 0,
    Packed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  allOrders.forEach((order) => {
    let status = (order.orderStatus || order.status || "").trim();
    status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (orderCount.hasOwnProperty(status)) {
      orderCount[status]++;
    }
  });

  const orderDistributionData = Object.keys(orderCount).map((status) => ({
    name: status,
    value: orderCount[status],
  }));

  const COLORS = [
    "#facc15", "#3b82f6", "#a855f7", "#6366f1", "#22c55e", "#ef4444"
  ];
  
  const dateCount = {};
  allOrders.forEach((order) => {
    const date = new Date(order.orderDate).toLocaleDateString();
    dateCount[date] = (dateCount[date] || 0) + 1;
  });
  const orderTrendData = Object.keys(dateCount).map((date) => ({
    date,
    orders: dateCount[date],
  }));

  const revenueByDate = {};
  allOrders.forEach((order) => {
    const date = new Date(order.orderDate).toLocaleDateString();
    revenueByDate[date] = (revenueByDate[date] || 0) + (order.totalAmount || 0);
  });
  const revenueTrendData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date] / 1000,
  }));

  const today = new Date().toDateString();
  let productSalesToday = {};
  allOrders.forEach((order) => {
    if (new Date(order.orderDate).toDateString() === today) {
      const items = order.items?.length > 0 ? order.items : [{ productName: "Order ₹" + order.totalAmount, quantity: 1 }];
      items.forEach((item) => {
        const name = item.productName || "Unknown";
        productSalesToday[name] = (productSalesToday[name] || 0) + (item.quantity || 1);
      });
    }
  });
  let topSellingToday = Object.keys(productSalesToday)
    .map((name) => ({ name, quantity: productSalesToday[name] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  let productSalesWeek = {};
  allOrders.forEach((order) => {
    if (new Date(order.orderDate) >= weekAgo) {
      const items = order.items?.length > 0 ? order.items : [{ productName: "Order ₹" + order.totalAmount, quantity: 1 }];
      items.forEach((item) => {
        const name = item.productName || "Unknown";
        productSalesWeek[name] = (productSalesWeek[name] || 0) + (item.quantity || 1);
      });
    }
  });
  let topSellingWeek = Object.keys(productSalesWeek)
    .map((name) => ({ name, quantity: productSalesWeek[name] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  if (loading)
    return (
      <div className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-100"} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className={`w-16 h-16 border-4 ${isDark ? "border-white/20 border-t-white" : "border-gray-300 border-t-gray-600"} rounded-full animate-spin mx-auto`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className={`${isDark ? "text-white/40" : "text-gray-400"} w-6 h-6 animate-pulse`} />
            </div>
          </div>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"} tracking-wide`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-100"} flex items-center justify-center`}>
        <div className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl px-8 py-6 border ${isDark ? "border-black/10" : "border-white/10"} text-center max-w-md`}>
          <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-red-400 w-6 h-6" />
          </div>
          <p className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
          <button
            onClick={fetchData}
            className={`mt-4 px-4 py-2 ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-black"} rounded-xl text-sm transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      iconColor: isDark ? "#60a5fa" : "#3b82f6",
      gradient: isDark ? "from-gray-700 to-gray-900" : "from-gray-100 to-gray-200",
    },
    {
      label: "Products Sold",
      value: totalProducts,
      icon: Package,
      iconColor: isDark ? "#34d399" : "#10b981",
      gradient: isDark ? "from-gray-600 to-gray-800" : "from-gray-100 to-gray-200",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconColor: isDark ? "#a78bfa" : "#8b5cf6",
      gradient: isDark ? "from-gray-700 to-gray-900" : "from-gray-100 to-gray-200",
    },
    {
      label: "Total Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(1)}k`,
      icon: DollarSign,
      iconColor: isDark ? "#fbbf24" : "#f59e0b",
      gradient: isDark ? "from-gray-600 to-gray-800" : "from-gray-100 to-gray-200",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-white text-black" : "bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"}`}>
      {/* Header */}
      <header className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg border-b ${isDark ? "border-black/10" : "border-white/10"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? "bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"}`}>
                Analytics Dashboard
              </h1>
              <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-sm mt-1 flex items-center gap-2`}>
                <Calendar size={14} />
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-900/20 backdrop-blur-lg border border-green-500/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Data
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Cards - Only icon colors changed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, iconColor, gradient }) => (
            <div
              key={label}
              className={`group ${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-black/10" : "border-white/10"} hover:border-white/20 transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={20} color={iconColor} />
                </div>
              </div>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"} tracking-wide uppercase mb-1`}>
                {label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-black" : "text-white"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Top Selling Sections - Keep same as before */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSellingList
            title="Top Selling Today"
            icon={<TrendingUp size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />}
            data={topSellingToday}
            isDark={isDark}
          />
          <TopSellingList
            title="Top Selling This Week"
            icon={<Star size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />}
            data={topSellingWeek}
            isDark={isDark}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Order Trend" isDark={isDark}>
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#e5e7eb" : "#4d4c4c"} />
              <XAxis
                dataKey="date"
                tick={{ fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: isDark ? "#6b7280" : "#ffffff", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#ffffff" : "#1f2937",
                  border: `1px solid ${isDark ? "#e5e7eb" : "#374151"}`,
                  borderRadius: 10,
                  fontSize: 12,
                  color: isDark ? "#000000" : "#ffffff",
                }}
                cursor={{ stroke: isDark ? "#000000" : "#ffffff" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={isDark ? "#000000" : "#ffffff"}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: isDark ? "#000000" : "#ffffff", strokeWidth: 0 }}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Revenue Trend (₹K)" isDark={isDark}>
            <BarChart data={revenueTrendData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#e5e7eb" : "#1f2937"} />
              <XAxis
                dataKey="date"
                tick={{ fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#ffffff" : "#1f2937",
                  border: `1px solid ${isDark ? "#e5e7eb" : "#374151"}`,
                  borderRadius: 10,
                  fontSize: 12,
                  color: isDark ? "#000000" : "#ffffff",
                }}
                cursor={{ fill: isDark ? "#f3f4f6" : "#374151" }}
              />
              <Bar dataKey="revenue" fill={isDark ? "#000000" : "#ffffff"} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        {/* Pie Chart Section */}
        <div className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-black/10" : "border-white/10"}`}>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className={isDark ? "text-gray-600" : "text-gray-400"} />
            <h2 className={`text-base font-semibold ${isDark ? "text-black" : "text-white"}`}>
              Order Distribution by Status
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={orderDistributionData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
                stroke="none"
              >
                {orderDistributionData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: isDark ? "#ffffff" : "#1f2937",
                  border: `1px solid ${isDark ? "#e5e7eb" : "#374151"}`,
                  borderRadius: 10,
                  fontSize: 12,
                  color: isDark ? "#000000" : "#ffffff",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: isDark ? "#374151" : "#d1d5db", fontSize: 12 }}>
                    {value}
                  </span>
                )}
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Footer */}
        <div className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-4 border ${isDark ? "border-black/10" : "border-white/10"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>Active System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>Real-time Updates</span>
              </div>
            </div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs`}>
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Top Selling List Component - Keep exactly same
const TopSellingList = ({ title, icon, data, isDark }) => (
  <div className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-black/10" : "border-white/10"} hover:border-white/20 transition-all duration-300`}>
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h2 className={`text-sm font-semibold ${isDark ? "text-black" : "text-white"}`}>{title}</h2>
    </div>
    {data.length > 0 ? (
      <div className="space-y-4">
        {data.map((item, i) => {
          const pct = Math.round((item.quantity / (data[0]?.quantity || 1)) * 100);
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"} w-5 flex-shrink-0`}>
                    #{i + 1}
                  </span>
                  <span className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"} truncate group-hover:${isDark ? "text-black" : "text-white"} transition-colors`}>
                    {item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${isDark ? "text-black" : "text-white"} ml-3 flex-shrink-0`}>
                  {item.quantity}
                </span>
              </div>
              <div className={`h-1.5 ${isDark ? "bg-black/10" : "bg-white/10"} rounded-full overflow-hidden`}>
                <div
                  className={`h-full bg-gradient-to-r ${isDark ? "from-black to-gray-500" : "from-white to-gray-400"} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex items-center justify-center h-32">
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No sales data available</p>
      </div>
    )}
  </div>
);

// Chart Card Component - Keep exactly same
const ChartCard = ({ title, children, isDark }) => (
  <div className={`${isDark ? "bg-gray-100" : "bg-white/5"} backdrop-blur-lg rounded-2xl p-6 border ${isDark ? "border-black/10" : "border-white/10"}`}>
    <h2 className={`text-sm font-semibold ${isDark ? "text-black" : "text-white"} mb-6`}>{title}</h2>
    <ResponsiveContainer width="100%" height={280}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default AdminDashboard;