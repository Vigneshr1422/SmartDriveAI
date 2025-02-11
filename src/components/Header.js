// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Link as ScrollLink } from "react-scroll";

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 80) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <header
//       className={`bg-white text-black p-4 shadow-md w-full z-50 transition-all duration-700 ease-in-out fixed top-0 left-0 ${
//         isScrolled ? "backdrop-blur-md bg-opacity-90 opacity-100" : "opacity-100"
//       }`}
//     >
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo and Branding */}
//         <div className="flex items-center space-x-2">
//           <img src="/Tra.png" alt="Logo" className="w-8 h-8" />
//           <div>
//             <h1 className="text-xl font-bold">Traz</h1>
//             <p className="text-sm text-gray-500">Drive AI</p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex items-center space-x-6">
//           <Link to="/" className="text-gray-500 hover:text-black transition">
//             Home
//           </Link>
//           {/* <ScrollLink
//             to="home"
//             smooth={true}
//             duration={500}
//             className="cursor-pointer text-gray-500 hover:text-black transition"
//           >
//             Home
//           </ScrollLink> */}

//           {/* Smooth Scroll Links */}
//           <ScrollLink
//             to="about"
//             smooth={true}
//             duration={500}
//             className="cursor-pointer text-gray-500 hover:text-black transition"
//           >
//             About
//           </ScrollLink>

//           <ScrollLink
//             to="features"
//             smooth={true}
//             duration={500}
//             className="cursor-pointer text-gray-500 hover:text-black transition"
//           >
//             Features
//           </ScrollLink>

//           <Link to="/login" className="flex items-center text-gray-500 hover:text-black transition">
//             <span className="material-icons"></span> Log In
//           </Link>

//           {/* Get Started Button */}
//           <Link to="/register">
//             <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-md hover:bg-yellow-500 transition">
//               Get Started
//             </button>
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section
      const sections = ["home", "about", "features"];
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-700 ease-in-out ${
        isScrolled
          ? "backdrop-blur-md bg-white bg-opacity-90 shadow-lg opacity-100"
          : "bg-white opacity-100"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/drive.png" alt="Logo" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Drive AI 🔍</h1>
            <p className="text-sm text-gray-500">Record...</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {/* If on Home Page, use Smooth Scroll, else Route */}
          {location.pathname === "/" ? (
            <>
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                offset={-80} // Adjust for header height
                className={`cursor-pointer transition ${
                  activeSection === "home" ? "text-black font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                Home
              </ScrollLink>
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-80}
                className={`cursor-pointer transition ${
                  activeSection === "about" ? "text-black font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                About
              </ScrollLink>
              <ScrollLink
                to="features"
                smooth={true}
                duration={500}
                offset={-80}
                className={`cursor-pointer transition ${
                  activeSection === "features" ? "text-black font-bold" : "text-gray-500 hover:text-black"
                }`}
              >
                Features
              </ScrollLink>
            </>
          ) : (
            <Link to="/" className="text-gray-500 hover:text-black transition">
              Home
            </Link>
          )}

          <Link to="/login" className="flex items-center text-gray-500 hover:text-black transition">
            Log In
          </Link>

          {/* Get Started Button */}
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
