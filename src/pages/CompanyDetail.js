import React, { useState, useEffect } from "react";
import { FaListAlt, FaUserPlus, FaEdit } from "react-icons/fa";
import { db } from "../auth/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CompanyDetail = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [companyType, setCompanyType] = useState("product");
  const [hrEmail, setHrEmail] = useState("");
  const [companies, setCompanies] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const fetchCompanyList = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const adminId = user?.uid;

    if (adminId) {
      const querySnapshot = await getDocs(
        collection(db, "admins", adminId, "companyDetails")
      );
      const companyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompanies(companyData);
    }
  };

  useEffect(() => {
    if (showCompanyList) {
      fetchCompanyList();
    }
  }, [showCompanyList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    const adminId = user?.uid;

    if (editMode) {
      if (editingCompanyId && adminId) {
        try {
          const companyRef = doc(
            db,
            "admins",
            adminId,
            "companyDetails",
            editingCompanyId
          );
          await updateDoc(companyRef, {
            companyName,
            location,
            website,
            email,
            companyType,
            hrEmail,
            updatedAt: new Date(),
          });

          toast.success("Company details updated successfully!");
          setEditMode(false);
          setEditingCompanyId(null);
          fetchCompanyList();
        } catch (error) {
          console.error("Error updating company details:", error);
          toast.error("Failed to update company details.");
        }
      }
    } else {
      if (adminId) {
        try {
          const companyDetails = {
            companyName,
            location,
            website,
            email,
            companyType,
            hrEmail,
            createdAt: new Date(),
          };

          await addDoc(
            collection(db, "admins", adminId, "companyDetails"),
            companyDetails
          );
          toast.success("Company details added successfully!");
          fetchCompanyList();
        } catch (error) {
          console.error("Error adding company details:", error);
          toast.error("Failed to add company details.");
        }
      }
    }
    setShowAddCompanyForm(false);
  };

  const handleEditClick = (company) => {
    setEditMode(true);
    setEditingCompanyId(company.id);
    setCompanyName(company.companyName);
    setLocation(company.location);
    setWebsite(company.website);
    setEmail(company.email);
    setCompanyType(company.companyType);
    setHrEmail(company.hrEmail);
    setShowAddCompanyForm(true);
  };

  const handleBackToMainMenu = () => {
    setShowAddCompanyForm(false);
    setShowCompanyList(false);
    setEditMode(false);
    setEditingCompanyId(null);
  };

  const handleBackToAdminPage = () => {
    navigate("/admin"); // Navigate to the admin page
  };

  return (
<div className="company-detail-container p-6 flex flex-col items-center mt-16">
<h2 className="text-4xl font-bold mb-8 text-center">Company Details</h2>

      {!showAddCompanyForm && !showCompanyList && (
        <div className="grid grid-cols-2 gap-12">
          <button
            className="icon-button flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-xl hover:bg-gray-200"
            onClick={() => setShowCompanyList(true)}
          >
            <FaListAlt className="text-4xl text-blue-500 mb-4" />
            <span className="text-lg font-medium">Company List</span>
          </button>

          <button
            className="icon-button flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-xl hover:bg-gray-200"
            onClick={() => setShowAddCompanyForm(true)}
          >
            <FaUserPlus className="text-4xl text-green-500 mb-4" />
            <span className="text-lg font-medium">Add Company</span>
          </button>
        </div>
      )}

      {showAddCompanyForm && (
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4 mt-6 max-w-3xl w-full p-6 bg-white shadow-lg rounded-xl"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-lg font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Company Type</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">HR Email</label>
              <input
                type="email"
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-6 text-lg"
          >
            {editMode ? "Update Company" : "Save Company"}
          </button>
        </form>
      )}

      {showCompanyList && (
        <div className="flex flex-col items-center mt-6">
          <div className="overflow-x-auto w-full max-w-5xl">
            <table className="min-w-full table-auto border-collapse text-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-4">S.No</th>
                  <th className="border border-gray-300 p-4">Company Name</th>
                  <th className="border border-gray-300 p-4">Location</th>
                  <th className="border border-gray-300 p-4">Website</th>
                  <th className="border border-gray-300 p-4">Email</th>
                  <th className="border border-gray-300 p-4">HR Email</th>
                  <th className="border border-gray-300 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={company.id} className="even:bg-gray-50">
                    <td className="border border-gray-300 p-4">{index + 1}</td>
                    <td className="border border-gray-300 p-4">{company.companyName}</td>
                    <td className="border border-gray-300 p-4">{company.location}</td>
                    <td className="border border-gray-300 p-4">{company.website}</td>
                    <td className="border border-gray-300 p-4">{company.email}</td>
                    <td className="border border-gray-300 p-4">{company.hrEmail}</td>
                    <td className="border border-gray-300 p-4">
                      <button
                        onClick={() => handleEditClick(company)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showAddCompanyForm || showCompanyList) && (
        <div>
          <button
            onClick={handleBackToMainMenu}
            className="mt-6 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg"
          >
            Back to Main Menu
          </button>
          <button
            onClick={handleBackToAdminPage} // New button to navigate to admin page
            className="mt-6 ml-4 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
          >
            Back to Admin Page
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
