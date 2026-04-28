import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationStage, setAnimationStage] = useState(0);
const [orderNumber, setOrderNumber] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAnimationStage(1);
    const timer2 = setTimeout(() => setAnimationStage(2), 1000);
    const timer3 = setTimeout(() => setAnimationStage(3), 1500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
useEffect(() => {
  if (location.state?.orderNumber) {
    setOrderNumber(location.state.orderNumber);
  }
}, [location.state]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div
          className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
            animationStage >= 2
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          {/* Top Section */}
          <div className="px-6 pt-8 pb-6 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Order Confirmed!
            </h1>
            <p className="text-sm text-gray-500">Thank you for your purchase</p>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Order Number */}
            {/* <div className="text-center mb-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Order Number
              </p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                #ORD-7842
              </p>
            </div> */}

            {/* Simple Timeline */}
            <div className="mb-5 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-white"
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
                  </div>
                  <p className="text-xs font-medium text-gray-900">Confirmed</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="text-center flex-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    Processing
                  </p>
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
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
                  <p className="text-xs font-medium text-gray-600">Shipped</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              className={`space-y-3 transition-all duration-500 ${
                animationStage >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                View My Orders
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Confirmation sent to your email
            </p>
          </div>
        </div>

        {/* Help Link */}
        <div
          className={`text-center mt-4 transition-all duration-500 ${
            animationStage >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <button className="text-gray-900 hover:text-gray-700 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
