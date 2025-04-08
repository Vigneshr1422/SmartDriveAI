

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../auth/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaGraduationCap } from "react-icons/fa";
import { Mail, Building2, Users } from "lucide-react";

const AdminDepartmentPage = () => {
  const [adminList, setAdminList] = useState([]);
  const [showDepartments, setShowDepartments] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "admins"));
      const admins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueDepartments = [
        ...new Set(admins.map((admin) => admin.department)),
      ];

      setAdminList(admins);
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const handleDepartmentClick = (dept) => {
    setSelectedDept(dept);
  };

  const handleBackToDepartments = () => {
    setSelectedDept("");
  };

  const handleBackToMain = () => {
    setShowDepartments(false);
    setSelectedDept("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="pt-24 px-6 pb-10 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Profile Card */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl border border-blue-300 rounded-3xl p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <FaUserCircle size={70} className="text-blue-700 mb-4" />
              <h2 className="text-2xl font-bold text-blue-800">Manager Admin</h2>
              <p className="text-sm text-gray-700 mt-1 font-medium">
                {auth.currentUser?.email || "admin@manager.com"}
              </p>
              <p className="mt-2 text-sm text-blue-700 font-semibold">
                Admin ID: {auth.currentUser?.uid.slice(-4) || "ADM001"}
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="flex-1">
          {!showDepartments ? (
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
                Manager Admin Dashboard
              </h1>
              <button
                onClick={() => setShowDepartments(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg text-lg transition"
              >
                <FaGraduationCap size={20} />
                Show Registered Departments
              </button>

              {/* Manager Table Below Button */}
              <div className="w-full mt-10 overflow-x-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
  <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">
    List of Manager Admins
  </h3>
  <div className="min-w-[600px]">
    <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
      <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
        <tr>
          <th className="px-4 py-3">S.No</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Admin ID</th>
          <th className="px-4 py-3">Departments</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-gray-50 hover:bg-gray-100 transition rounded-lg">
          <td className="px-4 py-3">1</td>
          <td className="px-4 py-3">{auth.currentUser?.email}</td>
          <td className="px-4 py-3">{auth.currentUser?.uid.slice(-4)}</td>
          <td className="px-4 py-3">
            {departments.length > 0 ? departments.join(", ") : "N/A"}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

            </div>
          ) : selectedDept ? (
            <div>
              <button
                onClick={handleBackToDepartments}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                ← Back to Departments
              </button>

              <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
                Admin Details - {selectedDept}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {adminList
                  .filter((admin) => admin.department === selectedDept)
                  .map((admin) => (
                    <div
                      key={admin.id}
                      className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-xl transition text-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-blue-600 mb-3">
                        Admin Details
                      </h3>
                      <p className="mb-2">
                        <Mail className="inline mr-2 text-gray-500" size={18} />
                        <strong>Mail ID:</strong> {admin.email}
                      </p>
                      <p className="mb-2">
                        <Building2 className="inline mr-2 text-green-500" size={18} />
                        <strong>Department:</strong> {admin.department}
                      </p>
                      <p>
                        <Users className="inline mr-2 text-purple-500" size={18} />
                        <strong>Section:</strong> {admin.section}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={handleBackToMain}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                ← Back to Dashboard
              </button>

              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Registered Departments
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {departments.map((dept, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDepartmentClick(dept)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 text-lg"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDepartmentPage;
