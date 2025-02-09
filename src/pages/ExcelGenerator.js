import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../auth/firebase"; // Update the path to match your Firebase config
import { utils, writeFile } from "xlsx";
import toast, { Toaster } from "react-hot-toast"; // Add react-hot-toast

const ExcelGenerator = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    tenth: "",
    twelfth: "",
    ug: "",
    pg: "",
  });
  const [manualFields, setManualFields] = useState({
    companyName: "",
    role: "",
    location: "",
    salary: "",
  });

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;

      if (!adminUid) {
        console.error("Admin not authenticated.");
        return;
      }

      const studentsRef = collection(db, `class-students/${adminUid}/students`);
      const q = query(studentsRef, orderBy("regNo"));
      const querySnapshot = await getDocs(q);

      const studentList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setStudents(studentList);
      setFilteredStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualFieldChange = (e) => {
    const { name, value } = e.target;
    setManualFields((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = students.filter((student) => {
      const passesTenth = filterCriteria.tenth
        ? student.tenth >= parseFloat(filterCriteria.tenth)
        : true;
      const passesTwelfth = filterCriteria.twelfth
        ? student.twelfth >= parseFloat(filterCriteria.twelfth)
        : true;
      const passesUG = filterCriteria.ug
        ? student.ug >= parseFloat(filterCriteria.ug)
        : true;
      const passesPG = filterCriteria.pg
        ? student.pg >= parseFloat(filterCriteria.pg)
        : true;

      return passesTenth && passesTwelfth && passesUG && passesPG;
    });

    setFilteredStudents(filtered);
  };

  const exportToExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export!");
      return;
    }

    const dataToExport = filteredStudents.map((student) => ({
      "Company Name": manualFields.companyName || "N/A",
      Role: manualFields.role || "N/A",
      Location: manualFields.location || "N/A",
      Salary: manualFields.salary || "N/A",
      "Reg No": student.regNo || "N/A",
      Name: student.name || "N/A",
      "10th %": student.tenth || "N/A",
      "12th %": student.twelfth || "N/A",
      "UG %": student.ug || "N/A",
      "PG %": student.pg || "N/A",
    }));

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Filtered Students");

    writeFile(workbook, "Filtered_Students.xlsx");

    toast.success("Excel file generated successfully!");
  };

  return (
<div className=" p-6 flex flex-col items-center mt-16">
<Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-4">Export Filtered Students</h2>

      {/* Filter Inputs */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {["tenth", "twelfth", "ug", "pg"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {field} %
            </label>
            <input
              type="number"
              name={field}
              value={filterCriteria[field] || ""}
              onChange={handleFilterChange}
              placeholder={`Min ${field} %`}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        ))}
      </div>

      {/* Manual Input Fields */}
      <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {["companyName", "role", "location", "salary"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={manualFields[field] || ""}
              onChange={handleManualFieldChange}
              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        ))}
      </div>

      {/* Filter and Export Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {/* Filtered Students Table */}
      {filteredStudents.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">Reg No</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">10th %</th>
              <th className="border border-gray-300 px-4 py-2">12th %</th>
              <th className="border border-gray-300 px-4 py-2">UG %</th>
              <th className="border border-gray-300 px-4 py-2">PG %</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.regNo || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.tenth || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.twelfth || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.ug || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.pg || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No students match the criteria.</p>
      )}
    </div>
  );
};

export default ExcelGenerator;
