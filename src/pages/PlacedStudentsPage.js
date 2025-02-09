import React, { useEffect, useState } from "react";
import { db } from "../auth/firebase"; // Your Firestore configuration
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // ToastContainer styles

const PlacedStudentsPage = () => {
  const [students, setStudents] = useState([]); // Store students' data
  const [loading, setLoading] = useState(true); // Loading state
  const [editing, setEditing] = useState({}); // Track which student is being edited
  const [saving, setSaving] = useState({}); // Track saving state per student
  const [selectedYear, setSelectedYear] = useState(""); // Year filter

  // Fetch students data from Firestore on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Fetch students collection for the admin
          const studentsRef = collection(db, `class-students/${user.uid}/students`);
          const studentSnap = await getDocs(studentsRef);
          const studentsList = studentSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((student) => student.placementStatus === "Placed"); // Filter placed students

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

  // Handle the year filter
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Filter students based on the selected year
  const filteredStudents = selectedYear
    ? students.filter((student) => student.passedOutYear === selectedYear)
    : students;

  // Toggle editing state for a specific student
  const toggleEdit = (studentId) => {
    setEditing((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId],
    }));
  };

  // Update student field values
  const handleInputChange = (e, studentId, field) => {
    const updatedStudents = students.map((student) =>
      student.id === studentId ? { ...student, [field]: e.target.value } : student
    );
    setStudents(updatedStudents);
  };

  // Save student data to Firestore
  const handleUpdateStudent = async (studentId) => {
    setSaving((prevState) => ({
      ...prevState,
      [studentId]: true,
    }));
    try {
      const studentRef = doc(db, `class-students/${getAuth().currentUser.uid}/students`, studentId);
      const studentData = students.find((student) => student.id === studentId);
      await updateDoc(studentRef, {
        companyName: studentData.companyName,
        role: studentData.role,
        package: studentData.package,
      });

      // Reset editing state for the student
      setEditing((prevState) => ({
        ...prevState,
        [studentId]: false,
      }));
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setSaving((prevState) => ({
        ...prevState,
        [studentId]: false,
      }));
    }
  };

  // Display loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h2 className="text-xl font-semibold mb-4">Placed Students</h2>

      {/* Dropdown to filter by year */}
      <div className="mb-4">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>
          {[...new Set(students.map((student) => student.passedOutYear))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Display students or no data message */}
      {filteredStudents.length === 0 ? (
        <p>No placed students found for the selected year.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="border p-4 rounded shadow-md bg-white hover:bg-gray-100"
            >
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Registration No:</strong> {student.regNo}
              </p>
              <p>
                <strong>Passed-Out Year:</strong> {student.passedOutYear}
              </p>

              {/* Editable fields */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={student.companyName || ""}
                  onChange={(e) => handleInputChange(e, student.id, "companyName")}
                  className="border p-2 rounded w-full"
                  placeholder="Company Name"
                  disabled={!editing[student.id]}
                />
                <input
                  type="text"
                  value={student.role || ""}
                  onChange={(e) => handleInputChange(e, student.id, "role")}
                  className="border p-2 rounded w-full"
                  placeholder="Role"
                  disabled={!editing[student.id]}
                />
                <input
                  type="text"
                  value={student.package || ""}
                  onChange={(e) => handleInputChange(e, student.id, "package")}
                  className="border p-2 rounded w-full"
                  placeholder="Package"
                  disabled={!editing[student.id]}
                />
              </div>

              {/* Save/Edit Buttons */}
              <div className="mt-2 flex space-x-2">
                {editing[student.id] ? (
                  <button
                    onClick={() => handleUpdateStudent(student.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                    disabled={saving[student.id]}
                  >
                    {saving[student.id] ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => toggleEdit(student.id)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PlacedStudentsPage;
