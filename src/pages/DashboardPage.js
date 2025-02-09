import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After login, check user role and redirect
    const role = localStorage.getItem("role"); // or get from your auth system
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "student") {
      navigate("/student");
    } else {
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-500 to-purple-700">
      {/* Header Section with Bold Typography and Animation */}
      <header className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="container mx-auto text-center relative z-10 py-32 px-6">
          <h1 className="text-6xl font-extrabold leading-tight transform scale-110 animate-pulse">
            Start Your Journey Today!
          </h1>
          <p className="mt-4 text-xl text-opacity-75 animate-fadeIn">
            Transform your potential into success. The journey begins now.
          </p>
        </div>
      </header>

      {/* Main Content Area with Creative Cards and Animation */}
      <main className="flex-grow flex justify-center items-center py-16">
        <div className="space-y-8 px-6 md:px-12 text-center">
          <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md mx-auto transition-all transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
            <p className="text-2xl text-gray-700 font-semibold">
              You’re being redirected based on your role. Hold on!
            </p>
            <div className="mt-6 p-4 bg-teal-100 rounded-lg shadow-md">
              <p className="text-lg text-teal-600">Your personal journey is just about to begin!</p>
            </div>
          </div>
          <div className="text-sm text-gray-200">
            <p>Stay tuned for your personalized dashboard.</p>
          </div>
        </div>
      </main>

      {/* Footer Section with Hover Effect */}
      <footer className="bg-gray-900 py-6 text-center">
        <p className="text-sm text-gray-300 hover:text-teal-400 transition-colors duration-300">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;
