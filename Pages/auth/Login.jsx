// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberId, setRememberId] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = await login({ email, password });
      setError("");

      if (loggedInUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
    navigate('/home')
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black py-6 px-6">
        <div className="max-w-md mx-auto flex justify-start">
         <h1 className="text-lg font-bold text-white">Apple</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white mb-2">One account. Any device.</h2>
            <p className="text-white text-lg font-light mb-4">Just for you.</p>
            <p className="text-gray-300 font-normal">Sign in to get started</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 mb-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-blue-400 focus:outline-none transition-colors"
                  placeholder="email"
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none transition-colors"
                  placeholder="Password"
                />
              </div>


              <button
                type="submit"
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Next
              </button>
            </form>

            <div className="mt-6 text-center space-x-4">
             
              <a onClick={()=>navigate('/register')} href="#" className="text-sm text-gray-400 hover:text-white underline">
                Create account
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;