import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { FaUserAlt, FaEnvelope, FaBuilding, FaUsers, FaUserPlus, FaListAlt, FaChartBar, FaGraduationCap, FaFileInvoice, FaClipboardList, FaBell, FaHandshake, FaIndustry, FaChartPie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const adminRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            setAdminDetails(adminSnap.data());
          } else {
            console.error("Admin details not found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching admin details:", error);
        }
      } else {
        console.error("No admin is logged in.");
      }
      setLoading(false);
    };

    fetchAdminDetails();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

    return (
      <div className="admin-dashboard flex flex-col md:flex-row mt-16">
        {/* Profile Section */}
        <div className="profile-container flex flex-col items-center p-6 w-full md:w-1/4 h-auto md:h-screen justify-start md:justify-center">
          <div className="profile-icon mb-4">
            <FaUserAlt className="text-6xl text-gray-700" />
          </div>
          <div className="profile-details text-center w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Admin Profile</h3>
            {adminDetails ? (
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  <FaBuilding className="text-lg text-blue-500" />
                  <span><strong>Department:</strong> {adminDetails.department}</span>
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <FaEnvelope className="text-lg text-blue-500" />
                  <span><strong>Email:</strong> {adminDetails.email}</span>
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <FaUsers className="text-lg text-blue-500" />
                  <span><strong>Section:</strong> {adminDetails.section}</span>
                </div>
              </div>
            ) : (
              <p>Admin details not available.</p>
            )}
          </div>
    
          <div className="mt-4 md:mt-6 w-full">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-full w-full hover:bg-red-600 transition duration-300"
            >
              Log Out
            </button>
          </div>
        </div>
    
        {/* Dashboard Section */}
        <div className="dashboard-content w-full md:w-3/4 p-4 md:p-24 overflow-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Admin Dashboard</h2>
          <div className="icon-grid grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: FaUserPlus, label: "Add Student", path: "/add-student", color: "text-blue-500" },
              { icon: FaListAlt, label: "Student List", path: "/student-list", color: "text-green-500" },
              { icon: FaChartBar, label: "Annual Report", path: "/annual-report", color: "text-orange-500" },
              { icon: FaGraduationCap, label: "Placed Students", path: "/placed-students", color: "text-purple-500" },
              { icon: FaIndustry, label: "Company Details", path: "/company-details", color: "text-teal-500" },
              { icon: FaChartPie, label: "Statistics", path: "/statistics", color: "text-pink-500" },
              { icon: FaFileInvoice, label: "Generate Report", path: "/generate-report", color: "text-teal-500" },
              { icon: FaClipboardList, label: "Drive Details", path: "/drive-details", color: "text-indigo-500" },
              { icon: FaBell, label: "Notifications", path: "/notify", color: "text-yellow-500" },
              { icon: FaHandshake, label: "Training Partner", path: "/training-partner", color: "text-red-500" },
            ].map(({ icon: Icon, label, path, color }) => (
              <button
                key={path}
                className="icon-button flex flex-col items-center text-center p-3 md:p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
                onClick={() => handleNavigation(path)}
              >
                <Icon className={`text-2xl md:text-3xl ${color} mb-1 md:mb-2`} />
                <span className="text-sm md:text-base">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
    
};
  


export default AdminDashboard;
