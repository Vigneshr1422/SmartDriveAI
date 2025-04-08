import React, { useState, useEffect } from "react";
import { FaListAlt, FaUserPlus, FaEdit } from "react-icons/fa";
import { db } from "../auth/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompanyDetail = () => {
  const navigate = useNavigate();
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const fetchCompanyList = async () => {
    setIsLoadingList(true);
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
    setIsLoadingList(false);
  };

  useEffect(() => {
    if (showCompanyList) {
      fetchCompanyList();
    }
  }, [showCompanyList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const adminId = user?.uid;

    try {
      const companyDetails = {
        companyName,
        location,
        website,
        email,
        companyType,
        hrEmail,
        [editMode ? "updatedAt" : "createdAt"]: new Date(),
      };

      if (editMode && editingCompanyId && adminId) {
        const companyRef = doc(
          db,
          "admins",
          adminId,
          "companyDetails",
          editingCompanyId
        );
        await updateDoc(companyRef, companyDetails);
        toast.success("Company updated successfully!");
      } else if (adminId) {
        await addDoc(
          collection(db, "admins", adminId, "companyDetails"),
          companyDetails
        );
        toast.success("Company added successfully!");
      }

      fetchCompanyList();
      setShowAddCompanyForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving company!");
    } finally {
      setIsSaving(false);
      setEditMode(false);
      setEditingCompanyId(null);
    }
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
    navigate("/admin");
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">Company Details</h2>

      {!showAddCompanyForm && !showCompanyList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => setShowCompanyList(true)}
            className="p-6 bg-white shadow-md rounded-xl hover:bg-gray-200 text-center"
          >
            <FaListAlt className="text-3xl text-blue-500 mb-2" />
            <span className="font-medium">Company List</span>
          </button>

          <button
            onClick={() => setShowAddCompanyForm(true)}
            className="p-6 bg-white shadow-md rounded-xl hover:bg-gray-200 text-center"
          >
            <FaUserPlus className="text-3xl text-green-500 mb-2" />
            <span className="font-medium">Add Company</span>
          </button>
        </div>
      )}

      {showAddCompanyForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 w-full max-w-xl bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          {/* Form Inputs */}
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input" required placeholder="Company Name" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" required placeholder="Location" />
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className="input" required placeholder="Website" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" required placeholder="Email" />
          <input value={hrEmail} onChange={(e) => setHrEmail(e.target.value)} className="input" required placeholder="HR Email" />
          <select value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="input">
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex justify-center items-center gap-2">
                <div className="loader border-white"></div> Saving...
              </div>
            ) : (
              editMode ? "Update Company" : "Save Company"
            )}
          </button>
        </form>
      )}

      {showCompanyList && (
        <div className="mt-6 w-full max-w-5xl">
          {isLoadingList ? (
            <div className="flex justify-center items-center h-32">
              <div className="loader border-blue-500"></div>
              <span className="ml-2">Loading companies...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border border-collapse">
                <thead className="bg-blue-300">
                  <tr>
                    <th className="p-2 border">S.No</th>
                    <th className="p-2 border">Company Name</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Website</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">HR Email</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, index) => (
                    <tr key={company.id} className="even:bg-gray-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{company.companyName}</td>
                      <td className="border p-2">{company.location}</td>
                      <td className="border p-2">{company.website}</td>
                      <td className="border p-2">{company.email}</td>
                      <td className="border p-2">{company.hrEmail}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleEditClick(company)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(showAddCompanyForm || showCompanyList) && (
        <div className="flex gap-4 mt-6">
          <button onClick={handleBackToMainMenu} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Back to Menu
          </button>
          <button onClick={handleBackToAdminPage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Admin Page
          </button>
        </div>
      )}

      {/* Style for loader spinner */}
      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CompanyDetail;
