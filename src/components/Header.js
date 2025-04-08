


import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { IoMenu, IoClose } from "react-icons/io5";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-700 ${
        isScrolled ? "backdrop-blur-md bg-white shadow-lg" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
  <img src="/logoz.png" alt="Logo" className="w-8 h-8" />
  <h1 className="text-xl font-bold">SmartDrive AI</h1>
</Link>

        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {location.pathname === "/" ? (
            <>
              <ScrollLink to="home" smooth duration={500} offset={-80} className="hover:text-black transition">
                Home
              </ScrollLink>
              <ScrollLink to="about" smooth duration={500} offset={-80} className="hover:text-black transition">
                About
              </ScrollLink>
              <ScrollLink to="features" smooth duration={500} offset={-80} className="hover:text-black transition">
                Features
              </ScrollLink>
            </>
          ) : (
            <Link to="/" className="hover:text-black transition">Home</Link>
          )}

          <Link to="/login" className="hover:text-black transition">Log In</Link>
          <Link to="/register">
            <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition">
              Get Started
            </button>
          </Link>
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden" ref={menuRef}>
          <button
            className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-52 p-4 flex flex-col space-y-4 animate-fadeIn">
              {location.pathname === "/" ? (
                <>
                  <ScrollLink to="home" smooth duration={500} offset={-80} className="hover:text-black transition" onClick={() => setMenuOpen(false)}>
                    Home
                  </ScrollLink>
                  <ScrollLink to="about" smooth duration={500} offset={-80} className="hover:text-black transition" onClick={() => setMenuOpen(false)}>
                    About
                  </ScrollLink>
                  <ScrollLink to="features" smooth duration={500} offset={-80} className="hover:text-black transition" onClick={() => setMenuOpen(false)}>
                    Features
                  </ScrollLink>
                </>
              ) : (
                <Link to="/" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Home</Link>
              )}
              <Link to="/login" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
