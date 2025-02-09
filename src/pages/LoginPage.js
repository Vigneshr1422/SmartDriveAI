import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { loginUser } from "../services/authService"; // Your service for login
import { getUserRole } from "../services/authService"; // Your service to get user role
import { toast } from "react-toastify"; // Import Toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import the Toast styling

const LoginPage = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [loading, setLoading] = useState(false); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate(); // Hook to navigate

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission
    setLoading(true); // Set loading to true while waiting for login

    try {
      // Login user using your authService
      const userCredential = await loginUser(email, password);
      const user = userCredential.user; // Get the logged-in user object

      // Get the user's role (assuming you store the role in Firestore)
      const role = await getUserRole(user.uid); // Function to fetch role from Firestore

      // Redirect to the appropriate dashboard based on role
      if (role === "admin") {
        navigate("/admin"); // Admin dashboard
      } else if (role === "manager") {
        navigate("/manager"); // Manager dashboard
      } else if (role === "student") {
        navigate("/student"); // Student dashboard
      } else {
        navigate("/unauthorized"); // Unauthorized access page
      }

      // Show success toast after successful login
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      // If an error occurs, show the appropriate error message based on Firebase error code
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("No user found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address. Please check your input.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false after the operation
    }
  };

  // Navigate to the Register page
  const navigateToRegister = () => {
    navigate("/register");
  };

  const handleErrorDismiss = () => {
    setErrorMessage(""); // Clear the error message when "OK" is clicked
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on change
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state on change
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="loader">Loading...</div> // Add a loading spinner here
            ) : (
              "Login"
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">
            <p>{errorMessage}</p>
            <button
              onClick={handleErrorDismiss}
              className="text-blue-600 hover:underline mt-2 font-semibold"
            >
              OK
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={navigateToRegister}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
