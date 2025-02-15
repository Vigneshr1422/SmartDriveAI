import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { registerUser } from "../services/authService"; // Your service for registration
import { addUserRole } from "../services/userService"; // Your service for adding a role
import { db, collection, doc, setDoc } from "../auth/firebase"; // Import Firestore functions

const RegisterPage = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [role, setRole] = useState("student"); // Default role is student
  const [department, setDepartment] = useState(""); // State for department
  const [section, setSection] = useState(""); // State for section
  const [studentKey, setStudentKey] = useState(""); // State for student key
  const [managerKey, setManagerKey] = useState(""); // State for manager key
  const [adminKey, setAdminKey] = useState(""); // State for admin key
  const [loading, setLoading] = useState(false); // State for loading
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const navigate = useNavigate(); // Hook to navigate

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission
    setLoading(true); // Start loading animation

    // Check if student key is valid when the selected role is 'student'
    if (role === "student" && studentKey !== "mca2025") {
      setLoading(false); // Stop loading animation
      setToastMessage("Invalid student key. Registration for student is restricted.");
      return; // Stop form submission if key is incorrect
    }

    // Check if manager key is valid when the selected role is 'manager'
    if (role === "manager" && managerKey !== "1422") {
      setLoading(false); // Stop loading animation
      setToastMessage("Invalid manager key. Registration for manager is restricted.");
      return; // Stop form submission if key is incorrect
    }

    // Check if admin key is valid when the selected role is 'admin'
    if (role === "admin" && adminKey !== "admin@1422") {
      setLoading(false); // Stop loading animation
      setToastMessage("Invalid admin key. Registration for admin is restricted.");
      return; // Stop form submission if key is incorrect
    }

    try {
      const userCredential = await registerUser(email, password); // Register user
      const user = userCredential.user; // Get the registered user object

      let userCollection;
      if (role === "student") {
        userCollection = "students"; // Use "students" collection for student
      } else if (role === "manager") {
        userCollection = "managers"; // Use "managers" collection for manager
      } else if (role === "admin") {
        userCollection = "admins"; // Use "admins" collection for admin
      }

      await setDoc(doc(collection(db, userCollection), user.uid), {
        email,
        role,
        department,
        section,
        studentKey: role === "student" ? studentKey : null,
        managerKey: role === "manager" ? managerKey : null,
        adminKey: role === "admin" ? adminKey : null,
      });

      await addUserRole(user.uid, role); // Assign role to the user
      setLoading(false);
      setToastMessage("Registration successful!");
      setTimeout(() => {
        navigate("/login"); // Redirect to the login page
      }, 2000);
    } catch (error) {
      setLoading(false);
      setToastMessage(error.message);
    }
  };

  return (
<div className="flex items-center justify-center h-auto pt-32 pb-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-6">
<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register a New Account
        </h2>
  
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
  
          <div>
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
  
          {(role === "student" || role === "admin") && (
            <>
              <div>
                <label htmlFor="department" className="block text-gray-700 font-medium mb-2">Department</label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Department</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="EC">EC</option>
                  <option value="CSSE">CSSE</option>
                  <option value="EEEE">EEEE</option>
                </select>
              </div>
  
              <div>
                <label htmlFor="section" className="block text-gray-700 font-medium mb-2">Section</label>
                <select
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Section</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </>
          )}
  
          {role === "student" && (
            <div>
              <label htmlFor="studentKey" className="block text-gray-700 font-medium mb-2">Student Key</label>
              <input
                type="text"
                id="studentKey"
                placeholder="Enter student key"
                value={studentKey}
                onChange={(e) => setStudentKey(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
  
          {role === "manager" && (
            <div>
              <label htmlFor="managerKey" className="block text-gray-700 font-medium mb-2">Manager Key</label>
              <input
                type="text"
                id="managerKey"
                placeholder="Enter manager key"
                value={managerKey}
                onChange={(e) => setManagerKey(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
  
          {role === "admin" && (
            <div>
              <label htmlFor="adminKey" className="block text-gray-700 font-medium mb-2">Admin Key</label>
              <input
                type="text"
                id="adminKey"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
  
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
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
                "Register"
              )}
            </button>
          </div>
        </form>
  
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs p-4 bg-green-500 text-white rounded-lg shadow-lg text-center">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default RegisterPage;
