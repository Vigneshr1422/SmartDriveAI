import React, { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaListAlt, FaBell } from 'react-icons/fa';

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
      <div>
        <h3 className="text-xl font-bold mb-4">Add New Drive</h3>
        <form onSubmit={handleAddDriveSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={newDrive.companyName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newDrive.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newDrive.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={newDrive.salary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="date"
            value={newDrive.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="rounds"
            placeholder="Rounds"
            value={newDrive.rounds}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="status"
            value={newDrive.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Not Conducted">Not Conducted</option>
            <option value="Conducted">Conducted</option>
          </select>
          <input
            type="text"
            name="studentCleared"
            placeholder="Student Cleared (Yes/No)"
            value={newDrive.studentCleared}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Add Drive
          </button>
        </form>
      </div>
    );
  };

  const renderDriveList = () => {
    return (
      <div>
        <button
          onClick={() => setViewMode("buttons")}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 mb-4 ml-auto block"
        >
          Back to Buttons
        </button>
  
        {loading ? (
          <p>Loading drives...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-teal-500 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">Company Name</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Location</th>
                  <th className="border border-gray-300 px-4 py-2">Salary</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Rounds</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Student Cleared</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive, index) => {
                  const rounds = Array.from({ length: parseInt(drive.rounds) }, (_, i) => i + 1);
                  return (
                    <tr key={drive.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{drive.companyName}</td>
                      <td className="border border-gray-300 px-4 py-2">{drive.role}</td>
                      <td className="border border-gray-300 px-4 py-2">{drive.location}</td>
                      <td className="border border-gray-300 px-4 py-2">{drive.salary}</td>
                      <td className="border border-gray-300 px-4 py-2">{drive.date}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {rounds.map((round, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="block">{`R${round}`}</span>
                            <input
                              type="number"
                              value={drive[`round${round}Cleared`] || ""}
                              onChange={(e) =>
                                handleUpdateDrive(drive.id, { [`round${round}Cleared`]: e.target.value })
                              }
                              className="w-12 p-2 border border-gray-300 rounded ml-2"
                            />
                          </div>
                        ))}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          value={drive.status}
                          onChange={(e) => handleUpdateDrive(drive.id, { status: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="Not Conducted">Not Conducted</option>
                          <option value="Conducted">Conducted</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={drive.studentCleared}
                          onChange={(e) => handleUpdateDrive(drive.id, { studentCleared: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  

 const renderHistory = () => {
  return (
    <div>
      <button
        onClick={() => setViewMode("buttons")}
        className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 mb-4"
      >
        Back to Buttons
      </button>

      {loading ? (
        <p>Loading history...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-teal-500 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">Company Name</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Location</th>
                <th className="border border-gray-300 px-4 py-2">Salary</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Student Cleared</th>
              </tr>
            </thead>
            <tbody>
              {drives
                .filter((drive) => drive.status === "Conducted") // Filter conducted drives for history
                .map((drive, index) => (
                  <tr key={drive.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.companyName}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.role}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.location}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.salary}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{drive.studentCleared}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

  return (
<div className="p-6 mt-16">
{/* <div className="company-detail-container p-6 flex flex-col items-center mt-16"> */}

  <h2 className="text-4xl font-bold mb-8 text-center">Admin's Drive Details</h2>

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
