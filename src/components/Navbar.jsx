import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Hotel, LogOut, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = user
    ? [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/signup", label: "Sign Up" },
      ];

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-gradient-to-r from-[#f9f5f0] via-[#f1e4d2] to-[#f9f5f0] backdrop-blur-xl border-b border-[#d6c4aa]/40 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide text-[#3a2f26] hover:text-[#b08c4b] transition-all"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={require("../assets/logo.png")}
              alt="HotelEase Logo"
              className="w-32 h-10 object-contain"
            />
          </Link>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-all duration-300 px-3 py-2 rounded-xl text-[1rem] ${
                location.pathname === item.path
                  ? "text-[#3a2f26] font-semibold bg-[#f0e6d5] shadow-inner"
                  : "hover:text-[#3a2f26] hover:bg-[#f0e6d5]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-[#f0e6d5] hover:bg-[#ead9bf] text-[#3a2f26] px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm w-max"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover border border-[#d9c4a3]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#b08c4b] text-white flex items-center justify-center font-semibold border border-[#d9c4a3]">
                    {getInitial(user.username)}
                  </div>
                )}

                <span className="font-semibold">{user.username}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown with fade + scale animation */}
              <div
                className={`absolute right-0 mt-2 w-full bg-white/95 border border-[#d9c4a3]/40 rounded-xl shadow-xl backdrop-blur-sm overflow-hidden z-50 transform transition-all duration-300 ${
                  userMenuOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[#3a2f26] hover:bg-[#f7efe2] transition-colors"
                >
                  <LogOut size={18} className="text-[#b08c4b]" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-[#f0e6d5] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#f8f3ec]/95 text-[#3a2f26] border-t border-[#d9c4a3] overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-5 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 px-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-[#3a2f26] font-semibold bg-[#f0e6d5]"
                  : "hover:text-[#3a2f26] hover:bg-[#f0e6d5]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <div className="flex flex-col gap-2 mt-3 border-t border-[#e5d9c7] pt-3">
              <div className="flex items-center justify-between w-full relative">
                <div className="flex items-center gap-2 w-full">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border border-[#d9c4a3]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#b08c4b] text-white flex items-center justify-center font-semibold border border-[#d9c4a3]">
                      {getInitial(user.username)}
                    </div>
                  )}
                  <span className="font-semibold">{user.username}</span>
                </div>
                <LogOut
                  size={20}
                  className="text-[#b08c4b] cursor-pointer hover:text-[#a07652]"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
