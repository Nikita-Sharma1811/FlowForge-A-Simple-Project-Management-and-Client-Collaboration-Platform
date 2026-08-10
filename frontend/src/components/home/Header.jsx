import { nav } from "framer-motion/client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = ({ onLoginClick, onRegisterClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    setUser(authUser);
    console.log("User:", authUser);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed w-full bg-[#282f3c] backdrop-blur-md z-50 border-b text-white border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xl font-bold ">TaskVerse</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors text-white hover:text-blue-700`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            {!user ? (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="text-sm font-medium text-white hover:text-blue-600 transition-colors"
                >
                  Sign In 
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-base font-medium px-3 py-2 rounded-lg transition-colors text-blue-600 bg-blue-50`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="text-base font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRegisterClick();
                }}
                className="text-base font-medium bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
