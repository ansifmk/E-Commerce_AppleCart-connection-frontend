import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

useEffect(() => {
  // 🔥 SCROLL TO TOP
  window.scrollTo({ top: 0, behavior: "smooth" });

  axios
    .get("/api/Address/getaddresses")
    .then((res) => setAddresses(res.data.data))
    .catch((err) => console.error(err));
}, []);
  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const res = await axios.post("/api/Address/addaddress", {
        addressId: 0,
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        country: "India",
        isDefault: false,
      });
const created = res.data.data; 
      setAddresses((prev) => {
        const updated = [...prev, created];
        setSelectedIndex(updated.length - 1);
        return updated;
      });
      setShowForm(false);
      setNewAddress({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add address");
    }
  };

  const handleOrder = async () => {
    if (selectedIndex === -1) { alert("Please select address"); return; }
    const address = addresses[selectedIndex];
    if (!address || !address.addressId) { alert("Invalid address"); return; }
    setLoading(true);
    try {
      const orderRes = await axios.post("/api/Order/CreateOrder", {
        addressId: address.addressId,
        paymentMethod: paymentMethod,
      });
      const orderId = orderRes.data.data;
      if (paymentMethod === 1) {
        alert("Order placed successfully");
        navigate("/order-success");
        return;
      }
      const payRes = await axios.post(`/api/Payment/create/${orderId}`);
      const payment = payRes.data.data;
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "AppleCart",
        order_id: payment.orderId,
        handler: async function (response) {
          await axios.post("/api/Payment/Verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          alert("Payment successful");
          navigate("/order-success");
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Shared input class
  const inputCls =
    "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-colors focus:border-[#1a1a2e] placeholder-slate-300";

  return (
    <div className="min-h-screen bg-[#f0f2f5] px-5 py-10 font-sans">

      {/* ── Page Heading ── */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Complete Your Purchase</h1>
        <p className="text-sm text-gray-400">Secure checkout with multiple payment options</p>
      </div>

      {/* ── Layout ── */}
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-5 order-2 lg:order-1">

          {/* Shipping Information Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#1a1a2e] px-5 py-4 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-white tracking-wide">Shipping Information</span>
            </div>

            {/* Body */}
            <div className="p-5">

              {/* Address Dropdown */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Select Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className={inputCls + " appearance-none pr-9 cursor-pointer"}
                    value={selectedIndex}
                    onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  >
                    <option value={-1}>— Choose a delivery address —</option>
                    {addresses.map((addr, i) => (
                      <option key={addr.addressId} value={i}>
                        {addr.fullName}, {addr.addressLine1}, {addr.city}, {addr.pincode}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="12" height="12" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Selected Address Preview */}
              {selectedIndex !== -1 && addresses[selectedIndex] && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3 mb-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{addresses[selectedIndex].fullName}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {addresses[selectedIndex].addressLine1}
                    {addresses[selectedIndex].addressLine2 ? `, ${addresses[selectedIndex].addressLine2}` : ""}
                    {`, ${addresses[selectedIndex].city}, ${addresses[selectedIndex].state} – ${addresses[selectedIndex].pincode}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{addresses[selectedIndex].phone}</p>
                </div>
              )}

              {/* Add Address Toggle */}
 <button
  className="mt-4 flex items-center gap-2 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md transition"
  onClick={() => setShowForm(!showForm)}
>
  <span className="text-lg">{showForm ? "−" : "+"}</span>
  {showForm ? "Cancel" : "Add New Address"}
</button>
              {/* Add Address Form */}
              {showForm && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input name="fullName" placeholder="Enter full name" value={newAddress.fullName} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone <span className="text-red-500">*</span></label>
                      <input name="phone" placeholder="Enter phone number" value={newAddress.phone} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Address Line 1 <span className="text-red-500">*</span></label>
                      <input name="addressLine1" placeholder="Street address" value={newAddress.addressLine1} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Address Line 2</label>
                      <input name="addressLine2" placeholder="Apartment, suite, etc. (optional)" value={newAddress.addressLine2} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">City <span className="text-red-500">*</span></label>
                      <input name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">State <span className="text-red-500">*</span></label>
                      <input name="state" placeholder="State" value={newAddress.state} onChange={handleAddressChange} className={inputCls} />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Pincode <span className="text-red-500">*</span></label>
                      <input name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleAddressChange} className={inputCls} />
                    </div>

                  </div>

                  <button
                    onClick={handleAddAddress}
                    className="mt-4 px-5 py-2 bg-[#1a1a2e] hover:bg-[#2d2d50] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border-none"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#1a1a2e] px-5 py-4 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-white tracking-wide">Payment Method</span>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-3">

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod(1)}
                className={`flex items-center gap-3.5 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors relative
                  ${paymentMethod === 1 ? "border-[#1a1a2e] bg-slate-50" : "border-slate-200 bg-white hover:border-gray-400"}`}
              >
                {/* Radio */}
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${paymentMethod === 1 ? "border-[#1a1a2e]" : "border-slate-300"}`}>
                  {paymentMethod === 1 && <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pay when you receive your order</p>
                </div>
                <div className="text-gray-300">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod(2)}
                className={`flex items-center gap-3.5 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors relative
                  ${paymentMethod === 2 ? "border-[#1a1a2e] bg-slate-50" : "border-slate-200 bg-white hover:border-gray-400"}`}
              >
                {/* Radio */}
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${paymentMethod === 2 ? "border-[#1a1a2e]" : "border-slate-300"}`}>
                  {paymentMethod === 2 && <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Credit/Debit Card</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pay securely with your card</p>
                </div>
                <div className="text-gray-300">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#1a1a2e] px-5 py-4 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-white tracking-wide">Order Summary</span>
            </div>

            {/* Body */}
            <div className="p-5">

              {/* Product Row */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Your Order</p>
                  <p className="text-xs text-gray-400 mt-0.5">Selected items</p>
                </div>
              </div>

              {/* Price Rows */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">—</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tax</span>
                <span className="text-sm font-medium text-gray-900">Included</span>
              </div>

              {/* Total Row */}
              <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t-2 border-slate-200 mb-4">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-base font-bold text-gray-900">—</span>
              </div>

              {/* COD Notice */}
              {paymentMethod === 1 && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5 mb-3.5">
                  <svg width="15" height="15" fill="none" stroke="#1d4ed8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-medium text-blue-700">You will pay when you receive your order</span>
                </div>
              )}

              {/* Place Order CTA */}
              <button
                onClick={handleOrder}
                disabled={loading}
                className={`w-full py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all border-none cursor-pointer
                  ${loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#1a1a2e] hover:bg-[#2d2d50] text-white active:scale-[0.99]"
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              {/* Secure Note */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <svg width="12" height="12" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-300">Your payment is secure and encrypted</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;