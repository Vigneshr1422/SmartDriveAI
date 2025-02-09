import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../auth/firebase"; // Firestore configuration
import { getAuth } from "firebase/auth"; // Firebase authentication
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentEntry = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    dob: "",
    gender: "",
    email: "", // Added email field
    tenth: "",
    twelfth: "",
    ug: "",
    pg: "",
    address: "",
    passedOutYear: "",
  });

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (formData.passedOutYear < 1900) {
      toast.error("Please enter a valid year (greater than 1900).");
      return;
    }

    setLoading(true);

    try {
      // Add the document to Firestore under the admin-specific folder
      const docRef = await addDoc(
        collection(db, `class-students/${user.uid}/students`),
        {
          ...formData,
          adminEmail: user.email, // Associate the admin's email
        }
      );

      toast.success("Data saved successfully!");
      console.log("Document written with ID: ", docRef.id);

      // Reset the form
      setFormData({
        regNo: "",
        name: "",
        dob: "",
        gender: "",
        email: "", // Reset email field
        tenth: "",
        twelfth: "",
        ug: "",
        pg: "",
        address: "",
        passedOutYear: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6 mt-20">
        <div className="container mx-auto bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Entry</h2>

          {/* Form */}
          <form onSubmit={handleManualSubmit}>
            {/* Registration Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration No
              </label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter registration number"
                required
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter student's full name"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter student's email"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter address"
                required
              />
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["tenth", "twelfth", "ug", "pg"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {`${field.charAt(0).toUpperCase() + field.slice(1)} Grade Percentage`}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder={`Enter ${field} grade percentage`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Passed-Out Year */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passed-Out Year
              </label>
              <input
                type="number"
                name="passedOutYear"
                value={formData.passedOutYear}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter passed-out year"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default StudentEntry;
