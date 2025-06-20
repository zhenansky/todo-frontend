import React, { useState } from "react";
import api from "../api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isLogin) {
        // Login hanya butuh username dan password
        response = await api.login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        // Register butuh username, email, dan password sesuai dokumentasi
        response = await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }

      console.log("API Response:", response);

      // Cek berbagai kemungkinan format response
      let token = null;
      if (response.token) {
        token = response.token;
      } else if (response.access_token) {
        token = response.access_token;
      } else if (response.data && response.data.token) {
        token = response.data.token;
      } else if (typeof response === "string") {
        token = response; // Jika response langsung berupa token string
      }

      console.log("Extracted token:", token);

      if (token) {
        console.log("Token found, calling onLogin...");
        onLogin(token);
      } else {
        console.error("No token found in response:", response);
        throw new Error("No authentication token received from server");
      }
    } catch (err) {
      console.error("API Error:", err);

      // Handle different types of errors
      if (err.message.includes("JSON")) {
        setError("Server response error. Please check your connection.");
      } else if (
        err.message.includes("fetch") ||
        err.message.includes("NetworkError")
      ) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form ketika switch antara login dan register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {isLogin ? "Sign in to your account" : "Sign up to get started"}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email address"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
