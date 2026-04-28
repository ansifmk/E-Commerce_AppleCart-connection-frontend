import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Order/Myorders");

      console.log("MY ORDERS:", res.data);

      setOrders(res.data.data || res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err.response || err);
      showNotification("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      if (!orderId) {
        showNotification("Invalid Order ID", "error");
        return;
      }

      console.log("Cancelling Order:", orderId);

      setUpdating((prev) => ({ ...prev, [orderId]: true }));

      await axios.patch(`/api/Order/CancelByUser/${orderId}`);

      showNotification("Order cancelled successfully", "success");
      fetchOrders();
    } catch (err) {
      console.error("Cancel error FULL:", err.response?.data || err);
      showNotification(err.response?.data?.message || "Cancel failed", "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "Shipped":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "Delivered":
        return "bg-teal-50 text-teal-600 border-teal-200";
      case "Cancelled":
        return "bg-gray-50 text-gray-500 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Shipped":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 9l-5-5-5 5M12 4v12"
            />
          </svg>
        );
      case "Delivered":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "Cancelled":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-4">
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
          <div
            className={`rounded-2xl shadow-2xl p-4 min-w-[320px] backdrop-blur-lg ${
              notification.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-red-500 to-rose-500"
            } text-white`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {notification.type === "success" ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button
                onClick={() =>
                  setNotification({ show: false, message: "", type: "" })
                }
                className="text-white/80 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-black">My Orders</h1>
          <p className="text-gray-500 mt-2">Track your purchase history</p>
        </div>

        {orders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {orders.map((order) => {
              const orderId = order.orderId || order.id;

              return (
                <div
                  key={orderId}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  <div className="bg-black px-5 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Order ID
                        </p>
                        <p className="text-white font-bold text-lg">
                          #
                          {typeof orderId === "string"
                            ? orderId.slice(-8)
                            : orderId}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(order.status)} bg-white/90`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {item.productName}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-bold text-indigo-600 text-sm">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="font-black text-xl text-gray-800">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                      </div>

                      {(order.status === "Pending" ||
                        order.status === "Confirmed") && (
                        <button
                          onClick={() => cancelOrder(orderId)}
                          disabled={updating[orderId]}
                          className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-700 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {updating[orderId] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Cancelling
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}

                      {order.status === "Cancelled" && (
                        <div className="px-4 py-2 bg-gray-200 rounded-xl text-gray-600 text-sm font-medium flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancelled
                        </div>
                      )}

                      {order.status === "Delivered" && (
                        <div className="px-4 py-2 bg-teal-100 text-teal-600 rounded-xl text-sm font-medium flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Delivered
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven't placed any orders
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
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
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
