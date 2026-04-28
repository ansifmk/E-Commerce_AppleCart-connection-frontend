import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      const loggedInUser = result.user;

      if (loggedInUser.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-black py-6 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-white">Apple</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full">

          <div className="text-center mb-8">
            <h2 className="text-2xl text-white">Sign in</h2>
            <p className="text-gray-300">Access your account</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <form onSubmit={handleSubmit}>

              {error && (
                <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-6 p-3 bg-transparent border-b border-gray-600 text-white"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-6 p-3 bg-transparent border-b border-gray-600 text-white"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/register")}
                className="text-blue-400 underline"
              >
                Create account
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;