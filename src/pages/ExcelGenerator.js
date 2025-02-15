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
    <div className="p-6 sm:p-8 flex flex-col items-center mt-24 bg-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
  
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center tracking-wide">
        🎓 Export Filtered Students
      </h2>
  
      {/* Filter Inputs Container */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Filter Criteria</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {["tenth", "twelfth", "ug", "pg"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                {field} %
              </label>
              <input
                type="number"
                name={field}
                value={filterCriteria[field] || ""}
                onChange={handleFilterChange}
                placeholder={`Min ${field} %`}
                className="border border-gray-300 p-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          ))}
        </div>
      </div>
  
      {/* Additional Fields */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-3xl mt-14">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">🏢 Additional Details</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {["companyName", "role", "location", "salary"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                value={manualFields[field] || ""}
                onChange={handleManualFieldChange}
                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                className="border border-gray-300 p-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-green-400 outline-none transition"
              />
            </div>
          ))}
        </div>
      </div>
  
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base shadow-md hover:bg-blue-700 transition"
        >
          🔍 Apply Filters
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base shadow-md hover:bg-green-700 transition"
        >
          📤 Export to Excel
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-6 rounded-lg text-sm sm:text-base shadow-md hover:bg-gray-600 transition"
        >
          ⬅️ Back
        </button>
      </div>

  
      {/* Filtered Students Table */}
      {filteredStudents.length > 0 ? (
        <div className="w-full overflow-x-auto mt-8">
          <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg text-sm sm:text-base">
            <thead className="bg-blue-500 text-white">
              <tr>
                {["S.No", "Reg No", "Name", "10th %", "12th %", "UG %", "PG %"].map((heading, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2 text-center min-w-[100px]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
  
            <tbody className="bg-white">
              {filteredStudents.map((student, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.regNo || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.tenth || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.twelfth || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.ug || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{student.pg || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-gray-600 text-sm">⚠️ No students match the criteria.</p>
      )}
    </div>
  );
  
};

export default ExcelGenerator;
