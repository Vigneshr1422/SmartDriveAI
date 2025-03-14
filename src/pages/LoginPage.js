// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser, getUserRole } from "../services/authService"; // Import login and role fetch service
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const userCredential = await loginUser(email, password);
//       const user = userCredential.user;

//       // Fetch user role and status
//       const { role, status } = await getUserRole(user.uid); 

//       // Prevent login if the admin is blocked
//       if (role === "admin" && status === "blocked") {
//         setErrorMessage("Your account has been blocked. Contact support.");
//         toast.error("Your account has been blocked. Contact support.", {
//           position: "top-right",
//           autoClose: 5000,
//         });
//         return;
//       }

//       // Redirect users based on role
//       if (role === "admin") navigate("/admin");
//       else if (role === "manager") navigate("/manager");
//       else if (role === "student") navigate("/student");
//       else navigate("/unauthorized");

//       toast.success("Login successful!", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } catch (error) {
//       if (error.code === "auth/wrong-password") {
//         setErrorMessage("Incorrect password. Please try again.");
//       } else if (error.code === "auth/user-not-found") {
//         setErrorMessage("No user found with this email.");
//       } else if (error.code === "auth/invalid-email") {
//         setErrorMessage("Invalid email address.");
//       } else {
//         setErrorMessage("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 px-4">
//       <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:w-96 mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
//           Login to Your Account
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
//             disabled={loading}
//           >
//             {loading ? (
//               <div className="flex justify-center items-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                 >
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path d="M22 12l-4-2" stroke="currentColor" strokeWidth="4" />
//                 </svg>
//                 Processing...
//               </div>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {errorMessage && (
//           <div className="mt-4 text-red-500 text-center">
//             <p>{errorMessage}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

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

<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 via-blue-300 to-gray-400 px-4">
<div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:w-96 mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
            Login to Your Account
          </h2>
    
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
    
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
    
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path d="M22 12l-4-2" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  Processing...
                </div>
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
