import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./AdminNav";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUser";
import OrderManagement from "./OrderManagement";
import ProductsManagement from "./ProductManagement";

const AdminLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div
      className={`flex min-h-screen ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="fixed top-0 left-0 h-screen z-50">
        <Sidebar
          expanded={expanded}
          setExpanded={setExpanded}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </div>
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        } ${expanded ? "ml-56" : "ml-16"}`}
      >
        <Routes>
          <Route path="/" element={<AdminDashboard isDark={isDark} />} />
          <Route path="/users" element={<AdminUsers isDark={isDark} />} />
          <Route
            path="/products"
            element={<ProductsManagement isDark={isDark} />}
          />
          <Route path="/orders" element={<OrderManagement isDark={isDark} />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
