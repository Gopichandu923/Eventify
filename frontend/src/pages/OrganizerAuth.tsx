import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, logIn } from "../api";

const OrganizerAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { name, email, password } = formData; // Redirect if the user already has a valid token

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/organizer/dashboard");
    }
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authFunction = isLogin ? logIn : signUp;
      const res = await authFunction(formData);
      console.log(res.data.user);
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("organizerName", res.data.user.name);

      navigate("/organizer/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Authentication failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl">
           {" "}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? "Organizer Login" : "Organizer Sign Up"}     {" "}
      </h2>
           {" "}
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}
        className="w-full mb-6 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150"
      >
                Switch to {isLogin ? "Sign Up" : "Login"}     {" "}
      </button>
           {" "}
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
           {" "}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
               {" "}
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required={!isLogin}
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        )}
               {" "}
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <button
          type="submit"
          className="mt-4 p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
        >
                    {isLogin ? "Login" : "Sign Up"}       {" "}
        </button>
             {" "}
      </form>
         {" "}
    </div>
  );
};

export default OrganizerAuth;
