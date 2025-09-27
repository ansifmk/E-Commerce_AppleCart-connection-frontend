import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);

  if (!user || !user.cart || user.cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to proceed with payment</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = user.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "zipCode" && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex(index);
    if (index === -1) {
      setForm({ ...form, address: "", city: "", state: "", zipCode: "" });
    } else {
      const addr = user.addresses[index];
      setForm({
        ...form,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
      });
    }
  };

  const handlePayment = async () => {
    if (form.email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      alert("Please enter a valid Gmail address (must end with @gmail.com)");
      return;
    }

    if (!/^\d+$/.test(form.zipCode)) {
      alert("ZIP code must contain only numbers");
      return;
    }

    if (paymentMethod === "card") {
      if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) {
        alert("Please fill all payment details");
        return;
      }
    }

    if (!form.fullName || !form.address || !form.city || !form.state || !form.zipCode) {
      alert("Please fill all shipping information");
      return;
    }

    setLoading(true);

    try {
      for (const item of user.cart) {
        const productRes = await axios.get(`http://localhost:3001/products/${item.id}`);
        const product = productRes.data;
        const updatedCount = product.count - item.quantity;
        await axios.put(`http://localhost:3001/products/${item.id}`, { ...product, count: updatedCount });
      }

      const newOrder = {
        id: "order_" + new Date().getTime(),
        items: user.cart,
        total: totalPrice,
        shippingInfo: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        paymentMethod,
        created_at: new Date().toISOString(),
        status: "pending",
      };

      const updatedUser = {
        ...user,
        orders: [...(user.orders || []), newOrder],
        cart: [],
      };

      await axios.put(`http://localhost:3001/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/order-success");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CashIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const CardIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const SecureIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure checkout with multiple payment options</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Shipping Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      placeholder="Enter email (must end with @gmail.com)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Address *
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      value={selectedAddressIndex}
                      onChange={(e) => handleAddressSelect(Number(e.target.value))}
                    >
                      <option value={-1}>Use new address</option>
                      {user.addresses?.map((addr, index) => (
                        <option key={index} value={index}>
                          {`${addr.address}, ${addr.city}, ${addr.state}, ${addr.zipCode}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAddressIndex === -1 && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={form.zipCode}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter ZIP code (numbers only)"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div 
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "cash" 
                        ? "border-black bg-gray-50 shadow-md" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cash" ? "border-black bg-black" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cash" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Cash on Delivery</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay when you receive your order
                      </p>
                    </div>
                    <div className="text-gray-600">
                      <CashIcon />
                    </div>
                  </div>

                  <div 
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "card" 
                        ? "border-black bg-gray-50 shadow-md" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card" ? "border-black bg-black" : "border-gray-300"
                    }`}>
                      {paymentMethod === "card" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely with your card
                      </p>
                    </div>
                    <div className="text-gray-600">
                      <CardIcon />
                    </div>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-6 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <SecureIcon />
                      <span className="ml-2">Card Details</span>
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Cardholder Name"
                        value={form.cardName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={form.cardNumber}
                        onChange={handleChange}
                        maxLength={16}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      />
                      <div className="flex gap-4">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={form.expiry}
                          onChange={handleChange}
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={form.cvv}
                          onChange={handleChange}
                          maxLength={3}
                          className="w-32 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-gray-900 to-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {user.cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900 whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">Included</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg pt-3 border-t border-gray-300">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {paymentMethod === "cash" && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 text-center flex items-center justify-center">
                      <CashIcon />
                      <span className="ml-2">You will pay when you receive your order</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full mt-6 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-black to-gray-800 hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Processing Your Order...
                    </div>
                  ) : (
                    `Place Order - ₹${totalPrice.toLocaleString()}`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <SecureIcon />
                    <span className="ml-1">Your payment is secure and encrypted</span>
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

export default Payment;