import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdErrorOutline,
  MdOutlineMailOutline,
  MdArrowBackIosNew,
} from "react-icons/md";
import { FaCheck, FaRegUser } from "react-icons/fa";
import { LuLockKeyhole } from "react-icons/lu";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouchedFields({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      toast.error("This email is already registered");
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Account created successfully! Please log in.");
    navigate("/login");
  };

  const renderIcon = (fieldValue, fieldTouched) => {
    if (!fieldTouched) return null;
    return fieldValue === "" ? (
      <MdErrorOutline className="text-[24px] text-red-500 mr-3" />
    ) : (
      <FaCheck className="text-[24px] text-[#5c4327] mr-3" />
    );
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9] px-2 overflow-hidden">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-[9999] flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-[#f0e3d1] hover:shadow-lg transition-all duration-300"
      >
        <MdArrowBackIosNew className="text-[#5c4327] text-[20px] relative right-[1px]" />
      </button>

      <div className="bg-white pt-[60px] pb-[50px] rounded-2xl px-7 shadow-[0_0_40px_10px_rgba(233,220,201,0.8)] w-full max-w-[90%] sm:w-[375px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="font-Playwrite text-center text-[35px] font-semibold mb-3 text-[#5c4327]">
          Sign Up
        </h1>
        <p className="text-center text-[14px] mb-[50px] text-[#6b5b3e]">
          Create a new account
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <FaRegUser className="text-[22px] text-[#5c4327] ml-4" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, username: true }))
                }
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {renderIcon(username, touchedFields.username)}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <MdOutlineMailOutline className="text-[28px] text-[#5c4327] ml-4" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, email: true }))
                }
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {renderIcon(email, touchedFields.email)}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <LuLockKeyhole className="text-[28px] text-[#5c4327] ml-4" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, password: true }))
                }
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {renderIcon(password, touchedFields.password)}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center w-full h-[50px] bg-[#f5efe6] rounded-lg">
              <LuLockKeyhole className="text-[28px] text-[#5c4327] ml-4" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouchedFields((prev) => ({
                    ...prev,
                    confirmPassword: true,
                  }))
                }
                className="focus:outline-none w-full h-full px-3 bg-transparent placeholder:text-[#6b5b3e]"
              />
              {touchedFields.confirmPassword &&
                (confirmPassword === "" || confirmPassword !== password ? (
                  <MdErrorOutline className="text-[24px] text-red-500 mr-3" />
                ) : (
                  <FaCheck className="text-[24px] text-[#5c4327] mr-3" />
                ))}
            </div>
          </div>

          <button
            type="submit"
            className="text-white my-4 mx-auto transition-all duration-300 text-[18px] font-medium py-[8px] hover:bg-[#a07652] bg-[#b08968] rounded-xl w-full"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-[#6b5b3e] mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#b08968] font-bold hover:underline"
            >
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
