import React, { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaBuilding,FaBriefcase,FaDollarSign,FaListAlt,FaMapMarkerAlt,FaTasks,FaCalendarAlt, FaBell } from 'react-icons/fa';

const DriveDetails = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDrive, setNewDrive] = useState({
    companyName: "",
    role: "",
    location: "",
    salary: "",
    date: "",
    rounds: "",
    status: "Not Conducted",
    studentCleared: "",
  });
  const [viewMode, setViewMode] = useState("buttons");
  const [toastMessage, setToastMessage] = useState("");
  const [editDrive, setEditDrive] = useState(null); // Track the drive being edited
  const navigate = useNavigate();

  // Fetch all drives from the Firestore
  const fetchDrives = async () => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;

      if (!adminUid) {
        console.error("Admin not authenticated.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const drivesRef = collection(db, `admin/${adminUid}/drives`);
      const q = query(drivesRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      const drivesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDrives(drivesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drives:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        fetchDrives();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDrive((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDriveSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;

      if (!adminUid) {
        console.error("Admin not authenticated.");
        return;
      }

      const driveRef = collection(db, `admin/${adminUid}/drives`);
      await addDoc(driveRef, newDrive);

      setToastMessage("Drive added successfully!");
      setTimeout(() => setToastMessage(""), 3000);

      setViewMode("buttons");
      fetchDrives();
    } catch (error) {
      console.error("Error adding drive:", error);
    }
  };

  const handleUpdateDrive = async (driveId, updatedFields) => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;

      if (!adminUid) {
        console.error("Admin not authenticated.");
        return;
      }

      const driveRef = doc(db, `admin/${adminUid}/drives`, driveId);
      await updateDoc(driveRef, updatedFields);

      setToastMessage("Drive updated successfully!");
      setTimeout(() => setToastMessage(""), 3000);

      fetchDrives(); // Fetch updated list of drives
    } catch (error) {
      console.error("Error updating drive:", error);
    }
  };

  const renderAddDriveForm = () => {
    return (
      <div className="w-full sm:max-w-md mx-auto bg-white shadow-lg rounded-xl mt-6 p-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🚀 Add New Drive</h3>
    
        <form onSubmit={handleAddDriveSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "companyName", placeholder: "Company Name", icon: <FaBuilding /> },
              { name: "role", placeholder: "Role", icon: <FaBriefcase /> },
              { name: "location", placeholder: "Location", icon: <FaMapMarkerAlt /> },
              { name: "salary", placeholder: "Salary", icon: <FaDollarSign /> },
              { name: "date", type: "date", placeholder: "Date", icon: <FaCalendarAlt /> },
              { name: "rounds", placeholder: "Rounds", icon: <FaTasks /> },
            ].map(({ name, type = "text", placeholder, icon }) => (
              <div key={name} className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={newDrive[name]}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}
          </div>
    
          {/* Select Dropdown */}
          <select
            name="status"
            value={newDrive.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="Not Conducted">Not Conducted</option>
            <option value="Conducted">Conducted</option>
          </select>
    
          {/* Student Cleared Input */}
          <input
            type="text"
            name="studentCleared"
            placeholder="Student Cleared (Yes/No)"
            value={newDrive.studentCleared}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
    
          {/* Button Section */}
          <div className="flex flex-col gap-3 mt-5">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              ✅ Add Drive
            </button>
    
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              ⬅️ Back
            </button>
          </div>
        </form>
      </div>
    );
    
    
  };

  const renderDriveList = () => {
    return(
    <div className="p-4 pt-12 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
    {/* Header */}
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-wide">
      Drive Details
    </h2>
  
    {/* Table Container */}
    <div className="overflow-hidden bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-base">
          {/* Table Header */}
          <thead>
            <tr className="bg-blue-600 text-white text-left uppercase tracking-wider">
              {[
                "S.No", "Company Name", "Role", "Location", "Salary",
                "Date", "Rounds", "Status", "Student Cleared"
              ].map((heading) => (
                <th key={heading} className="px-5 py-3 border-r text-center">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
  
          {/* Table Body */}
          <tbody>
            {drives.map((drive, index) => {
              const rounds = Array.from({ length: parseInt(drive.rounds) }, (_, i) => i + 1);
              return (
                <tr
                  key={drive.id}
                  className={`border-b transition duration-200 text-gray-700 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-5 py-3 border-r text-center">{index + 1}</td>
                  <td className="px-5 py-3 border-r">{drive.companyName}</td>
                  <td className="px-5 py-3 border-r">{drive.role}</td>
                  <td className="px-5 py-3 border-r">{drive.location}</td>
                  <td className="px-5 py-3 border-r">{drive.salary}</td>
                  <td className="px-5 py-3 border-r">{drive.date}</td>
  
                  {/* Rounds Input */}
                  <td className="px-5 py-3 border-r">
                    {rounds.map((round, idx) => (
                      <div key={idx} className="flex items-center mb-2">
                        <span className="text-base font-medium">R{round}</span>
                        <input
                          type="number"
                          value={drive[`round${round}Cleared`] || ""}
                          onChange={(e) =>
                            handleUpdateDrive(drive.id, { [`round${round}Cleared`]: e.target.value })
                          }
                          className="w-16 p-2 border border-gray-300 rounded ml-2 text-base"
                        />
                      </div>
                    ))}
                  </td>
  
                  {/* Status Dropdown */}
                  <td className="px-5 py-3 border-r">
                    <select
                      value={drive.status}
                      onChange={(e) => handleUpdateDrive(drive.id, { status: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-base bg-white"
                    >
                      <option value="Not Conducted">Not Conducted</option>
                      <option value="Conducted">Conducted</option>
                    </select>
                  </td>
  
                  {/* Student Cleared Input */}
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={drive.studentCleared}
                      onChange={(e) => handleUpdateDrive(drive.id, { studentCleared: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-base"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  
    {/* Back Button */}
    <div className="mt-6 flex justify-center">
      <button
        onClick={() => setViewMode("buttons")}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition text-base"
      >
        ⬅️ Back to Buttons
      </button>
    </div>
  </div>
  
    
          );
  };
  

 const renderHistory = () => {
  return (
    <div className="p-4 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-wide">
        Drive History
      </h2>
  
      {/* Table Container */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading history...</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base shadow-lg">
            {/* Table Header */}
            <thead className="bg-blue-600 text-white">
              <tr>
                {["S.No", "Company Name", "Role", "Location", "Salary", "Date", "Student Cleared"].map((heading, index) => (
                  <th key={index} className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[120px] whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
  
            {/* Table Body */}
            <tbody>
              {drives
                .filter((drive) => drive.status === "Conducted") // Filter only conducted drives
                .map((drive, index) => (
                  <tr key={drive.id} className="hover:bg-blue-50 transition duration-200">
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[50px]">{index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[150px]">{drive.companyName}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[130px]">{drive.role}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[130px]">{drive.location}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[100px]">{drive.salary}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[120px]">{drive.date}</td>
                    <td className="border border-gray-300 px-3 py-2 md:px-5 md:py-3 text-center min-w-[150px]">{drive.studentCleared}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setViewMode("buttons")}
          className="bg-blue-600 text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          ⬅️ Back to Buttons
        </button>
      </div>
    </div>
  );
  
  
  
  
  
};

  return (
<div className="p-6 mt-16">
{/* <div className="company-detail-container p-6 flex flex-col items-center mt-16"> */}


  {toastMessage && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {toastMessage}
    </div>
  )}

  {viewMode === 'buttons' && (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {/* Add Drive Button */}
      <button
        onClick={() => setViewMode('addDrive')}
        className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-64 h-24"
      >
        <FaPlusCircle className="text-3xl text-blue-500 mb-3" />
        <span className="text-lg font-medium">Add Drive</span>
      </button>

      {/* List of Drives Button */}
      <button
        onClick={() => setViewMode('list')}
        className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-green-200 w-64 h-24"
      >
        <FaListAlt className="text-3xl text-green-500 mb-3" />
        <span className="text-lg font-medium">List of Drives</span>
      </button>

      {/* History Button */}
      <button
        onClick={() => setViewMode('history')}
        className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-yellow-200 w-64 h-24"
      >
        <FaBell className="text-3xl text-yellow-500 mb-3" />
        <span className="text-lg font-medium">History</span>
      </button>
    </div>
  )}

  {viewMode === 'addDrive' && renderAddDriveForm()}
  {viewMode === 'list' && renderDriveList()}
  {viewMode === 'history' && renderHistory()}
</div>

  
  );
};

export default DriveDetails;
