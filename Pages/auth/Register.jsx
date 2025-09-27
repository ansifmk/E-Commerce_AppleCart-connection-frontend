import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";

function Register() {
  const { user } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return { text: "All fields are required", type: "error" };
    }
    if (password !== confirmPassword) {
      return { text: "Passwords do not match!", type: "error" };
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
      const { name, email, password } = formData;

      const res = await axios.get(`http://localhost:3001/users?email=${email}`);
      if (res.data.length > 0) {
        setMessage({ text: "Email already registered", type: "error" });
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: "user",
        isBlock: false,
        cart: [],
        orders: [],
        wishlist: [],
        created_at: new Date().toISOString()
      };

      await axios.post("http://localhost:3001/users", newUser);
      setMessage({ text: "Registration successful", type: "success" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error registering user", type: "error" });
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
            <h2 className="text-2xl font-light text-white mb-2">Create your account</h2>
            <p className="text-white text-lg font-light mb-4">One account for everything Apple.</p>
            <p className="text-gray-300 font-normal">Join the Apple family</p>
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
          <div className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="mb-8">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Account
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
