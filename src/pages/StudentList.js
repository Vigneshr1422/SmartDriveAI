import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../auth/firebase"; // Update the path to match your Firebase config
import { useNavigate } from "react-router-dom"; // Import useNavigate

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // For toggling edit mode
  const [currentStudent, setCurrentStudent] = useState(null); // Holds the current student's data for editing
  const [toastMessage, setToastMessage] = useState(""); // For toast notification
  const navigate = useNavigate(); // Using useNavigate for navigation

  // Fetch students saved by the logged-in admin
  const fetchStudents = async () => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid; // Get admin UID

      if (!adminUid) {
        console.error("Admin not authenticated.");
        setLoading(false);
        return;
      }

      // Reference the 'students' sub-collection under the admin's document
      const studentsRef = collection(db, `class-students/${adminUid}/students`);

      // Fetch all documents in ascending order of roll number
      const q = query(studentsRef, orderBy("regNo"));
      const querySnapshot = await getDocs(q);

      // Map the documents into student objects
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Student data
      }));

      // Sort by roll number within Reg No (last 3 digits)
      studentList.sort((a, b) => {
        const rollA = parseInt(a.regNo.slice(-3), 10); // Extract last 3 digits
        const rollB = parseInt(b.regNo.slice(-3), 10);
        return rollA - rollB;
      });

      setStudents(studentList); // Update the state with fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  // Handle editing a student's details
  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsEditing(true); // Set the form to editing mode
  };

  // Handle saving the updated details
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const studentRef = doc(db, `class-students/${getAuth().currentUser?.uid}/students`, currentStudent.id);

      // Update the student document in Firestore
      await updateDoc(studentRef, currentStudent);

      // Close the editing form
      setIsEditing(false);
      setCurrentStudent(null);
      fetchStudents(); // Refresh the list of students

      // Show toast message
      setToastMessage("Student details updated successfully!");
      setTimeout(() => setToastMessage(""), 3000); // Hide toast after 3 seconds

    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Render loading state or table view
  return (
<div className="p-6 mt-16"> 
      
      <h2 className="text-2xl font-bold mb-4">Admin's Students</h2>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      {loading ? (
        <p>Loading students...</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto"> {/* Scrollable table wrapper */}
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">Reg No</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">DoB</th>
                <th className="border border-gray-300 px-4 py-2">Gender</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">10th %</th>
                <th className="border border-gray-300 px-4 py-2">12th %</th>
                <th className="border border-gray-300 px-4 py-2">UG %</th>
                <th className="border border-gray-300 px-4 py-2">PG %</th>
                <th className="border border-gray-300 px-4 py-2">Year of Passing</th>
                <th className="border border-gray-300 px-4 py-2">Email</th> {/* New Email Column */}
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.regNo || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.dob || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.gender || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.address || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.tenth || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.twelfth || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.ug || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.pg || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.passedOutYear || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.email || "N/A"}</td> {/* Display Email */}
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students found.</p>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
        >
          Back
        </button>
      </div>

      {/* Edit Form Modal */}
      {isEditing && currentStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 md:w-3/4 lg:w-2/3 xl:w-1/2">
            <h3 className="text-xl font-bold mb-4">Edit Student Details</h3>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-2">Reg No:</label>
                <input
                  type="text"
                  name="regNo"
                  value={currentStudent.regNo || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentStudent.name || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">DoB:</label>
                <input
                  type="date"
                  name="dob"
                  value={currentStudent.dob || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Gender:</label>
                <input
                  type="text"
                  name="gender"
                  value={currentStudent.gender || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={currentStudent.address || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">10th %:</label>
                <input
                  type="number"
                  name="tenth"
                  value={currentStudent.tenth || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">12th %:</label>
                <input
                  type="number"
                  name="twelfth"
                  value={currentStudent.twelfth || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">UG %:</label>
                <input
                  type="number"
                  name="ug"
                  value={currentStudent.ug || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">PG %:</label>
                <input
                  type="number"
                  name="pg"
                  value={currentStudent.pg || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Year of Passing:</label>
                <input
                  type="number"
                  name="passedOutYear"
                  value={currentStudent.passedOutYear || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Email:</label> {/* New Email Input Field */}
                <input
                  type="email"
                  name="email"
                  value={currentStudent.email || ""}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
