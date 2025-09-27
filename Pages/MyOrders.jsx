import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import axios from "axios";

const MyOrders = () => {
  const { user, setUser } = useContext(AuthContext);
  const [updating, setUpdating] = useState({});

  if (!user || !user.orders || user.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
          <a
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-gray-900 to-blue-900 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  const cancelOrder = async (orderId) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));

    try {
      const order = user.orders.find((o) => o.id === orderId);
      if (!order || order.status === "cancelled") return;

      for (const item of order.items) {
        const productRes = await axios.get(`http://localhost:3001/products/${item.id}`);
        const product = productRes.data;
        const updatedCount = product.count + item.quantity;

        await axios.patch(`http://localhost:3001/products/${item.id}`, { count: updatedCount });
      }

      const updatedOrders = user.orders.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" } : o
      );

      const updatedUser = { ...user, orders: updatedOrders };
      await axios.patch(`http://localhost:3001/users/${user.id}`, { orders: updatedOrders });

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      case "completed":
        return "✅";
      case "shipped":
        return "🚚";
      default:
        return "📦";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
            My Orders
          </h1>
          <p className="text-gray-600">Manage and track your orders</p>
        </div>
        <div className="space-y-6">
          {user.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Order #{order.id}</h2>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                          <p className="text-gray-500 text-sm">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                  
                  {order.status === "pending" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={updating[order.id]}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {updating[order.id] ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Order
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Showing {user.orders.length} order{user.orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;