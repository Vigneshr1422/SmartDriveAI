// import React, { useEffect, useState } from "react";
// import { db } from "../auth/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { getAuth, signOut } from "firebase/auth";
// import { FaUserAlt, FaEnvelope, FaBuilding, FaUsers, FaUserPlus, FaListAlt, FaChartBar, FaGraduationCap, FaFileInvoice, FaClipboardList, FaBell, FaHandshake, FaIndustry, FaChartPie } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [adminDetails, setAdminDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdminDetails = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (user) {
//         try {
//           const adminRef = doc(db, "admins", user.uid);
//           const adminSnap = await getDoc(adminRef);

//           if (adminSnap.exists()) {
//             setAdminDetails(adminSnap.data());
//           } else {
//             console.error("Admin details not found in Firestore.");
//           }
//         } catch (error) {
//           console.error("Error fetching admin details:", error);
//         }
//       } else {
//         console.error("No admin is logged in.");
//       }
//       setLoading(false);
//     };

//     fetchAdminDetails();
//   }, []);

//   const handleLogout = async () => {
//     const auth = getAuth();
//     try {
//       await signOut(auth);
//       console.log("Logged out successfully");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         {/* New Loading Animation: Bouncing Dots */}
//         <div className="flex space-x-2">
//           <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
//           <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
//           <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dashboard flex">
//       {/* Left section: Profile without white container */}
//       <div className="profile-container flex flex-col items-center p-6 w-1/4 h-screen justify-center">
//         <div className="profile-icon mb-6">
//           <FaUserAlt className="text-6xl text-gray-700" />
//         </div>
//         <div className="profile-details text-center w-full">
//           <h3 className="text-xl font-semibold mb-4">Admin Profile</h3>
//           {adminDetails ? (
//             <div className="space-y-4">
//               <div className="flex justify-center items-center space-x-2">
//                 <FaBuilding className="text-lg text-blue-500" />
//                 <span><strong>Department:</strong> {adminDetails.department}</span>
//               </div>
//               <div className="flex justify-center items-center space-x-2">
//                 <FaEnvelope className="text-lg text-blue-500" />
//                 <span><strong>Email:</strong> {adminDetails.email}</span>
//               </div>
//               <div className="flex justify-center items-center space-x-2">
//                 <FaUsers className="text-lg text-blue-500" />
//                 <span><strong>Section:</strong> {adminDetails.section}</span>
//               </div>
//             </div>
//           ) : (
//             <p>Admin details not available.</p>
//           )}
//         </div>

//         {/* Log Out Button */}
//         <div className="mt-6 w-full">
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded-full w-full hover:bg-red-600 transition duration-300"
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {/* Right section: Dashboard content */}
//       <div className="dashboard-content w-3/4  p-25 p-24">
//         <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>
//         <div className="icon-grid grid grid-cols-3 gap-6"> {/* Updated to 3 columns */}
//           {/* Existing icons */}
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/add-student")}
//           >
//             <FaUserPlus className="text-3xl text-blue-500 mb-2" />
//             <span>Add Student</span>
//           </button>
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/student-list")}
//           >
//             <FaListAlt className="text-3xl text-green-500 mb-2" />
//             <span>Student List</span>
//           </button>
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/annual-report")}
//           >
//             <FaChartBar className="text-3xl text-orange-500 mb-2" />
//             <span>Annual Report</span>
//           </button>
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/placed-students")}
//           >
//             <FaGraduationCap className="text-3xl text-purple-500 mb-2" />
//             <span>Placed Students</span>
//           </button>

//           {/* Additional icons for company details and statistics */}
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/company-details")}
//           >
//             <FaIndustry className="text-3xl text-teal-500 mb-2" />
//             <span>Company Details</span>
//           </button>
//           <button
//   className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//   onClick={() => handleNavigation("/statistics")}
// >
//   <FaChartPie className="text-3xl text-pink-500 mb-2" />
//   <span>Statistics</span>
// </button>


//           {/* Remaining icons */}
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/generate-report")}
//           >
//             <FaFileInvoice className="text-3xl text-teal-500 mb-2" />
//             <span>Generate Report</span>
//           </button>
//           <button
//         className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//         onClick={() => handleNavigation("/drive-details")} // Navigate to DriveDetails page
//       >
//         <FaClipboardList className="text-3xl text-indigo-500 mb-2" />
//         <span>Drive Details</span>
//       </button>
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/notify")}
//           >
//             <FaBell className="text-3xl text-yellow-500 mb-2" />
//             <span>Notifications</span>
//           </button>
//           <button
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//             onClick={() => handleNavigation("/training-partner")}
//           >
//             <FaHandshake className="text-3xl text-red-500 mb-2" />
//             <span>Training Partner</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

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
    <div className="admin-dashboard flex">
      <div className="profile-container flex flex-col items-center p-6 w-1/4 h-screen justify-center">
        <div className="profile-icon mb-6">
          <FaUserAlt className="text-6xl text-gray-700" />
        </div>
        <div className="profile-details text-center w-full">
          <h3 className="text-xl font-semibold mb-4">Admin Profile</h3>
          {adminDetails ? (
            <div className="space-y-4">
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

        <div className="mt-6 w-full">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-full w-full hover:bg-red-600 transition duration-300"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="dashboard-content w-3/4 p-24">
        <h2 className="text-3xl font-semibold mb-6">Admin Dashboard</h2>
        <div className="icon-grid grid grid-cols-3 gap-6">
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/add-student")}>
            <FaUserPlus className="text-3xl text-blue-500 mb-2" />
            <span>Add Student</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/student-list")}>
            <FaListAlt className="text-3xl text-green-500 mb-2" />
            <span>Student List</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/annual-report")}>
            <FaChartBar className="text-3xl text-orange-500 mb-2" />
            <span>Annual Report</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/placed-students")}>
            <FaGraduationCap className="text-3xl text-purple-500 mb-2" />
            <span>Placed Students</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/company-details")}>
            <FaIndustry className="text-3xl text-teal-500 mb-2" />
            <span>Company Details</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/statistics")}>
            <FaChartPie className="text-3xl text-pink-500 mb-2" />
            <span>Statistics</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/generate-report")}>
            <FaFileInvoice className="text-3xl text-teal-500 mb-2" />
            <span>Generate Report</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/drive-details")}>
            <FaClipboardList className="text-3xl text-indigo-500 mb-2" />
            <span>Drive Details</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/notify")}>
            <FaBell className="text-3xl text-yellow-500 mb-2" />
            <span>Notifications</span>
          </button>
          <button className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100" onClick={() => handleNavigation("/training-partner")}>
            <FaHandshake className="text-3xl text-red-500 mb-2" />
            <span>Training Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
