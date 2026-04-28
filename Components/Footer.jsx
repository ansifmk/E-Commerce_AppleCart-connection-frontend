import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-10 border-t">
      
      {/* Top small breadcrumb (optional like Apple) */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-gray-500">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 text-gray-700"
  >
    <path d="M16.365 1.43c0 1.14-.465 2.235-1.24 3.04-.81.83-2.115 1.47-3.255 1.375-.14-1.115.465-2.275 1.24-3.055.825-.845 2.235-1.45 3.255-1.36zM21.435 17.16c-.45 1.035-.675 1.5-1.26 2.415-.81 1.26-1.95 2.835-3.36 2.85-1.26.015-1.59-.81-3.3-.81-1.71 0-2.07.795-3.33.825-1.41.03-2.475-1.425-3.285-2.685-2.265-3.48-2.505-7.56-1.11-9.705.99-1.56 2.55-2.49 4.02-2.49 1.5 0 2.445.825 3.69.825 1.215 0 1.95-.825 3.675-.825 1.29 0 2.655.705 3.63 1.92-3.195 1.755-2.67 6.375.63 7.68z" />
  </svg>

  <span className="mx-2"></span>
    </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

        {/* Shop and Learn */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Shop and Learn</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:underline">Store</Link></li>
            <li>Mac</li>
            <li>iPhone</li>
            <li>Watch</li>
            <li>AirPods</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Account</h3>
          <ul className="space-y-2">
            <li>Manage Your Account</li>
            <li>Apple Store Account</li>
            <li>iCloud</li>
          </ul>

          <h3 className="font-semibold text-gray-800 mt-5 mb-3">Entertainment</h3>
          <ul className="space-y-2">
            <li>Apple One</li>
            <li>Apple TV+</li>
            <li>Apple Music</li>
            <li>Apple Arcade</li>
          </ul>
        </div>

        {/* Apple Store */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Apple Store</h3>
          <ul className="space-y-2">
            <li>Find a Store</li>
            <li>Genius Bar</li>
            <li>Today at Apple</li>
            <li>Apple Camp</li>
            <li>Order Status</li>
            <li>Shopping Help</li>
          </ul>
        </div>

        {/* Business */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">For Business</h3>
          <ul className="space-y-2">
            <li>Apple and Business</li>
            <li>Shop for Business</li>
          </ul>

          <h3 className="font-semibold text-gray-800 mt-5 mb-3">For Education</h3>
          <ul className="space-y-2">
            <li>Apple and Education</li>
            <li>Shop for Education</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">About Apple</h3>
          <ul className="space-y-2">
            <li>Newsroom</li>
            <li>Apple Leadership</li>
            <li>Career Opportunities</li>
            <li>Investors</li>
            <li>Events</li>
            <li>Contact Apple</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t text-xs text-gray-500 py-4 px-6 max-w-7xl mx-auto">
        © {new Date().getFullYear()} AppleCart. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;