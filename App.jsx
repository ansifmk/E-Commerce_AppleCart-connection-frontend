import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Products from "./Components/Products";

function AppContent() {
  const location = useLocation();
  const showNavbarRoutes = ["/home", "/products", "/cart"]; // Pages where navbar should appear

  return (
    <div>
      {showNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
         
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
