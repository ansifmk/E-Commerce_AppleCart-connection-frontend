import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔐 Login function with axios + block + role check
  const login = async (email, password) => {
    try {
      const res = await axios.get(`http://localhost:3001/users?email=${email}`);

      if (res.data.length === 0) {
        throw new Error("User not found");
      }

      const foundUser = res.data[0];

      // Check blocked
      if (foundUser.isBlock === true) {
        throw new Error("Your account has been blocked. Contact admin.");
      }

      // Check password
      if (foundUser.password !== password) {
        throw new Error("Invalid password");
      }

      // ✅ Save user with role
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      return { success: true, user: foundUser };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 🚪 Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
