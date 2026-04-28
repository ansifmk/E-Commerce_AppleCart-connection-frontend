import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; // ✅ ADDED
import Products from "./Components/Products";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import ProductDetails from "./Components/Productdetails";
import Profile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import Payment from "./Pages/Payment";
import OrderSuccess from "./Pages/OrderSuccess";
import MyOrders from "./Pages/MyOrders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./Context/Authcontext";
import ProtectedRoute from "./Context/ProtectedRoute";
import About from "./Pages/About";
import AdminLayout from "./Pages/admin/AdminLayout.jsx";

function AppContent() {
  const location = useLocation();

  // ✅ SEPARATE CONDITIONS
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/users",
    "/dashboard/products",
    "/dashboard/orders",
  ];

  const hideFooterRoutes = [
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/users",
    "/dashboard/products",
    "/dashboard/orders",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  const shouldHideFooter = hideFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* ✅ Navbar */}
      {!shouldHideNavbar && <Navbar />}

      {/* ✅ Main Content (FIXED FOR FOOTER POSITION) */}
      <div className="flex-grow">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* ✅ Footer */}
      {!shouldHideFooter && <Footer />}

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;