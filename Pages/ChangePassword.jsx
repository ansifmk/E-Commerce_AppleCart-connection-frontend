import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = { ...user, password: passwords.newPassword };
      
      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert("Password changed successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition font-medium disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;