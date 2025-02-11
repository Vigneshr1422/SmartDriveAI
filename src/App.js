import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UploadMaterial from "./pages/UploadMaterial";
import MockInterviewPage from "./pages/MockInterviewPage";

import StudentPage from "./pages/StudentPage";
import ManagerPage from "./pages/ManagerDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RoleBasedRoute from "./auth/RoleBasedRoute";
import DashboardPage from "./pages/DashboardPage";
import StudentEntry from "./pages/StudentEntry";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import StudentList from "./pages/StudentList";
import AnnualReport from "./pages/AnnualReport";
import PlacedStudentsPage from "./pages/PlacedStudentsPage";
import ExcelGenerator from "./pages/ExcelGenerator";
import CompanyDetail from "./pages/CompanyDetail";
import PieChartPage from "./pages/PieChart";
import DriveDetails from "./pages/DriveDetails";
import Drivestu from "./pages/Drivestu";
// import Trining from "./pages/Trining";
import Placehistory from "./pages/Placehistory";
import TrainingPartner from "./pages/Training";
import Notify from "./pages/Notify";
import ResumeClick from "./pages/ResumeClick"; // Import ResumeClick page

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <RoleBasedRoute allowedRoles={["student"]}>
                <StudentPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <RoleBasedRoute allowedRoles={["manager"]}>
                <ManagerPage />
              </RoleBasedRoute>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-student" element={<StudentEntry />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/annual-report" element={<AnnualReport />} />
          <Route path="/placed-students" element={<PlacedStudentsPage />} />
          <Route path="/generate-report" element={<ExcelGenerator />} />
          <Route path="/company-details" element={<CompanyDetail />} />
          <Route path="/drive-details" element={<DriveDetails />} />
          <Route path="/drivestu" element={<Drivestu />} />
        {/* <Route path="/trining" element={<Trining />} /> */}
        <Route path="/Placehistory" element={<Placehistory />} />
          <Route
            path="/training-partner"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <TrainingPartner />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/notify"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <Notify />
              </RoleBasedRoute>
            }
          />
          <Route path="/upload-material" element={<UploadMaterial />} />
          <Route path="/statistics" element={<PieChartPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />

          {/* Resume Click Route */}
          <Route
            path="/resume-click"
            element={
              <RoleBasedRoute allowedRoles={["student"]}>
                <ResumeClick />
              </RoleBasedRoute>
            }
          />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
