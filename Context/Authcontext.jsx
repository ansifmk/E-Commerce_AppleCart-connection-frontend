import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);


  // 🔁 Load user from localStorage
 useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  setLoading(false); // 🔥 VERY IMPORTANT
}, []);
const fetchWishlistIds = async () => {
  try {
    const res = await axios.get("/api/WishList");

    const items = res.data?.data || [];

    setWishlistIds(items.map(i => i.productId));

  } catch (err) {
    console.error("Wishlist error:", err);
  }
};
useEffect(() => {
  if (user) {
    fetchWishlistIds();
  }
}, [user]);
  // 🔥 FETCH CART COUNT FROM BACKEND (FIXED)
  const fetchCartCount = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await axios.get(
        "https://localhost:7096/api/Cart/GetCartItems",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("CART COUNT API:", res.data);

      // 🔥 IMPORTANT FIX (handle empty cart)
      if (!res.data?.data) {
        setCartCount(0);
        return;
      }

      const items = res.data.data.items || [];

      const total = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(total);

    } catch (err) {
      console.error("Cart count error:", err);
      setCartCount(0); // 🔥 fallback safety
    }
  };

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://localhost:7096/api/auth/login",
        {
          email,
          password,
        }
      );

const userData = {
  ...res.data.users,
  token: res.data.accessToken,
  role: res.data.role?.toLowerCase() // 🔥 IMPORTANT FIX
};
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔥 VERY IMPORTANT
      fetchCartCount();

      return { success: true, user: userData };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // 🔥 LOAD CART COUNT WHEN USER CHANGES
  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  // 🔓 LOGOUT
  const logout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        cartCount,
        fetchCartCount,
        wishlistIds,
        setWishlistIds,
        fetchWishlistIds,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};