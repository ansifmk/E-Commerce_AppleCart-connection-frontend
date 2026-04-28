import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [counts, setCounts] = useState({
    orders: 0,
    wishlist: 0,
    cart: 0,
  });

  useEffect(() => {
    // 🔥 SCROLL TO TOP
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchCounts = async () => {
      try {
        const orderRes = await axios.get("/api/Order/Myorders");
        const orders = orderRes.data.data || orderRes.data || [];

        const activeOrders = orders.filter((o) => o.status !== "Cancelled");

        const wishRes = await axios.get("/api/WishList");
        const wishlist = wishRes.data.data || wishRes.data || [];

        const cartRes = await axios.get("/api/Cart/GetCartItems");

        let cartCount = 0;
        if (Array.isArray(cartRes.data)) {
          cartCount = cartRes.data.length;
        } else if (Array.isArray(cartRes.data.data)) {
          cartCount = cartRes.data.data.length;
        } else if (cartRes.data.data?.items) {
          cartCount = cartRes.data.data.items.length;
        }

        setCounts({
          orders: activeOrders.length,
          wishlist: wishlist.length,
          cart: cartCount,
        });
      } catch (err) {
        console.error("Count fetch error:", err);
      }
    };

    fetchCounts();
  }, []);

  const handleChange = (e) => {
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

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleAddAddress = async () => {
    const { address, city, state, zipCode } = newAddress;

    if (!address || !city || !state || !zipCode) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        addressId: 0,
        fullName: user.name,
        phone: user.phone || "",
        addressLine1: address,
        addressLine2: "",
        city,
        state,
        pincode: zipCode,
        country: "India",
        isDefault: true,
      };

      await axios.post("/api/Address/addaddress", payload);
      setAddresses((prev) => [...prev, newAddress]);
      setNewAddress({
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });

      toast.success("Address added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">Sign in to access your account</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-white/80">Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h2>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {user.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">{user.email}</p>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Addresses Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Addresses
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {addresses.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {addresses.map((addr, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-purple-200 transition-all"
                      >
                        <p className="text-gray-700">
                          {addr.address}, {addr.city}, {addr.state} -{" "}
                          {addr.zipCode}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-gray-500">No addresses saved yet</p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-6 mt-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Add New Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      name="address"
                      placeholder="Street Address"
                      value={newAddress.address}
                      onChange={handleNewAddressChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                      <input
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <input
                      name="zipCode"
                      placeholder="Pincode"
                      value={newAddress.zipCode}
                      onChange={handleNewAddressChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={handleAddAddress}
                      disabled={loading}
                      className="w-full bg-black text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Address"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <button
                  onClick={() => navigate("/my-orders")}
                  className="w-full p-5 flex items-center justify-between hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Orders</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {counts.orders}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full p-5 flex items-center justify-between hover:bg-pink-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-200 transition">
                      <svg
                        className="w-5 h-5 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Wishlist</span>
                  </div>
                  <span className="text-2xl font-bold text-pink-600">
                    {counts.wishlist}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full p-5 flex items-center justify-between hover:bg-green-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Cart Items
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {counts.cart}
                  </span>
                </button>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Security</p>
                  <p className="text-gray-500 text-sm">
                    Your account is protected with industry-standard security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
