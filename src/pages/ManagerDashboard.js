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


// import { useEffect, useState } from "react";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { db } from "../auth/firebase"; // Adjust import based on your Firebase setup
// import { toast } from "react-toastify";

// const AdminManagement = () => {
//   const [adminList, setAdminList] = useState([]);
//   const [deletedAdmins, setDeletedAdmins] = useState([]);
//   const [blockedAdmins, setBlockedAdmins] = useState([]);
//   const [adminsLoading, setAdminsLoading] = useState(true);

//   useEffect(() => {
//     fetchAdminList();
//   }, []);

//   // Fetch admins and categorize them into active, deleted, and blocked lists
//   const fetchAdminList = async () => {
//     try {
//       const adminsRef = collection(db, "admins");
//       const adminSnapshot = await getDocs(adminsRef);

//       const admins = adminSnapshot.docs.map((doc, index) => ({
//         id: doc.id,
//         sNo: index + 1,
//         ...doc.data(),
//       }));

//       const activeAdmins = admins.filter((admin) => !admin.isDeleted && !admin.isBlocked);
//       const deletedAdmins = admins.filter((admin) => admin.isDeleted);
//       const blockedAdmins = admins.filter((admin) => admin.isBlocked);

//       setAdminList(activeAdmins);
//       setDeletedAdmins(deletedAdmins);
//       setBlockedAdmins(blockedAdmins);
//     } catch (error) {
//       console.error("Error fetching admin list:", error);
//     } finally {
//       setAdminsLoading(false);
//     }
//   };

//   // Block an admin
//   const handleBlockAdmin = async (adminId) => {
//     try {
//       const adminRef = doc(db, "admins", adminId);
//       await updateDoc(adminRef, { isBlocked: true });

//       // Update state: Move admin from active to blocked list
//       setAdminList((prev) => prev.filter((admin) => admin.id !== adminId));
//       setBlockedAdmins((prev) => [...prev, adminList.find((admin) => admin.id === adminId)]);

//       toast.success("Admin has been successfully blocked!");
//     } catch (error) {
//       console.error("Error blocking admin:", error);
//       toast.error("Failed to block admin.");
//     }
//   };

//   // Unblock an admin
//   const handleUnblockAdmin = async (adminId) => {
//     try {
//       const adminRef = doc(db, "admins", adminId);
//       await updateDoc(adminRef, { isBlocked: false });

//       // Update state: Move admin back to active list
//       setBlockedAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
//       setAdminList((prev) => [...prev, blockedAdmins.find((admin) => admin.id === adminId)]);

//       toast.success("Admin has been successfully unblocked!");
//     } catch (error) {
//       console.error("Error unblocking admin:", error);
//       toast.error("Failed to unblock admin.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-bold mb-6">Admin Management</h2>

//       {adminsLoading ? (
//         <p>Loading admins...</p>
//       ) : (
//         <>
//           {/* Active Admins Table */}
//           <h3 className="text-2xl font-semibold mb-4">Active Admins</h3>
//           <table className="table-auto w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">S.No</th>
//                 <th className="border border-gray-300 px-4 py-2">Email</th>
//                 <th className="border border-gray-300 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {adminList.map((admin) => (
//                 <tr key={admin.sNo} className="text-center">
//                   <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
//                   <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <button
//                       onClick={() => handleBlockAdmin(admin.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       Block
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Blocked Admins Table */}
//           <h3 className="text-2xl font-semibold mt-6 mb-4">Blocked Admins</h3>
//           <table className="table-auto w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">S.No</th>
//                 <th className="border border-gray-300 px-4 py-2">Email</th>
//                 <th className="border border-gray-300 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {blockedAdmins.map((admin) => (
//                 <tr key={admin.sNo} className="text-center">
//                   <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
//                   <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <button
//                       onClick={() => handleUnblockAdmin(admin.id)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       Unblock
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Deleted Admins Table */}
//           <h3 className="text-2xl font-semibold mt-6 mb-4">Deleted Admins</h3>
//           <table className="table-auto w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2">S.No</th>
//                 <th className="border border-gray-300 px-4 py-2">Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {deletedAdmins.map((admin) => (
//                 <tr key={admin.sNo} className="text-center">
//                   <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
//                   <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminManagement;

// import React, { useState, useEffect } from "react";
// import { db } from "../auth/firebase"; // Your Firestore configuration
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
// import { getAuth, signOut } from "firebase/auth"; // Firebase Authentication functions
// import { toast } from "react-toastify"; // Toast for notifications

// const ManagerDashboard = () => {
//   const [managerDetails, setManagerDetails] = useState(null);
//   const [adminList, setAdminList] = useState([]);
//   const [deletedAdmins, setDeletedAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [adminsLoading, setAdminsLoading] = useState(true);

//   useEffect(() => {
//     const fetchManagerDetails = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//           setManagerDetails({ email: user.email });
//         }
//       } catch (error) {
//         console.error("Error fetching manager details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchAdminList = async () => {
//       try {
//         const adminsRef = collection(db, "admins"); // Firestore collection for admins
//         const adminSnapshot = await getDocs(adminsRef);

//         const admins = adminSnapshot.docs.map((doc, index) => ({
//           id: doc.id, // Document ID for actions
//           sNo: index + 1,
//           ...doc.data(),
//         }));

//         // Separate deleted admins from active ones
//         const activeAdmins = admins.filter((admin) => !admin.isDeleted);
//         const deletedAdmins = admins.filter((admin) => admin.isDeleted);

//         setAdminList(activeAdmins);
//         setDeletedAdmins(deletedAdmins);
//       } catch (error) {
//         console.error("Error fetching admin list:", error);
//       } finally {
//         setAdminsLoading(false);
//       }
//     };

//     fetchManagerDetails();
//     fetchAdminList();
//   }, []);

//   const handleRemoveAdmin = async (adminId, adminEmail) => {
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       // Step 1: Ensure the current user is logged in
//       if (!user) {
//         toast.error("No authenticated user found.");
//         return;
//       }

//       // Check if the user trying to delete is the correct admin
//       if (user.email !== adminEmail) {
//         toast.error("You cannot delete this admin. Please check the email.");
//         return;
//       }

//       // Step 2: Mark admin as deleted in Firestore (instead of deleting the record)
//       const adminRef = doc(db, "admins", adminId);
//       await updateDoc(adminRef, { isDeleted: true });

//       // Step 3: Provide feedback and update the UI
//       toast.success("Admin has been successfully deleted!");

//       // Update the local state to reflect the deletion
//       setAdminList((prev) => prev.filter((admin) => admin.id !== adminId));
//       setDeletedAdmins((prev) => [...prev, { id: adminId, adminEmail }]);

//     } catch (error) {
//       console.error("Error removing admin and associated data:", error);
//       toast.error("Failed to delete admin and related data.");
//     }
//   };

//   const handleRestoreAdmin = async (adminId) => {
//     try {
//       // Step 1: Update Firestore to mark the admin as restored (isDeleted: false)
//       const adminRef = doc(db, "admins", adminId);
//       await updateDoc(adminRef, { isDeleted: false });

//       // Step 2: Update local state to reflect the restoration
//       setAdminList((prev) => [...prev, { id: adminId }]);
//       setDeletedAdmins((prev) => prev.filter((admin) => admin.id !== adminId));

//       // Step 3: Provide feedback
//       toast.success("Admin has been successfully restored!");
//     } catch (error) {
//       console.error("Error restoring admin:", error);
//       toast.error("Failed to restore admin.");
//     }
//   };

//   const handleLogout = async () => {
//     const auth = getAuth();
//     try {
//       await signOut(auth); // Log out the current user
//       console.log("Logged out successfully");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading manager details...</div>;
//   }

//   return (
//     <div className="manager-dashboard flex">
//       {/* Left section: Profile */}
//       <div className="profile-container flex flex-col items-center bg-white shadow-lg p-6 rounded-lg w-1/4 h-screen">
//         <div className="profile-icon mb-6">
//           {/* Add your profile icon here */}
//         </div>
//         <div className="profile-details text-center">
//           <h3 className="text-xl font-semibold mb-4">Manager Profile</h3>
//           {managerDetails ? (
//             <div className="flex items-center mb-4 justify-center">
//               <span>
//                 <strong>Email:</strong> {managerDetails.email}
//               </span>
//             </div>
//           ) : (
//             <p>Manager details not available.</p>
//           )}
//         </div>

//         {/* Log Out Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded-full w-full hover:bg-red-600 transition duration-300"
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {/* Right section: Admin List */}
//       <div className="dashboard-content w-3/4 p-6">
//         <h2 className="text-3xl font-semibold mb-6">Admin List</h2>
//         {adminsLoading ? (
//           <div>Loading admin list...</div>
//         ) : (
//           <>
//             <div>
//               <h3 className="text-2xl font-semibold mb-4">Active Admins</h3>
//               <table className="table-auto w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2">S.No</th>
//                     <th className="border border-gray-300 px-4 py-2">Email</th>
//                     <th className="border border-gray-300 px-4 py-2">Department</th>
//                     <th className="border border-gray-300 px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {adminList.map((admin) => (
//                     <tr key={admin.sNo} className="text-center">
//                       <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
//                       <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
//                       <td className="border border-gray-300 px-4 py-2">{admin.department}</td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         <button
//                           onClick={() => handleRemoveAdmin(admin.id, admin.email)}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div>
//               <h3 className="text-2xl font-semibold mb-4">Deleted Admins</h3>
//               <table className="table-auto w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2">S.No</th>
//                     <th className="border border-gray-300 px-4 py-2">Email</th>
//                     <th className="border border-gray-300 px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {deletedAdmins.map((admin) => (
//                     <tr key={admin.sNo} className="text-center">
//                       <td className="border border-gray-300 px-4 py-2">{admin.sNo}</td>
//                       <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         <button
//                           onClick={() => handleRestoreAdmin(admin.id)}
//                           className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                         >
//                           Restore
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;
