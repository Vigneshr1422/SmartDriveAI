import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // For Excel export

const AnnualReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const studentsRef = collection(
            db,
            `class-students/${user.uid}/students`
          );
          const studentSnap = await getDocs(studentsRef);
          const studentsList = studentSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.regNo.localeCompare(b.regNo)); // Sort by Reg No

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

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      setStatusUpdating(true);
      const studentRef = doc(
        db,
        `class-students/${getAuth().currentUser.uid}/students`,
        studentId
      );
      await updateDoc(studentRef, {
        placementStatus: newStatus,
      });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? { ...student, placementStatus: newStatus }
            : student
        )
      );

      setToastMessage(`Placement status updated to ${newStatus}`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Error updating placement status:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const formattedData = students.map(({ regNo, name, gender, passedOutYear, placementStatus }) => ({
      "Reg No": regNo,
      "Name": name,
      "Gender": gender,
      "Year of Passout": passedOutYear,
      "Placement Status": placementStatus || "Not Updated",
    }));
  
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
  
    XLSX.writeFile(wb, "Annual_Report.xlsx");
  
    // 🥂 Toast on successful download
    setToastMessage("Excel downloaded successfully!");
    setTimeout(() => setToastMessage(""), 3000);
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
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        Annual Report
      </h2>

      <div className="flex justify-center mb-4 gap-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 shadow-md"
        >
          📤 Export to Excel
        </button>

        <button
          onClick={handleBackButtonClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-md"
        >
          🔙 Back
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow-lg rounded-lg p-4 max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
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
                      onChange={(e) =>
                        handleStatusChange(student.id, e.target.value)
                      }
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

      {statusUpdating && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg text-sm animate-pulse">
          Updating...
        </div>
      )}
{/* Toast Notification */}
{toastMessage && (
  <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-fadeIn z-50">
    {toastMessage}
  </div>
)}

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AnnualReport;
