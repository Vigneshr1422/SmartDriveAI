// import React, { useState, useEffect } from "react";
// import { FaPlusCircle, FaListAlt, FaTrash } from "react-icons/fa";
// import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
// import { getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

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

//   const renderAddPartnerForm = () => (
//     <div className="p-6 m-20">
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
//     <div className="p-6 m-20 pt-16">
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
//           onClick={() => setViewMode("buttons")}
//           className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );

//   const renderButtons = () => (
//     <div className="flex justify-center items-center pt-16">
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
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-center">Training Partners</h1>

//       {/* Show different views based on the viewMode state */}
//       {viewMode === "buttons" && renderButtons()}
//       {viewMode === "addPartner" && renderAddPartnerForm()}
//       {viewMode === "listPartners" && renderTrainingPartnersList()}
//     </div>
//   );
// };

// export default TrainingPartner;




import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaListAlt, FaFileUpload, FaTrash } from "react-icons/fa";
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TrainingPartner = () => {
  const [partnersList, setPartnersList] = useState([]);
  const [viewMode, setViewMode] = useState("buttons");
  const [newPartner, setNewPartner] = useState({
    name: "",
    course: "",
    duration: "",
    contact: "",
  });
  const [loggedInAdminId, setLoggedInAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate

  // Firebase Auth
  const auth = getAuth();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoggedInAdminId(user.uid);
    } else {
      console.log("No user logged in.");
    }
  }, [auth]);

  const fetchPartnerData = async () => {
    if (!loggedInAdminId) return;

    const db = getFirestore(getApp());
    const partnersRef = collection(db, "partners");
    const q = query(partnersRef, where("adminId", "==", loggedInAdminId));

    try {
      const querySnapshot = await getDocs(q);
      const fetchedPartners = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPartnersList(fetchedPartners);
    } catch (error) {
      console.error("Error fetching partner data: ", error);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [loggedInAdminId]);

  const handleDeletePartner = async (partnerId) => {
    const db = getFirestore(getApp());
    const partnerRef = doc(db, "partners", partnerId);

    try {
      await deleteDoc(partnerRef);
      fetchPartnerData(); // Refresh the partner list after deletion
    } catch (error) {
      console.error("Error deleting partner: ", error);
    }
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
    const partnersRef = collection(db, "partners");

    try {
      await addDoc(partnersRef, { ...newPartner, adminId: loggedInAdminId });
      setViewMode("listPartners");
      fetchPartnerData();
    } catch (error) {
      console.error("Error adding partner: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadMaterialClick = () => {
    // Navigate to UploadMaterial page
    navigate("/upload-material");
  };

  const renderAddPartnerForm = () => (
    <div className="p-6 m-24">
      <h3 className="text-2xl font-bold mb-4">Add New Training Partner</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newPartner.name}
            onChange={handleInputChange}
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="course" className="block">Course:</label>
          <input
            type="text"
            id="course"
            name="course"
            value={newPartner.course}
            onChange={handleInputChange}
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block">Duration:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={newPartner.duration}
            onChange={handleInputChange}
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block">Contact:</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={newPartner.contact}
            onChange={handleInputChange}
            className="p-2 border w-full"
            required
          />
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-48"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Partner"}
          </button>
          <button
            onClick={() => setViewMode("buttons")}
            className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderTrainingPartnersList = () => (
    <div className="p-6 m-24">
      <h3 className="text-2xl font-bold mb-4">List of Training Partners</h3>
      {partnersList.length > 0 ? (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partnersList.map((partner, index) => (
              <tr key={partner.id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{partner.name}</td>
                <td className="px-4 py-2 border">{partner.course}</td>
                <td className="px-4 py-2 border">{partner.duration}</td>
                <td className="px-4 py-2 border">{partner.contact}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeletePartner(partner.id)}
                    className="bg-red-500 text-white p-2 rounded-lg ml-2"
                  >
                    <FaTrash className="inline" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No partners added yet.</p>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/admin")} // Navigate back to admin page
          className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 w-48"
        >
          Back to Admin
        </button>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div className="flex justify-center items-center pt-16 m-24">
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => setViewMode("addPartner")}
          className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
        >
          <FaPlusCircle className="text-3xl text-blue-500 mb-3" />
          <span className="text-lg font-medium">Add Partner</span>
        </button>

        <button
          onClick={() => setViewMode("listPartners")}
          className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
        >
          <FaListAlt className="text-3xl text-blue-500 mb-3" />
          <span className="text-lg font-medium">List Partners</span>
        </button>

        <button
          onClick={handleUploadMaterialClick} // Navigate to upload material page
          className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-48 h-24"
        >
          <FaFileUpload className="text-3xl text-blue-500 mb-3" />
          <span className="text-lg font-medium">Upload Material</span>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {renderButtons()}
      {viewMode === "addPartner" && renderAddPartnerForm()}
      {viewMode === "listPartners" && renderTrainingPartnersList()}
    </div>
  );
};

export default TrainingPartner;
