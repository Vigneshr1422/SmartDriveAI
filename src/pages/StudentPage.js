import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import {
  FaUserAlt,
  FaFileAlt,
  FaCalendarAlt,
  FaBook,
  FaHistory,
  FaCommentAlt,
  FaRobot,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);

    const fetchStudentDetails = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const studentRef = doc(db, "students", user.uid);
          const studentSnap = await getDoc(studentRef);

          if (studentSnap.exists()) {
            setStudentDetails(studentSnap.data());
          } else {
            console.error("Student details not found.");
          }
        } else {
          console.error("No student is logged in.");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1200);
      }
    };

    fetchStudentDetails();
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

  return (
<div className="student-dashboard flex flex-col items-center min-h-screen bg-gray-100 pt-28 pb-6 px-4">
{isLoading ? (
    <div className="flex flex-col items-center">
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p className="mt-3 text-gray-700 font-semibold animate-pulse">
        Fetching your data...
      </p>
    </div>
  ) : (
    <div
      className={`flex flex-col md:flex-row w-full max-w-4xl space-y-6 md:space-x-6 p-4 md:p-6 transition-all duration-700 ease-out transform ${
        animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {/* Profile Card */}
      <div className="profile-container flex flex-col items-center bg-white shadow-xl p-4 md:p-6 rounded-lg w-full md:w-1/3 h-auto transform transition-all duration-700 ease-out hover:scale-105">
        <FaUserAlt className="text-5xl md:text-6xl text-gray-700 mb-4" />
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          Student Profile
        </h3>
        {studentDetails ? (
          <>
            <p className="text-gray-600">
              <strong>Department:</strong> {studentDetails.department}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {studentDetails.email}
            </p>
            <p className="text-gray-600">
              <strong>Section:</strong> {studentDetails.section}
            </p>
          </>
        ) : (
          <p className="text-gray-600">Student details not available.</p>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg w-full hover:bg-red-600 mt-4 md:mt-6 transition-all duration-300"
        >
          Log Out
        </button>
      </div>

      {/* Dashboard Features */}
      <div className="dashboard-content w-full md:w-2/3 p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-center">
          Student Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FaFileAlt,
              label: "Resume Check",
              action: () => navigate("/resume-click"),
              color: "blue-500",
            },
            {
              icon: FaCalendarAlt,
              label: "Upcoming Drives",
              action: () => navigate("/drivestu"),
              color: "green-500",
            },
            {
              icon: FaHistory,
              label: "Placement History",
              action: () => navigate("/placehistory"),
              color: "purple-500",
            },
            {
              icon: FaRobot,
              label: "Mock Interview",
              action: () => navigate("/mock-interview"),
              color: "indigo-500",
            },
          ].map(({ icon: Icon, label, action, color }, index) => (
            <button
              key={index}
              onClick={action}
              className="icon-button flex flex-col items-center text-center p-3 md:p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 transform transition-all duration-500 hover:scale-105"
            >
              <Icon className={`text-2xl md:text-3xl text-${color} mb-1 md:mb-2`} />
              <span className="text-sm md:text-base">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default StudentPage;


// import React, { useEffect, useState } from "react";
// import { db } from "../auth/firebase"; // Your Firestore configuration
// import { doc, getDoc } from "firebase/firestore"; // Firestore functions
// import { getAuth, signOut } from "firebase/auth"; // Firebase Authentication for log out
// import {
//   FaUserAlt,
//   FaFileAlt,
//   FaCalendarAlt,
//   FaBook,
//   FaHistory,
//   FaCommentAlt,
//   FaRobot, // Added icon for Mock Interview
// } from "react-icons/fa"; // Icons for features
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook for routing

// const StudentPage = () => {
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate(); // Initialize navigate function

//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (user) {
//           const studentRef = doc(db, "students", user.uid); // Use the UID to fetch the correct student document
//           const studentSnap = await getDoc(studentRef);

//           if (studentSnap.exists()) {
//             setStudentDetails(studentSnap.data());
//           } else {
//             console.error("Student details not found in Firestore.");
//           }
//         } else {
//           console.error("No student is logged in.");
//         }
//       } catch (error) {
//         console.error("Error fetching student details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentDetails();
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

//   if (loading) {
//     return <div>Loading student details...</div>;
//   }

//     return (
//       <div className="student-dashboard flex justify-center items-center h-screen">
//         {/* Left section: Profile */}
//         <div className="profile-container flex flex-col items-center bg-white shadow-lg p-6 rounded-lg w-1/4 h-auto">
//           <div className="profile-icon mb-6">
//             <FaUserAlt className="text-6xl text-gray-700" />
//           </div>
//           <div className="profile-details text-center">
//             <h3 className="text-xl font-semibold mb-4">Student Profile</h3>
//             {studentDetails ? (
//               <>
//                 <p>
//                   <strong>Department:</strong> {studentDetails.department}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {studentDetails.email}
//                 </p>
//                 <p>
//                   <strong>Section:</strong> {studentDetails.section}
//                 </p>
//               </>
//             ) : (
//               <p>Student details not available.</p>
//             )}
//           </div>
    
//           {/* Log Out Button */}
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded-full w-full hover:bg-red-600 mt-6"
//           >
//             Log Out
//           </button>
//         </div>
    
//         {/* Right section: Dashboard Features */}
//         <div className="dashboard-content w-3/4 p-6">
//           <h2 className="text-3xl font-semibold mb-6 text-center">
//             Student Dashboard
//           </h2>
//           <div className="icon-grid grid grid-cols-3 gap-6">
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => navigate("/resume-click")}
//             >
//               <FaFileAlt className="text-3xl text-blue-500 mb-2" />
//               <span>Resume Check</span>
//             </button>
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => console.log("View Upcoming Drives")}
//             >
//               <FaCalendarAlt className="text-3xl text-green-500 mb-2" />
//               <span>Upcoming Drives</span>
//             </button>
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => console.log("Training & Resources")}
//             >
//               <FaBook className="text-3xl text-yellow-500 mb-2" />
//               <span>Training & Resources</span>
//             </button>
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => console.log("Placement History")}
//             >
//               <FaHistory className="text-3xl text-purple-500 mb-2" />
//               <span>Placement History</span>
//             </button>
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => console.log("Interview Preparation")}
//             >
//               <FaCommentAlt className="text-3xl text-red-500 mb-2" />
//               <span>Interview Prep</span>
//             </button>
    
//             {/* Mock Interview Button */}
//             <button
//               className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//               onClick={() => navigate("/mock-interview")}
//             >
//               <FaRobot className="text-3xl text-indigo-500 mb-2" />
//               <span>Mock Interview</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
    
  
// };

// export default StudentPage;
