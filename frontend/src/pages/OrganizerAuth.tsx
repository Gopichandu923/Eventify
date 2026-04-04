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
    <div className="min-h-[70vh] md:min-h-[80vh] flex items-start justify-center pt-2 md:pt-4 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#0a0a0c]"> </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-card rounded-[2rem] overflow-hidden border-white/10 shadow-2xl relative">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-center text-white relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl -mr-12 -mt-12"></div>
          <h2 className="text-2xl font-black tracking-tight mb-0.5 uppercase italic">Eventify Hub</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${isLogin ? "bg-white text-indigo-600 shadow-xl" : "text-gray-500 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${!isLogin ? "bg-white text-indigo-600 shadow-xl" : "text-gray-500 hover:text-white"}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.2em] mb-3 text-center transition-all">
                {isLogin ? "GOOGLE LOGIN PROTOCOL" : "GOOGLE NODE ENROLLMENT"}
              </p>
              {googleInit && (
                <div className="w-full transform transition-transform hover:scale-[1.01]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Access Failed")}
                    theme="filled_black"
                    shape="pill"
                    width="320"
                    text={isLogin ? "signin_with" : "signup_with"}
                  />
                </div>
              )}
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-shake">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={onChange}
                    required={!isLogin}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white text-sm"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Digital Mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secret Key</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isLogin ? "Enter Portal" : "Join Network"}</span>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 text-center space-y-4">
            <div className="flex justify-center items-center gap-2 text-gray-500 text-[10px] uppercase font-black tracking-widest">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Connection Established
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerAuth;
