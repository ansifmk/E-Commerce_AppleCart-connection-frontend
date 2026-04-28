import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";

function Register() {
  const { user } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    username: "",   // ✅ DIRECT MATCH
    email: "",
    password: "",
    phoneNumber: "" // ✅ REQUIRED
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const { username, email, password, phoneNumber } = formData;

    if (!username || !email || !password || !phoneNumber) {
      return { text: "All fields are required", type: "error" };
    }

    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await axios.post(
        "https://localhost:7096/api/auth/register",
        formData   // ✅ DIRECTLY SEND
      );

      setMessage({ text: "Registration successful", type: "success" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      setFormData({
        username: "",
        email: "",
        password: "",
        phoneNumber: ""
      });

    } catch (err) {
      console.error("ERROR:", err.response?.data);

      setMessage({
        text: err.response?.data?.message || "Registration failed",
        type: "error"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-black py-6 px-6">
        <div className="max-w-md mx-auto flex justify-start">
          <h1 className="text-lg font-bold text-white">Apple</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white mb-2">
              Create your account
            </h2>
            <p className="text-white text-lg font-light mb-4">
              One account for everything Apple.
            </p>
            <p className="text-gray-300 font-normal">
              Join the Apple family
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 mb-6">
            <form onSubmit={handleSubmit}>

              {message.text && (
                <div className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-900/50 border border-green-700 text-green-400"
                    : "bg-red-900/50 border border-red-700 text-red-400"
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              {/* USERNAME */}
              <div className="mb-6">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* PHONE */}
              <div className="mb-6">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-8">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Create Account
              </button>
            </form>
<div className="text-center mt-6">
  <p className="text-gray-400 text-sm">
    Already have an account?{" "}
    <span
      onClick={() => navigate("/login")}
      className="text-blue-500 cursor-pointer hover:underline"
    >
      Login here
    </span>
  </p>
</div>
          </div>
        </div>
        
      </main>
    </div>
  );
}

export default Register;