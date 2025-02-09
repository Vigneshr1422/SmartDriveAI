import React, { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const MaterialPage = () => {
  const auth = getAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [adminId, setAdminId] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Aptitude");
  const [materialFileLink, setMaterialFileLink] = useState("");
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState("AddMaterial");
  const [editingMaterial, setEditingMaterial] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAdminId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchMaterials();
    }
  }, [adminId, currentPage]);

  const fetchMaterials = async () => {
    let q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId));
    if (currentPage === "Aptitude" || currentPage === "Coding") {
      q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId), where("type", "==", currentPage));
    }
    const querySnapshot = await getDocs(q);
    const fetchedMaterials = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMaterials(fetchedMaterials);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        const materialRef = doc(db, "admins", adminId, "materialDetails", editingMaterial.id);
        await updateDoc(materialRef, { materialName, providerName, date, type, materialFileLink });
        toast.success("Material updated successfully!");
      } else {
        const materialData = { materialName, providerName, date, type, materialFileLink, adminId, createdAt: new Date() };
        await addDoc(collection(db, "admins", adminId, "materialDetails"), materialData);
        toast.success("Material added successfully!");
      }
      fetchMaterials();
      resetForm();
    } catch (error) {
      console.error("Error saving material:", error);
      toast.error("Failed to save material.");
    }
  };

  const resetForm = () => {
    setMaterialName("");
    setProviderName("");
    setDate("");
    setType("Aptitude");
    setMaterialFileLink("");
    setEditingMaterial(null);
  };

  const handleEdit = (material) => {
    setMaterialName(material.materialName);
    setProviderName(material.providerName);
    setDate(material.date);
    setType(material.type);
    setMaterialFileLink(material.materialFileLink);
    setEditingMaterial(material);
    setCurrentPage("AddMaterial");
  };

  const sendNotification = () => {
    toast.info("Sending notifications to all students...");
  };

  // Handle the back button functionality
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

    return (
      <div className="p-6 flex flex-col items-center pt-16 mt-24">
        <h2 className="text-2xl font-semibold mb-6">Material Management</h2>
    
        <div className="mb-6 space-x-4">
          <button onClick={() => setCurrentPage("AddMaterial")} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Material</button>
          <button onClick={() => setCurrentPage("ViewMaterial")} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">View Material</button>
          <button onClick={() => setCurrentPage("Aptitude")} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Aptitude</button>
          <button onClick={() => setCurrentPage("Coding")} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Coding</button>
        </div>
    
        {currentPage === "AddMaterial" && (
          <form onSubmit={handleFormSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-4">
              <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Material Name" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider Name" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                <option value="Aptitude">Aptitude</option>
                <option value="Coding">Coding</option>
              </select>
              <input type="url" value={materialFileLink} onChange={(e) => setMaterialFileLink(e.target.value)} placeholder="Material Link" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {editingMaterial ? "Update Material" : "Save Material"}
              </button>
            </div>
          </form>
        )}
    
        {(currentPage === "ViewMaterial" || currentPage === "Aptitude" || currentPage === "Coding") && (
          <div className="overflow-x-auto w-full mt-6 bg-white p-4 rounded-lg shadow-lg">
            <table className="w-full max-w-4xl mx-auto table-auto border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left">Material Name</th>
                  <th className="p-2 border text-left">Provider</th>
                  <th className="p-2 border text-left">Date</th>
                  <th className="p-2 border text-left">Type</th>
                  <th className="p-2 border text-left">Link</th>
                  <th className="p-2 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{material.materialName}</td>
                    <td className="p-2">{material.providerName}</td>
                    <td className="p-2">{material.date}</td>
                    <td className="p-2">{material.type}</td>
                    <td className="p-2">
                      <a href={material.materialFileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </td>
                    <td className="p-2">
                      <button onClick={() => handleEdit(material)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    
        {/* Centered back button */}
        <div className="mt-6 flex justify-center">
          <button onClick={handleBack} className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
            Back
          </button>
        </div>
      </div>
    );
    
  
};

export default MaterialPage;





// import React, { useState, useEffect } from "react";
// import { db } from "../auth/firebase";
// import { getAuth } from "firebase/auth";
// import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import { toast } from "react-toastify";

// const MaterialPage = () => {
//   const auth = getAuth();
//   const [adminId, setAdminId] = useState("");
//   const [materialName, setMaterialName] = useState("");
//   const [providerName, setProviderName] = useState("");
//   const [date, setDate] = useState("");
//   const [type, setType] = useState("Aptitude");
//   const [materialFileLink, setMaterialFileLink] = useState("");
//   const [materials, setMaterials] = useState([]);
//   const [currentPage, setCurrentPage] = useState("AddMaterial");
//   const [editingMaterial, setEditingMaterial] = useState(null);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       setAdminId(user.uid);
//     }
//   }, []);

//   useEffect(() => {
//     if (adminId) {
//       fetchMaterials();
//     }
//   }, [adminId, currentPage]);

//   const fetchMaterials = async () => {
//     let q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId));
//     if (currentPage === "Aptitude" || currentPage === "Coding") {
//       q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId), where("type", "==", currentPage));
//     }
//     const querySnapshot = await getDocs(q);
//     const fetchedMaterials = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setMaterials(fetchedMaterials);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingMaterial) {
//         const materialRef = doc(db, "admins", adminId, "materialDetails", editingMaterial.id);
//         await updateDoc(materialRef, { materialName, providerName, date, type, materialFileLink });
//         toast.success("Material updated successfully!");
//       } else {
//         const materialData = { materialName, providerName, date, type, materialFileLink, adminId, createdAt: new Date() };
//         await addDoc(collection(db, "admins", adminId, "materialDetails"), materialData);
//         toast.success("Material added successfully!");
//       }
//       fetchMaterials();
//       resetForm();
//     } catch (error) {
//       console.error("Error saving material:", error);
//       toast.error("Failed to save material.");
//     }
//   };

//   const resetForm = () => {
//     setMaterialName("");
//     setProviderName("");
//     setDate("");
//     setType("Aptitude");
//     setMaterialFileLink("");
//     setEditingMaterial(null);
//   };

//   const handleEdit = (material) => {
//     setMaterialName(material.materialName);
//     setProviderName(material.providerName);
//     setDate(material.date);
//     setType(material.type);
//     setMaterialFileLink(material.materialFileLink);
//     setEditingMaterial(material);
//     setCurrentPage("AddMaterial");
//   };

//   const sendNotification = () => {
//     toast.info("Sending notifications to all students...");
//   };

//   return (
//     <div className="p-6 flex flex-col items-center mt-16">
//       <h2 className="text-2xl font-semibold mb-6">Material Management</h2>
      
//       <div className="mb-6 space-x-2">
//         <button onClick={() => setCurrentPage("AddMaterial")} className="px-4 py-2 border">Add Material</button>
//         <button onClick={() => setCurrentPage("ViewMaterial")} className="px-4 py-2 border">View Material</button>
//         <button onClick={() => setCurrentPage("Aptitude")} className="px-4 py-2 border">Aptitude</button>
//         <button onClick={() => setCurrentPage("Coding")} className="px-4 py-2 border">Coding</button>
//         <button onClick={sendNotification} className="px-4 py-2 border">Notification</button>
//       </div>

//       {currentPage === "AddMaterial" && (
//         <form onSubmit={handleFormSubmit} className="w-full max-w-md">
//           <div className="space-y-3">
//             <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Material Name" required className="w-full p-2 border" />
//             <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider Name" required className="w-full p-2 border" />
//             <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border" />
//             <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border">
//               <option value="Aptitude">Aptitude</option>
//               <option value="Coding">Coding</option>
//             </select>
//             <input type="url" value={materialFileLink} onChange={(e) => setMaterialFileLink(e.target.value)} placeholder="Material Link" required className="w-full p-2 border" />
//             <button type="submit" className="w-full p-2 bg-gray-800 text-white">{editingMaterial ? "Update Material" : "Save Material"}</button>
//           </div>
//         </form>
//       )}

//       {(currentPage === "ViewMaterial" || currentPage === "Aptitude" || currentPage === "Coding") && (
//         <table className="w-full mt-6 border">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2">Material Name</th>
//               <th className="p-2">Provider</th>
//               <th className="p-2">Date</th>
//               <th className="p-2">Type</th>
//               <th className="p-2">Link</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {materials.map((material, index) => (
//               <tr key={index} className="border-b">
//                 <td className="p-2">{material.materialName}</td>
//                 <td className="p-2">{material.providerName}</td>
//                 <td className="p-2">{material.date}</td>
//                 <td className="p-2">{material.type}</td>
//                 <td className="p-2"><a href={material.materialFileLink} target="_blank" rel="noopener noreferrer">Link</a></td>
//                 <td className="p-2">
//                   <button onClick={() => handleEdit(material)} className="px-2 py-1 border">Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default MaterialPage;




// import React, { useState, useEffect } from "react";
// import { db } from "../auth/firebase";
// import { getAuth } from "firebase/auth";
// import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import { toast } from "react-toastify";

// const MaterialPage = () => {
//   const auth = getAuth();
//   const [adminId, setAdminId] = useState("");
//   const [materialName, setMaterialName] = useState("");
//   const [providerName, setProviderName] = useState("");
//   const [date, setDate] = useState("");
//   const [type, setType] = useState("Aptitude");
//   const [materialFileLink, setMaterialFileLink] = useState("");
//   const [materials, setMaterials] = useState([]);
//   const [currentPage, setCurrentPage] = useState("AddMaterial");
//   const [editingMaterial, setEditingMaterial] = useState(null);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       setAdminId(user.uid);
//     }
//   }, []);

//   useEffect(() => {
//     if (adminId) {
//       fetchMaterials();
//     }
//   }, [adminId, currentPage]);

//   const fetchMaterials = async () => {
//     let q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId));
//     if (currentPage === "Aptitude" || currentPage === "Coding") {
//       q = query(collection(db, "admins", adminId, "materialDetails"), where("adminId", "==", adminId), where("type", "==", currentPage));
//     }
//     const querySnapshot = await getDocs(q);
//     const fetchedMaterials = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setMaterials(fetchedMaterials);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingMaterial) {
//         const materialRef = doc(db, "admins", adminId, "materialDetails", editingMaterial.id);
//         await updateDoc(materialRef, { materialName, providerName, date, type, materialFileLink });
//         toast.success("Material updated successfully!");
//       } else {
//         const materialData = { materialName, providerName, date, type, materialFileLink, adminId, createdAt: new Date() };
//         await addDoc(collection(db, "admins", adminId, "materialDetails"), materialData);
//         toast.success("Material added successfully!");
//       }
//       fetchMaterials();
//       resetForm();
//     } catch (error) {
//       console.error("Error saving material:", error);
//       toast.error("Failed to save material.");
//     }
//   };

//   const resetForm = () => {
//     setMaterialName("");
//     setProviderName("");
//     setDate("");
//     setType("Aptitude");
//     setMaterialFileLink("");
//     setEditingMaterial(null);
//   };

//   const handleEdit = (material) => {
//     setMaterialName(material.materialName);
//     setProviderName(material.providerName);
//     setDate(material.date);
//     setType(material.type);
//     setMaterialFileLink(material.materialFileLink);
//     setEditingMaterial(material);
//     setCurrentPage("AddMaterial");
//   };

//   const sendNotification = () => {
//     toast.info("Sending notifications to all students...");
//   };

//   return (
//     <div className="material-page-container p-6 flex flex-col items-center mt-16">
//       <h2 className="text-4xl font-bold mb-8 text-center">Material Management</h2>
//       <div className="mb-6 space-x-4">
//         <button onClick={() => setCurrentPage("AddMaterial")} className="btn btn-primary">Add Material</button>
//         <button onClick={() => setCurrentPage("ViewMaterial")} className="btn btn-secondary">View Material</button>
//         <button onClick={() => setCurrentPage("Aptitude")} className="btn btn-success">Aptitude</button>
//         <button onClick={() => setCurrentPage("Coding")} className="btn btn-warning">Coding</button>
//         <button onClick={sendNotification} className="btn btn-danger">Notification</button>
//       </div>

//       {currentPage === "AddMaterial" && (
//         <form onSubmit={handleFormSubmit} className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-xl">
//           <div className="space-y-4">
//             <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Material Name" required className="input" />
//             <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider Name" required className="input" />
//             <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input" />
//             <select value={type} onChange={(e) => setType(e.target.value)} className="input">
//               <option value="Aptitude">Aptitude</option>
//               <option value="Coding">Coding</option>
//             </select>
//             <input type="url" value={materialFileLink} onChange={(e) => setMaterialFileLink(e.target.value)} placeholder="Material Link" required className="input" />
//             <button type="submit" className="btn btn-primary w-full">{editingMaterial ? "Update Material" : "Save Material"}</button>
//           </div>
//         </form>
//       )}

//       {(currentPage === "ViewMaterial" || currentPage === "Aptitude" || currentPage === "Coding") && (
//         <table className="table-auto w-full mt-6 bg-white shadow-lg rounded-xl">
//           <thead>
//             <tr>
//               <th>Material Name</th>
//               <th>Provider</th>
//               <th>Date</th>
//               <th>Type</th>
//               <th>Link</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {materials.map((material, index) => (
//               <tr key={index}>
//                 <td>{material.materialName}</td>
//                 <td>{material.providerName}</td>
//                 <td>{material.date}</td>
//                 <td>{material.type}</td>
//                 <td><a href={material.materialFileLink} target="_blank" rel="noopener noreferrer">Link</a></td>
//                 <td>
//                   <button onClick={() => handleEdit(material)} className="btn btn-sm btn-warning">Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default MaterialPage;


/*
// import React, { useState, useEffect } from "react";
// import { db } from "../auth/firebase";
// import { getAuth } from "firebase/auth";
// import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { toast } from "react-toastify";
// import { FaPlusCircle, FaListAlt, FaBell, FaClipboardList } from 'react-icons/fa';

// const MaterialPage = () => {
//   const auth = getAuth();
//   const [adminId, setAdminId] = useState("");
//   const [materialName, setMaterialName] = useState("");
//   const [date, setDate] = useState("");
//   const [type, setType] = useState("Aptitude");
//   const [materialFileLink, setMaterialFileLink] = useState("");
//   const [materials, setMaterials] = useState([]);
//   const [selectedType, setSelectedType] = useState("All");
//   const [currentPage, setCurrentPage] = useState("AddMaterial"); // Default page

//   // Fetch current admin's ID
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       setAdminId(user.uid);
//     }
//   }, []);

//   // Fetch materials uploaded by the logged-in admin
//   useEffect(() => {
//     if (adminId) {
//       fetchMaterials();
//     }
//   }, [adminId]);

//   // Fetch materials from Firestore
//   const fetchMaterials = async () => {
//     const q = query(
//       collection(db, "admins", adminId, "materialDetails"),
//       where("adminId", "==", adminId)
//     );
//     const querySnapshot = await getDocs(q);
//     const fetchedMaterials = querySnapshot.docs.map((doc) => doc.data());
//     setMaterials(fetchedMaterials);
//   };

//   // Handle material form submission
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const materialData = {
//         materialName,
//         date,
//         type,
//         materialFileLink,
//         adminId,
//         createdAt: new Date(),
//       };

//       await addDoc(collection(db, "admins", adminId, "materialDetails"), materialData);
//       toast.success("Material added successfully!");
//       fetchMaterials();
//       resetForm();
//     } catch (error) {
//       console.error("Error adding material:", error);
//       toast.error("Failed to add material.");
//     }
//   };

//   // Reset the form after submission
//   const resetForm = () => {
//     setMaterialName("");
//     setDate("");
//     setType("Aptitude");
//     setMaterialFileLink("");
//   };

//   // Handle type selection (Aptitude/Coding)
//   const handleTypeChange = (e) => {
//     setSelectedType(e.target.value);
//   };

//   // Render materials based on the selected type
//   const filteredMaterials = selectedType === "All" ? materials : materials.filter((material) => material.type === selectedType);

//   // Notification functionality (can be extended further to integrate actual notification service)
//   const sendNotification = () => {
//     toast.info("Sending notifications to all students...");
//   };

//   return (
//     <div className="material-page-container p-6 flex flex-col items-center mt-16">
//       <h2 className="text-4xl font-bold mb-8 text-center">Material Management</h2>

//       {/* Buttons Section with Icons */
//       <div className="mb-6 space-x-4 flex flex-wrap justify-center">
//         <button
//           onClick={() => setCurrentPage("AddMaterial")}
//           className="btn flex items-center bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 space-x-2"
//         >
//           <FaPlusCircle />
//           <span>Add Material</span>
//         </button>
//         <button
//           onClick={() => setCurrentPage("ViewMaterial")}
//           className="btn flex items-center bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 space-x-2"
//         >
//           <FaListAlt />
//           <span>View Material</span>
//         </button>
//         <button
//           onClick={() => setCurrentPage("Aptitude")}
//           className="btn flex items-center bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 space-x-2"
//         >
//           <FaClipboardList />
//           <span>Aptitude</span>
//         </button>
//         <button
//           onClick={() => setCurrentPage("Coding")}
//           className="btn flex items-center bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 space-x-2"
//         >
//           <FaClipboardList />
//           <span>Coding</span>
//         </button>
//         <button
//           onClick={sendNotification}
//           className="btn flex items-center bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 space-x-2"
//         >
//           <FaBell />
//           <span>Notification</span>
//         </button>
//       </div>

//       {/* Conditionally Render Content Based on the Current Page */}
//       {currentPage === "AddMaterial" && (
//         <form onSubmit={handleFormSubmit} className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-xl">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium mb-2">Material Name</label>
//               <input
//                 type="text"
//                 value={materialName}
//                 onChange={(e) => setMaterialName(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-medium mb-2">Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-medium mb-2">Type</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               >
//                 <option value="Aptitude">Aptitude</option>
//                 <option value="Coding">Coding</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-lg font-medium mb-2">Material Link</label>
//               <input
//                 type="url"
//                 value={materialFileLink}
//                 onChange={(e) => setMaterialFileLink(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-6"
//             >
//               Save Material
//             </button>
//           </div>
//         </form>
//       )}

//       {/* View Material Table */}
//       {currentPage === "ViewMaterial" && (
//         <table className="table-auto w-full mt-6 bg-white shadow-lg rounded-xl">
//           <thead>
//             <tr>
//               <th className="p-3">Material Name</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Type</th>
//               <th className="p-3">Link</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMaterials.map((material, index) => (
//               <tr key={index}>
//                 <td className="p-3">{material.materialName}</td>
//                 <td className="p-3">{material.date}</td>
//                 <td className="p-3">{material.type}</td>
//                 <td className="p-3">
//                   <a href={material.materialFileLink} target="_blank" rel="noopener noreferrer">
//                     Link
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Aptitude Table */}
//       {currentPage === "Aptitude" && (
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-4">Aptitude Materials</h3>
//           <table className="table-auto w-full bg-white shadow-lg rounded-xl">
//             <thead>
//               <tr>
//                 <th className="p-3">Material Name</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Link</th>
//               </tr>
//             </thead>
//             <tbody>
//               {materials
//                 .filter((material) => material.type === "Aptitude")
//                 .map((material, index) => (
//                   <tr key={index}>
//                     <td className="p-3">{material.materialName}</td>
//                     <td className="p-3">{material.date}</td>
//                     <td className="p-3">
//                       <a href={material.materialFileLink} target="_blank" rel="noopener noreferrer">
//                         Link
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Coding Table */}
//       {currentPage === "Coding" && (
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-4">Coding Materials</h3>
//           <table className="table-auto w-full bg-white shadow-lg rounded-xl">
//             <thead>
//               <tr>
//                 <th className="p-3">Material Name</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Link</th>
//               </tr>
//             </thead>
//             <tbody>
//               {materials
//                 .filter((material) => material.type === "Coding")
//                 .map((material, index) => (
//                   <tr key={index}>
//                     <td className="p-3">{material.materialName}</td>
//                     <td className="p-3">{material.date}</td>
//                     <td className="p-3">
//                       <a href={material.materialFileLink} target="_blank" rel="noopener noreferrer">
//                         Link
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Notification Section */}
//       {currentPage === "Notification" && (
//         <div className="mt-6">
//           <button
//             onClick={sendNotification}
//             className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
//           >
//             Send Notifications to All Students
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaterialPage;










