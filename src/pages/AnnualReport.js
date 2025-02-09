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
        <div className="text-gray-700 text-lg">wait panra ..</div>
      </div>
    );
  }

  return (
<div className="p-6 pt-24 bg-gray-50 min-h-screen relative">
<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Annual Report</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-gray-700 bg-gray-200">
            <tr>
              <th className="px-6 py-3">Reg No</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Year of Passout</th>
              <th className="px-6 py-3">Placement Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="bg-white border-b hover:bg-gray-100">
                <td className="px-6 py-4">{student.regNo}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.gender}</td>
                <td className="px-6 py-4">{student.passedOutYear}</td>
                <td className="px-6 py-4">
                  {student.placementStatus || "Not Updated"}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={student.placementStatus || ""}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
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
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleBackButtonClick}
          className="px-6 py-3 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700"
        >
          Back
        </button>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AnnualReport;
