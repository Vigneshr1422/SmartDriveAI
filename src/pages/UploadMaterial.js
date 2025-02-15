// import React, { useState, useEffect } from "react";
// import { db } from "../auth/firebase";
// import { getAuth } from "firebase/auth";
// import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

// const MaterialPage = () => {
//   const auth = getAuth();
//   const navigate = useNavigate(); // Initialize useNavigate hook
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

//   // Handle the back button functionality
//   const handleBack = () => {
//     navigate(-1); // Go back to the previous page
//   };

//     return (
//       <div className="p-6 flex flex-col items-center pt-16 mt-24">
//         <h2 className="text-2xl font-semibold mb-6">Material Management</h2>
    
//         <div className="mb-6 space-x-4">
//           <button onClick={() => setCurrentPage("AddMaterial")} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Material</button>
//           <button onClick={() => setCurrentPage("ViewMaterial")} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">View Material</button>
//           <button onClick={() => setCurrentPage("Aptitude")} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Aptitude</button>
//           <button onClick={() => setCurrentPage("Coding")} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Coding</button>
//         </div>
    
//         {currentPage === "AddMaterial" && (
//           <form onSubmit={handleFormSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//             <div className="space-y-4">
//               <input type="text" value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Material Name" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
//               <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Provider Name" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
//               <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
//               <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
//                 <option value="Aptitude">Aptitude</option>
//                 <option value="Coding">Coding</option>
//               </select>
//               <input type="url" value={materialFileLink} onChange={(e) => setMaterialFileLink(e.target.value)} placeholder="Material Link" required className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
//               <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                 {editingMaterial ? "Update Material" : "Save Material"}
//               </button>
//             </div>
//           </form>
//         )}
    
//         {(currentPage === "ViewMaterial" || currentPage === "Aptitude" || currentPage === "Coding") && (
//           <div className="overflow-x-auto w-full mt-6 bg-white p-4 rounded-lg shadow-lg">
//             <table className="w-full max-w-4xl mx-auto table-auto border-collapse text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border text-left">Material Name</th>
//                   <th className="p-2 border text-left">Provider</th>
//                   <th className="p-2 border text-left">Date</th>
//                   <th className="p-2 border text-left">Type</th>
//                   <th className="p-2 border text-left">Link</th>
//                   <th className="p-2 border text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {materials.map((material) => (
//                   <tr key={material.id} className="border-b hover:bg-gray-50">
//                     <td className="p-2">{material.materialName}</td>
//                     <td className="p-2">{material.providerName}</td>
//                     <td className="p-2">{material.date}</td>
//                     <td className="p-2">{material.type}</td>
//                     <td className="p-2">
//                       <a href={material.materialFileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                         Link
//                       </a>
//                     </td>
//                     <td className="p-2">
//                       <button onClick={() => handleEdit(material)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
    
//         {/* Centered back button */}
//         <div className="mt-6 flex justify-center">
//           <button onClick={handleBack} className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
//             Back
//           </button>
//         </div>
//       </div>
//     );
    
  
// };
//its working 

// export default MaterialPage;




import React, { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MaterialPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [formState, setFormState] = useState({
    materialName: "",
    providerName: "",
    date: "",
    type: "Aptitude",
    materialFileLink: "",
  });
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
    if (!adminId) return;
    let materialCollection = collection(db, "admins", adminId, "materialDetails");
    let q = query(materialCollection);
    if (currentPage === "Aptitude" || currentPage === "Coding") {
      q = query(materialCollection, where("type", "==", currentPage));
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
        await updateDoc(materialRef, formState);
        toast.success("Material updated successfully!");
      } else {
        const materialData = { ...formState, adminId, createdAt: new Date() };
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
    setFormState({
      materialName: "",
      providerName: "",
      date: "",
      type: "Aptitude",
      materialFileLink: "",
    });
    setEditingMaterial(null);
  };

  const handleEdit = (material) => {
    setFormState({
      materialName: material.materialName,
      providerName: material.providerName,
      date: material.date,
      type: material.type,
      materialFileLink: material.materialFileLink,
    });
    setEditingMaterial(material);
    setCurrentPage("AddMaterial");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
<div className="min-h-screen bg-gray-900 flex flex-col items-center pt-24 px-4">
  <h2 className="text-3xl font-bold text-white mb-6 text-center">📚 Material Management</h2>

  {/* Navigation Buttons */}
  <div className="flex flex-wrap gap-4 justify-center mb-6 w-full">
    {["AddMaterial", "ViewMaterial", "Aptitude", "Coding"].map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-4 py-2 rounded-lg text-white transition text-sm sm:text-base w-full sm:w-auto ${
          currentPage === page ? "bg-blue-600 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {page}
      </button>
    ))}
  </div>

  {/* Form Section */}
  {currentPage === "AddMaterial" && (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={formState.materialName}
          onChange={(e) =>
            setFormState({ ...formState, materialName: e.target.value })
          }
          placeholder="Material Name"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={formState.providerName}
          onChange={(e) =>
            setFormState({ ...formState, providerName: e.target.value })
          }
          placeholder="Provider Name"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={formState.date}
          onChange={(e) =>
            setFormState({ ...formState, date: e.target.value })
          }
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={formState.type}
          onChange={(e) =>
            setFormState({ ...formState, type: e.target.value })
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="Aptitude">Aptitude</option>
          <option value="Coding">Coding</option>
        </select>
        <input
          type="url"
          value={formState.materialFileLink}
          onChange={(e) =>
            setFormState({ ...formState, materialFileLink: e.target.value })
          }
          placeholder="Material Link"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editingMaterial ? "Update Material" : "Save Material"}
        </button>
      </div>
    </form>
  )}

  {/* Material List Section */}
  {(currentPage === "ViewMaterial" || currentPage === "Aptitude" || currentPage === "Coding") && (
    <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-xl mt-6 overflow-x-auto">
      <table className="w-full min-w-max text-gray-800 border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left text-sm sm:text-base">
            <th className="p-3 border-b-2 border-gray-300">Material Name</th>
            <th className="p-3 border-b-2 border-gray-300">Provider</th>
            <th className="p-3 border-b-2 border-gray-300">Date</th>
            <th className="p-3 border-b-2 border-gray-300">Type</th>
            <th className="p-3 border-b-2 border-gray-300">Link</th>
            <th className="p-3 border-b-2 border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr
              key={material.id}
              className="border-t border-gray-300 hover:bg-gray-100 text-sm sm:text-base"
            >
              <td className="p-3">{material.materialName}</td>
              <td className="p-3">{material.providerName}</td>
              <td className="p-3">{material.date}</td>
              <td className="p-3">{material.type}</td>
              <td className="p-3">
                <a
                  href={material.materialFileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(material)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs sm:text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Back Button */}
  <button
    onClick={handleBack}
    className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
  >
    Back
  </button>
</div>

  );
};

export default MaterialPage;

