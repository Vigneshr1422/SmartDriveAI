import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaList, FaUpload } from "react-icons/fa";
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TrainingPartner = () => {
  const [partnersList, setPartnersList] = useState([]);
  const [viewMode, setViewMode] = useState("buttons");
  const [newPartner, setNewPartner] = useState({ name: "", course: "", duration: "", contact: "" });
  const [editPartner, setEditPartner] = useState(null);
  const [loggedInAdminId, setLoggedInAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) setLoggedInAdminId(user.uid);
  }, [auth]);

  const fetchPartnerData = async () => {
    if (!loggedInAdminId) return;
    const db = getFirestore(getApp());
    const partnersRef = collection(db, "partners");
    const q = query(partnersRef, where("adminId", "==", loggedInAdminId));

    try {
      const querySnapshot = await getDocs(q);
      setPartnersList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching partners: ", error);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [loggedInAdminId]);

  const handleDeletePartner = async (partnerId) => {
    const db = getFirestore(getApp());
    try {
      await deleteDoc(doc(db, "partners", partnerId));
      fetchPartnerData();
    } catch (error) {
      console.error("Error deleting partner: ", error);
    }
  };

  const handleEdit = (partner) => {
    setEditPartner(partner);
    setNewPartner(partner);
    setViewMode("editPartner");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPartner({ ...newPartner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInAdminId) return;

    setIsLoading(true);
    const db = getFirestore(getApp());
    try {
      if (editPartner) {
        const partnerRef = doc(db, "partners", editPartner.id);
        await updateDoc(partnerRef, newPartner);
      } else {
        await addDoc(collection(db, "partners"), { ...newPartner, adminId: loggedInAdminId });
      }
      setViewMode("listPartners");
      fetchPartnerData();
      setEditPartner(null);
      setNewPartner({ name: "", course: "", duration: "", contact: "" });
    } catch (error) {
      console.error("Error saving partner: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white p-10">
      {viewMode === "buttons" && (
        <motion.div
          className="flex flex-col items-center justify-center gap-y-6 mt-12 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[
            { label: "Add Partner", icon: <FaPlus className="text-3xl text-blue-500 mb-3" />, onClick: () => setViewMode("addPartner"), bgHover: "hover:bg-blue-200" },
            { label: "List Partners", icon: <FaList className="text-3xl text-green-500 mb-3" />, onClick: () => setViewMode("listPartners"), bgHover: "hover:bg-green-200" },
            { label: "Upload Material", icon: <FaUpload className="text-3xl text-yellow-500 mb-3" />, onClick: () => navigate("/upload-material"), bgHover: "hover:bg-yellow-200" },
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={item.onClick}
              className={`icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl w-full ${item.bgHover} transition-transform hover:scale-105`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
              <span className="text-lg font-medium text-black">{item.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
  
      {(viewMode === "addPartner" || viewMode === "editPartner") && (
        <motion.div
          className="w-full max-w-lg bg-white shadow-xl rounded-lg p-6 mt-10 border border-gray-300"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            {editPartner ? "Edit Training Partner" : "Add Training Partner"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "course", "duration", "contact"].map((field) => (
              <div key={field}>
                <label className="block font-medium capitalize text-gray-700">{field}:</label>
                <input
                  type="text"
                  name={field}
                  value={newPartner[field]}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editPartner ? "Update Partner" : "Add Partner"}
              </button>
              <button
                onClick={() => setViewMode("buttons")}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
  
      {viewMode === "listPartners" && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-xl mt-6 overflow-x-auto">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Training Partners</h3>
  
          {partnersList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-gray-800 border-collapse">
                <thead>
                  <tr className="bg-blue-300 text-left">
                    <th className="p-3 border-b-2 border-gray-300">Partner Name</th>
                    <th className="p-3 border-b-2 border-gray-300">Course</th>
                    <th className="p-3 border-b-2 border-gray-300">Duration</th>
                    <th className="p-3 border-b-2 border-gray-300">Contact</th>
                    <th className="p-3 border-b-2 border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partnersList.map((partner, index) => (
                    <tr
                      key={partner.id}
                      className={`border-t border-gray-300 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
                    >
                      <td className="p-3">{partner.name}</td>
                      <td className="p-3">{partner.course}</td>
                      <td className="p-3">{partner.duration}</td>
                      <td className="p-3">{partner.contact}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(partner)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No partners added yet.</p>
          )}
  
          {/* Back Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setViewMode("buttons")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default TrainingPartner;

// // import React, { useState, useEffect } from "react";
// // import { FaPlusCircle, FaListAlt, FaTrash } from "react-icons/fa";
// // import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
// // import { getApp } from "firebase/app";
// // import { getAuth } from "firebase/auth";

// // const TrainingPartner = () => {
// //   const [partnersList, setPartnersList] = useState([]);
// //   const [viewMode, setViewMode] = useState("buttons");
// //   const [newPartner, setNewPartner] = useState({
// //     name: "",
// //     course: "",
// //     duration: "",
// //     contact: "",
// //   });
// //   const [loggedInAdminId, setLoggedInAdminId] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);

// //   // Firebase Auth
// //   const auth = getAuth();
// //   useEffect(() => {
// //     const user = auth.currentUser;
// //     if (user) {
// //       setLoggedInAdminId(user.uid);
// //     } else {
// //       console.log("No user logged in.");
// //     }
// //   }, [auth]);

// //   const fetchPartnerData = async () => {
// //     if (!loggedInAdminId) return;

// //     const db = getFirestore(getApp());
// //     const partnersRef = collection(db, "partners");
// //     const q = query(partnersRef, where("adminId", "==", loggedInAdminId));

// //     try {
// //       const querySnapshot = await getDocs(q);
// //       const fetchedPartners = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setPartnersList(fetchedPartners);
// //     } catch (error) {
// //       console.error("Error fetching partner data: ", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPartnerData();
// //   }, [loggedInAdminId]);

// //   const handleDeletePartner = async (partnerId) => {
// //     const db = getFirestore(getApp());
// //     const partnerRef = doc(db, "partners", partnerId);

// //     try {
// //       await deleteDoc(partnerRef);
// //       fetchPartnerData(); // Refresh the partner list after deletion
// //     } catch (error) {
// //       console.error("Error deleting partner: ", error);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setNewPartner({ ...newPartner, [name]: value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!loggedInAdminId) return;

// //     setIsLoading(true);

// //     const db = getFirestore(getApp());
// //     const partnersRef = collection(db, "partners");

// //     try {
// //       await addDoc(partnersRef, { ...newPartner, adminId: loggedInAdminId });
// //       setViewMode("listPartners");
// //       fetchPartnerData();
// //     } catch (error) {
// //       console.error("Error adding partner: ", error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const renderAddPartnerForm = () => (
// //     <div className="p-6 m-20">
// //       <h3 className="text-2xl font-bold mb-4">Add New Training Partner</h3>
// //       <form onSubmit={handleSubmit}>
// //         <div className="mb-4">
// //           <label htmlFor="name" className="block">Name:</label>
// //           <input
// //             type="text"
// //             id="name"
// //             name="name"
// //             value={newPartner.name}
// //             onChange={handleInputChange}
// //             className="p-2 border w-full"
// //             required
// //           />
// //         </div>
// //         <div className="mb-4">
// //           <label htmlFor="course" className="block">Course:</label>
// //           <input
// //             type="text"
// //             id="course"
// //             name="course"
// //             value={newPartner.course}
// //             onChange={handleInputChange}
// //             className="p-2 border w-full"
// //             required
// //           />
// //         </div>
// //         <div className="mb-4">
// //           <label htmlFor="duration" className="block">Duration:</label>
// //           <input
// //             type="text"
// //             id="duration"
// //             name="duration"
// //             value={newPartner.duration}
// //             onChange={handleInputChange}
// //             className="p-2 border w-full"
// //             required
// //           />
// //         </div>
// //         <div className="mb-4">
// //           <label htmlFor="contact" className="block">Contact:</label>
// //           <input
// //             type="text"
// //             id="contact"
// //             name="contact"
// //             value={newPartner.contact}
// //             onChange={handleInputChange}
// //             className="p-2 border w-full"
// //             required
// //           />
// //         </div>
// //         <div className="flex justify-center gap-4">
// //           <button
// //             type="submit"
// //             className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-48"
// //             disabled={isLoading}
// //           >
// //             {isLoading ? "Adding..." : "Add Partner"}
// //           </button>
// //           <button
// //             onClick={() => setViewMode("buttons")}
// //             className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
// //           >
// //             Cancel
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );

// //   const renderTrainingPartnersList = () => (
// //     <div className="p-6 m-20 pt-16">
// //       <h3 className="text-2xl font-bold mb-4">List of Training Partners</h3>
// //       {partnersList.length > 0 ? (
// //         <table className="w-full table-auto border-collapse">
// //           <thead>
// //             <tr>
// //               <th className="px-4 py-2 border">S.No</th>
// //               <th className="px-4 py-2 border">Name</th>
// //               <th className="px-4 py-2 border">Course</th>
// //               <th className="px-4 py-2 border">Duration</th>
// //               <th className="px-4 py-2 border">Contact</th>
// //               <th className="px-4 py-2 border">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {partnersList.map((partner, index) => (
// //               <tr key={partner.id}>
// //                 <td className="px-4 py-2 border">{index + 1}</td>
// //                 <td className="px-4 py-2 border">{partner.name}</td>
// //                 <td className="px-4 py-2 border">{partner.course}</td>
// //                 <td className="px-4 py-2 border">{partner.duration}</td>
// //                 <td className="px-4 py-2 border">{partner.contact}</td>
// //                 <td className="px-4 py-2 border">
// //                   <button
// //                     onClick={() => handleDeletePartner(partner.id)}
// //                     className="bg-red-500 text-white p-2 rounded-lg ml-2"
// //                   >
// //                     <FaTrash className="inline" /> Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       ) : (
// //         <p>No partners added yet.</p>
// //       )}
// //       <div className="flex justify-center mt-6">
// //         <button
// //           onClick={() => setViewMode("buttons")}
// //           className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
// //         >
// //           Back
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   const renderButtons = () => (
// //     <div className="flex justify-center items-center pt-16">
// //       <div className="grid grid-cols-2 gap-6">
// //         <button
// //           onClick={() => setViewMode("addPartner")}
// //           className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
// //         >
// //           <FaPlusCircle className="text-3xl text-blue-500 mb-3" />
// //           <span className="text-lg font-medium">Add Partner</span>
// //         </button>

// //         <button
// //           onClick={() => setViewMode("listPartners")}
// //           className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
// //         >
// //           <FaListAlt className="text-3xl text-blue-500 mb-3" />
// //           <span className="text-lg font-medium">List Partners</span>
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div>
// //       <h1 className="text-3xl font-bold text-center">Training Partners</h1>

// //       {/* Show different views based on the viewMode state */}
// //       {viewMode === "buttons" && renderButtons()}
// //       {viewMode === "addPartner" && renderAddPartnerForm()}
// //       {viewMode === "listPartners" && renderTrainingPartnersList()}
// //     </div>
// //   );
// // };

// // export default TrainingPartner;




// import React, { useState, useEffect } from "react";
// import { FaPlusCircle, FaListAlt, FaFileUpload, FaTrash } from "react-icons/fa";
// import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
// import { getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const TrainingPartner = () => {
//   const [partnersList, setPartnersList] = useState([]);
//   const [viewMode, setViewMode] = useState("buttons");
//   const [newPartner, setNewPartner] = useState({
//     name: "",
//     course: "",
//     duration: "",
//     contact: "",
//   });
//   const [loggedInAdminId, setLoggedInAdminId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate(); // Hook to navigate

//   // Firebase Auth
//   const auth = getAuth();
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       setLoggedInAdminId(user.uid);
//     } else {
//       console.log("No user logged in.");
//     }
//   }, [auth]);

//   const fetchPartnerData = async () => {
//     if (!loggedInAdminId) return;

//     const db = getFirestore(getApp());
//     const partnersRef = collection(db, "partners");
//     const q = query(partnersRef, where("adminId", "==", loggedInAdminId));

//     try {
//       const querySnapshot = await getDocs(q);
//       const fetchedPartners = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setPartnersList(fetchedPartners);
//     } catch (error) {
//       console.error("Error fetching partner data: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchPartnerData();
//   }, [loggedInAdminId]);

//   const handleDeletePartner = async (partnerId) => {
//     const db = getFirestore(getApp());
//     const partnerRef = doc(db, "partners", partnerId);

//     try {
//       await deleteDoc(partnerRef);
//       fetchPartnerData(); // Refresh the partner list after deletion
//     } catch (error) {
//       console.error("Error deleting partner: ", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPartner({ ...newPartner, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!loggedInAdminId) return;

//     setIsLoading(true);

//     const db = getFirestore(getApp());
//     const partnersRef = collection(db, "partners");

//     try {
//       await addDoc(partnersRef, { ...newPartner, adminId: loggedInAdminId });
//       setViewMode("listPartners");
//       fetchPartnerData();
//     } catch (error) {
//       console.error("Error adding partner: ", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUploadMaterialClick = () => {
//     // Navigate to UploadMaterial page
//     navigate("/upload-material");
//   };

//   const renderAddPartnerForm = () => (
//     <div className="p-6 m-24">
//       <h3 className="text-2xl font-bold mb-4">Add New Training Partner</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name" className="block">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={newPartner.name}
//             onChange={handleInputChange}
//             className="p-2 border w-full"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="course" className="block">Course:</label>
//           <input
//             type="text"
//             id="course"
//             name="course"
//             value={newPartner.course}
//             onChange={handleInputChange}
//             className="p-2 border w-full"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="duration" className="block">Duration:</label>
//           <input
//             type="text"
//             id="duration"
//             name="duration"
//             value={newPartner.duration}
//             onChange={handleInputChange}
//             className="p-2 border w-full"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="contact" className="block">Contact:</label>
//           <input
//             type="text"
//             id="contact"
//             name="contact"
//             value={newPartner.contact}
//             onChange={handleInputChange}
//             className="p-2 border w-full"
//             required
//           />
//         </div>
//         <div className="flex justify-center gap-4">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-48"
//             disabled={isLoading}
//           >
//             {isLoading ? "Adding..." : "Add Partner"}
//           </button>
//           <button
//             onClick={() => setViewMode("buttons")}
//             className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const renderTrainingPartnersList = () => (
//     <div className="p-6 m-24">
//       <h3 className="text-2xl font-bold mb-4">List of Training Partners</h3>
//       {partnersList.length > 0 ? (
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">S.No</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Course</th>
//               <th className="px-4 py-2 border">Duration</th>
//               <th className="px-4 py-2 border">Contact</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {partnersList.map((partner, index) => (
//               <tr key={partner.id}>
//                 <td className="px-4 py-2 border">{index + 1}</td>
//                 <td className="px-4 py-2 border">{partner.name}</td>
//                 <td className="px-4 py-2 border">{partner.course}</td>
//                 <td className="px-4 py-2 border">{partner.duration}</td>
//                 <td className="px-4 py-2 border">{partner.contact}</td>
//                 <td className="px-4 py-2 border">
//                   <button
//                     onClick={() => handleDeletePartner(partner.id)}
//                     className="bg-red-500 text-white p-2 rounded-lg ml-2"
//                   >
//                     <FaTrash className="inline" /> Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No partners added yet.</p>
//       )}
//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate("/admin")} // Navigate back to admin page
//           className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
//         >
//           Back to Admin
//         </button>
//       </div>
//     </div>
//   );

//   const renderButtons = () => (
//     <div className="flex justify-center items-center pt-16 m-24">
//       <div className="grid grid-cols-2 gap-6">
//         <button
//           onClick={() => setViewMode("addPartner")}
//           className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
//         >
//           <FaPlusCircle className="text-3xl text-blue-500 mb-3" />
//           <span className="text-lg font-medium">Add Partner</span>
//         </button>

//         <button
//           onClick={() => setViewMode("listPartners")}
//           className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
//         >
//           <FaListAlt className="text-3xl text-blue-500 mb-3" />
//           <span className="text-lg font-medium">List Partners</span>
//         </button>

//         <button
//           onClick={handleUploadMaterialClick} // Navigate to upload material page
//           className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
//         >
//           <FaFileUpload className="text-3xl text-blue-500 mb-3" />
//           <span className="text-lg font-medium">Upload Material</span>
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       {renderButtons()}
//       {viewMode === "addPartner" && renderAddPartnerForm()}
//       {viewMode === "listPartners" && renderTrainingPartnersList()}
//     </div>
//   );
// };

// export default TrainingPartner;
