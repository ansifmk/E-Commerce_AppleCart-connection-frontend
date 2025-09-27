import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    setAnimationStage(1);
    
    const timer2 = setTimeout(() => setAnimationStage(2), 1000);
    
    const timer3 = setTimeout(() => setAnimationStage(3), 1500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
              <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 transition-all duration-700 ${
          animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
                    <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4 transition-all duration-500 delay-200">
              Order Confirmed!
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full mb-6 transition-all duration-500 delay-300"></div>
            <p className="text-lg text-gray-600 leading-relaxed transition-all duration-500 delay-400">
              Thank you for your trust in us. Your order <span className="font-semibold text-gray-900">#ORD-7842</span> has been confirmed and is being processed.
            </p>
          </div>
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 transition-all duration-500 delay-500">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Order Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center transition-transform duration-300 delay-600">
                <div className="w-3 h-3 bg-green-500 rounded-full border-4 border-white shadow"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">Order Confirmed</span>
                <span className="ml-auto text-xs text-gray-500">Just now</span>
              </div>
              <div className="flex items-center transition-transform duration-300 delay-700">
                <div className="w-3 h-3 bg-blue-300 rounded-full border-4 border-white shadow"></div>
                <span className="ml-3 text-sm text-gray-600">Processing</span>
                <span className="ml-auto text-xs text-gray-400">Next</span>
              </div>
              <div className="flex items-center transition-transform duration-300 delay-800">
                <div className="w-3 h-3 bg-gray-300 rounded-full border-4 border-white shadow"></div>
                <span className="ml-3 text-sm text-gray-600">Shipped</span>
              </div>
            </div>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 transition-all duration-500 ${
            animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <button
              onClick={() => navigate("/products")}
              className="group bg-gradient-to-r from-gray-900 to-blue-900 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="group bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-300 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Track Order
              <svg className="w-5 h-5 ml-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <div className="text-center border-t border-gray-100 pt-6 transition-all duration-500 delay-900">
            <p className="text-sm text-gray-500 mb-3">Your purchase is protected by</p>
            <div className="flex justify-center space-x-6 items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs font-medium text-gray-600">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`text-center mt-6 transition-all duration-500 delay-1000 ${
          animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-sm text-gray-600">
            Want faster updates? <button className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors">Get our mobile app</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;