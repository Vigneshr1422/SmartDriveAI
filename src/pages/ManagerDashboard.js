import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../auth/firebase"; // Ensure correct Firebase import
import { toast } from "react-toastify";

const AdminManagement = () => {
  const [adminList, setAdminList] = useState([]);
  const [deletedAdmins, setDeletedAdmins] = useState([]);
  const [blockedAdmins, setBlockedAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(true);

  useEffect(() => {
    fetchAdminList();
  }, []);

  // Fetch admins and categorize them
  const fetchAdminList = async () => {
    try {
      const adminsRef = collection(db, "admins");
      const adminSnapshot = await getDocs(adminsRef);

      const admins = adminSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        sNo: index + 1,
        ...doc.data(),
      }));

      setAdminList(admins.filter((admin) => !admin.isDeleted && !admin.isBlocked));
      setDeletedAdmins(admins.filter((admin) => admin.isDeleted));
      setBlockedAdmins(admins.filter((admin) => admin.isBlocked));
    } catch (error) {
      console.error("Error fetching admin list:", error);
    } finally {
      setAdminsLoading(false);
    }
  };

  // Block an admin (Restrict login)
  const handleBlockAdmin = async (adminId) => {
    try {
      const adminRef = doc(db, "admins", adminId);
      await updateDoc(adminRef, { isBlocked: true });

      setAdminList((prev) => prev.filter((admin) => admin.id !== adminId));
      setBlockedAdmins((prev) => [...prev, adminList.find((admin) => admin.id === adminId)]);

      toast.success("Admin has been successfully blocked!");
    } catch (error) {
      console.error("Error blocking admin:", error);
      toast.error("Failed to block admin.");
    }
  };

  // Unblock an admin (Allow login again)
  const handleUnblockAdmin = async (adminId) => {
    try {
      const adminRef = doc(db, "admins", adminId);
      await updateDoc(adminRef, { isBlocked: false });

      setBlockedAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
      setAdminList((prev) => [...prev, blockedAdmins.find((admin) => admin.id === adminId)]);

      toast.success("Admin has been successfully unblocked!");
    } catch (error) {
      console.error("Error unblocking admin:", error);
      toast.error("Failed to unblock admin.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Admin Management</h2>

      {adminsLoading ? (
        <p>Loading admins...</p>
      ) : (
        <>
          {/* Active Admins Table */}
          <h3 className="text-2xl font-semibold mb-4">Active Admins</h3>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminList.map((admin) => (
                <tr key={admin.sNo} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleBlockAdmin(admin.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Blocked Admins Table */}
          <h3 className="text-2xl font-semibold mt-6 mb-4">Blocked Admins</h3>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedAdmins.map((admin) => (
                <tr key={admin.sNo} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleUnblockAdmin(admin.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminManagement;


