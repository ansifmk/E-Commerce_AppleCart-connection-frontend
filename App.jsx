import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
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

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

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
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
