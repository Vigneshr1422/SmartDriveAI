import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/videos/security.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Unauthorized Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/20 backdrop-blur-lg shadow-xl 
                   p-8 rounded-lg text-center w-[400px]"
      >
        <h2 className="text-4xl font-bold text-white">Access Denied 🚫</h2>
        <p className="text-lg text-gray-200 mt-2">
          You don't have permission to view this page.
        </p>

        <button
  className="mt-5 px-6 py-2 bg-red-600 hover:bg-red-700 text-white 
             rounded-lg transition duration-300 shadow-md"
  onClick={() => navigate("/")}
>
  🔙 Return to Home
</button>

      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
