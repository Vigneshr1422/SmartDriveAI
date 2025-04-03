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
