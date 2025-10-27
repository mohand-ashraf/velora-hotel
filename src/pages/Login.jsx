import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdErrorOutline,
  MdOutlineMailOutline,
  MdArrowBackIosNew,
} from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { LuLockKeyhole } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!email && !password) {
      toast.error("Please enter both email and password");
      return;
    } else if (!email) {
      toast.error("Please enter your email");
      return;
    } else if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      dispatch(
        loginSuccess({
          user: matchedUser,
          token: "fake-token",
        })
      );

      toast.success("Login successful!");
      setShowWelcome(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9] overflow-hidden px-2">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-[9999] flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-[#f0e3d1] hover:shadow-lg transition-all duration-300"
      >
        <MdArrowBackIosNew className="text-[#5c4327] text-[20px] relative right-[1px]" />
      </button>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5efe6] z-50"
          >
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[#5c4327] text-[40px] font-bold mb-2"
            >
              Welcome! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[#6b5b3e] text-[20px] font-medium"
            >
              {JSON.parse(localStorage.getItem("currentUser"))?.username ||
                "User"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <div className="bg-white pt-[60px] pb-[50px] rounded-2xl px-7 shadow-[0_0_40px_10px_rgba(233,220,201,0.8)] w-full max-w-[90%] sm:w-[375px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="font-Playwrite text-center text-[35px] font-semibold mb-3 text-[#5c4327]">
          Log In
        </h1>
        <p className="text-center text-[14px] mb-[70px] text-[#6b5b3e]">
          Enter your account
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <MdOutlineMailOutline className="text-[28px] text-[#5c4327] ml-4" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouchedEmail(true)}
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {touchedEmail &&
                (email === "" ? (
                  <MdErrorOutline className="text-[24px] text-red-500 mr-3" />
                ) : (
                  <FaCheck className="text-[24px] text-[#5c4327] mr-3" />
                ))}
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <LuLockKeyhole className="text-[28px] text-[#5c4327] ml-4" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouchedPassword(true)}
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {touchedPassword &&
                (password === "" ? (
                  <MdErrorOutline className="text-[24px] text-red-500 mr-3" />
                ) : (
                  <FaCheck className="text-[24px] text-[#5c4327] mr-3" />
                ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="text-white my-4 mx-auto transition-all duration-300 text-[18px] font-medium py-[8px] hover:bg-[#a07652] bg-[#b08968] rounded-xl w-full"
          >
            Log In
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#6b5b3e] mt-2">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#b08968] font-bold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
