import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-white text-black p-4 shadow-md w-full z-50 transition-all duration-700 ease-in-out fixed top-0 left-0 ${
        isScrolled ? "backdrop-blur-md bg-opacity-90 opacity-100" : "opacity-100"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-2">
          <img src="/Tra.png" alt="Logo" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Traz</h1>
            <p className="text-sm text-gray-500">Drive AI</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-500 hover:text-black transition">Home</Link>
          <Link to="/why-choose" className="text-gray-500 hover:text-black transition">
  About
</Link>
          <Link to="/pricing" className="text-gray-500 hover:text-black transition">Features</Link>
          {/* <Link to="/contact" className="text-gray-500 hover:text-black transition">Contact</Link> */}
          <Link to="/login" className="flex items-center text-gray-500 hover:text-black transition">
            <span className="material-icons"></span> Log In
          </Link>
          {/* Updated Get Started Button */}
          <Link to="/register">
            <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-md hover:bg-yellow-500 transition">
              Get Started
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
