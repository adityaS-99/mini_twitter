import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailed } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);

    const url = isSignup
      ? "http://localhost:8000/api/auth/signup"
      : "http://localhost:8000/api/auth/signin";

    try {
      const res = await axios.post(url, formData, { withCredentials: true });
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      

      <div className="bg-black text-white rounded-2xl w-11/12 sm:w-[420px] px-8 py-8 shadow-lg relative">
        {/* X Logo */}
        <div className="flex justify-center mb-6 mt-2">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-8 h-8 text-white"
            fill="currentColor"
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.5 11.24h-6.65l-5.207-6.82-5.957 6.82H1.7l7.73-8.85L1.2 2.25h6.77l4.713 6.197 5.56-6.197z"></path>
            </g>
          </svg>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-extrabold text-center mb-8">
          Join X today
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignup ? "Join Twitter today" : "Sign in to Twitter"}
          </h2> */}

          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-500 py-3 px-5 focus:outline-none focus:border-blue-500"
            />
          )}

          {!isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-500 py-3 px-5 focus:outline-none focus:border-blue-500"
            />
          )}

          {isSignup && (
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-500 py-3 px-5 focus:outline-none focus:border-blue-500"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-500 py-3 px-5 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`rounded-full py-3 font-semibold mt-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200 transition"
            }`}
          >
            {loading
              ? "Loading..."
              : isSignup
              ? "Sign up"
              : "Sign in"}
          </button>

          <p className="text-center text-gray-400 text-lg mt-2">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsSignup(false)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setIsSignup(true)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </form>
        {/* Terms */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          By signing up, you agree to the{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          , including{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Cookie Use
          </a>
          .
        </p>

      </div>
    </div>
  );
};

export default AuthPage;
