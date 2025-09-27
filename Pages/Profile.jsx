import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [addresses, setAddresses] = useState(
    user?.addresses?.map((addr) =>
      typeof addr === "string"
        ? (() => {
            const parts = addr.split(",").map((p) => p.trim());
            return { address: parts[0] || "", city: parts[1] || "", state: parts[2] || "", zipCode: parts[3] || "" };
          })()
        : addr
    ) || []
  );
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === "zipCode" && !/^\d*$/.test(value)) return;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    const { address, city, state, zipCode } = newAddress;
    if (!address.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      alert("Please fill all address fields");
      return;
    }
    if (!/^\d+$/.test(zipCode)) {
      alert("ZIP code must contain only numbers");
      return;
    }
    setAddresses([...addresses, { ...newAddress }]);
    setNewAddress({ address: "", city: "", state: "", zipCode: "" });
  };

  const handleEditAddressField = (index, field, value) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const handleDeleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = { ...user, ...formData, addresses };
      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setAddresses(user?.addresses || []);
    setNewAddress({ address: "", city: "", state: "", zipCode: "" });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Profile Information
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your personal information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Personal Information
                </h2>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                      Full Name
                    </label>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 font-medium text-lg">
                        {user.name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 font-medium text-lg">
                        {user.phone || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                    Email
                  </label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-gray-900 font-medium text-lg block">
                        {user.email}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                    Addresses
                  </label>
                  {addresses.map((addr, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center mb-2 space-x-2 space-y-2 md:space-y-0">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={addr.address}
                            onChange={(e) =>
                              handleEditAddressField(index, "address", e.target.value)
                            }
                            placeholder="Address"
                            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={addr.city}
                            onChange={(e) =>
                              handleEditAddressField(index, "city", e.target.value)
                            }
                            placeholder="City"
                            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={addr.state}
                            onChange={(e) =>
                              handleEditAddressField(index, "state", e.target.value)
                            }
                            placeholder="State"
                            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={addr.zipCode}
                            onChange={(e) =>
                              handleEditAddressField(index, "zipCode", e.target.value)
                            }
                            placeholder="ZIP Code"
                            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="text-red-600 hover:text-red-800 font-medium mt-2 md:mt-0"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg w-full">
                          {`${addr.address}, ${addr.city}, ${addr.state}, ${addr.zipCode}`}
                        </div>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <div className="space-y-2 mt-4">
                      <input
                        type="text"
                        name="address"
                        value={newAddress.address}
                        onChange={handleNewAddressChange}
                        placeholder="Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={handleNewAddressChange}
                        placeholder="ZIP Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={handleAddAddress}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                  Security
                </h2>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-1">
                      Password
                    </label>
                    <p className="text-gray-600 text-lg">••••••••</p>
                  </div>
                  <button
                    onClick={() => navigate("/change-password")}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Profile Actions
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm mb-3"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-semibold text-gray-900 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {user.orders?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Wishlist Items</span>
                  <span className="font-semibold text-gray-900 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                    {user.wishlist?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cart Items</span>
                  <span className="font-semibold text-gray-900 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {user.cart?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).getFullYear()
                      : "2024"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Quick Links
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/my-orders")}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  My Orders
                </button>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
