import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const cleanEmail = email.trim().toLowerCase();
      const res = await axios.get(`http://localhost:3001/users?email=${cleanEmail}`);
      if (res.data.length === 0) {
        throw new Error("User not found");
      }
     const foundUser = res.data[0];
      if (foundUser.email.toLowerCase() !== cleanEmail) {
        throw new Error("Invalid email");
      }
      if (foundUser.password !== password) {
        throw new Error("Invalid password");
      }
      if (foundUser.isBlock) {
        throw new Error("Your account has been blocked. Contact admin.");
      }
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      return { success: true, user: foundUser };
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:3001/users/${user.id}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
