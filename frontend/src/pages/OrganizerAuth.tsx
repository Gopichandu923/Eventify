import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, logIn, googleAuth } from "../api";
import { GoogleLogin } from "@react-oauth/google";

const OrganizerAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleInit, setGoogleInit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/organizer/dashboard");
    }
    setGoogleInit(true);
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await googleAuth(credentialResponse.credential);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("organizerName", res.data.user.name);

      navigate("/organizer/dashboard");
    } catch (err) {
      setError("Failed to process Google Account info.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authFunction = isLogin ? logIn : signUp;
      const res = await authFunction(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("organizerName", res.data.user.name);
      navigate("/organizer/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <h2 className="text-3xl font-extrabold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-indigo-100">
              Sign in to manage your events
            </p>
          </div>

          <div className="p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg font-semibold ${isLogin ? "bg-indigo-600 text-white" : "bg-gray-100"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg font-semibold ${!isLogin ? "bg-indigo-600 text-white" : "bg-gray-100"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Section */}
            <div className="mb-6 flex flex-col items-center">
              {googleInit && (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                />
              )}
              <div className="relative flex py-5 items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">
                  Or use email
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={onSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg"
                  onChange={onChange}
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                onChange={onChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg"
                onChange={onChange}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                {loading
                  ? "Loading..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerAuth;
