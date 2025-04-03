import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase"; // Your Firestore configuration
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const AnnualReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(""); // For showing toast messages
  const navigate = useNavigate(); // Using useNavigate for navigation

  // Fetch students data from Firestore on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Fetch the students from Firestore
          const studentsRef = collection(db, `class-students/${user.uid}/students`);
          const studentSnap = await getDocs(studentsRef);
          const studentsList = studentSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setStudents(studentsList);
        } else {
          console.error("No admin is logged in.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle the status change (update placement status)
  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const studentRef = doc(db, `class-students/${getAuth().currentUser.uid}/students`, studentId);
      await updateDoc(studentRef, {
        placementStatus: newStatus,
      });

      // Update the local state after successful update
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? { ...student, placementStatus: newStatus } : student
        )
      );

      // Show toast message
      setToastMessage(`Placement status updated to ${newStatus}`);
      setTimeout(() => setToastMessage(""), 3000); // Hide toast after 3 seconds
    } catch (error) {
      console.error("Error updating placement status:", error);
    }
  };

  // Handle Back Button Click
  const handleBackButtonClick = () => {
    navigate(-1); // Use navigate(-1) to go back to the previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-700 text-lg">Wait Please ..</div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        Annual Report
      </h2>
  
      {/* Table Container */}
      <div className="overflow-hidden bg-white shadow-lg rounded-lg p-4 max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-blue-600 text-white text-left text-xs uppercase tracking-wider">
                <th className="px-4 py-3 border-r">Reg No</th>
                <th className="px-4 py-3 border-r">Name</th>
                <th className="px-4 py-3 border-r">Gender</th>
                <th className="px-4 py-3 border-r">Year of Passout</th>
                <th className="px-4 py-3 border-r">Placement Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
  
            {/* Table Body */}
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`border-b transition duration-200 text-gray-700 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-2 border-r">{student.regNo}</td>
                  <td className="px-4 py-2 border-r font-medium">{student.name}</td>
                  <td className="px-4 py-2 border-r">{student.gender}</td>
                  <td className="px-4 py-2 border-r">{student.passedOutYear}</td>
                  <td className="px-4 py-2 border-r font-semibold text-blue-700">
                    {student.placementStatus || "Not Updated"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={student.placementStatus || ""}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-xs"
                    >
                      <option value="">Select</option>
                      <option value="Placed">Placed</option>
                      <option value="Unplaced">Unplaced</option>
                      <option value="Not Willing">Not Willing</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Back Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleBackButtonClick}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition text-sm"
        >
          Back
        </button>
      </div>
  
      {/* Toast Notification - Now at Bottom Center */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
  
  
};

export default AnnualReport;
