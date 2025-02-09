import React, { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";

// Register the necessary chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const PieChartPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Optional state, but we'll handle loading differently

  useEffect(() => {
    const fetchStudents = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const studentsRef = collection(db, `class-students/${user.uid}/students`);
          const studentSnap = await getDocs(studentsRef);
          const studentsList = studentSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setStudents(studentsList);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      } else {
        console.error("No admin is logged in.");
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchStudents();
  }, []);

  const getPlacementStats = () => {
    let placed = 0;
    let unplaced = 0;
    let notWilling = 0;

    students.forEach((student) => {
      if (student.placementStatus === "Placed") placed++;
      else if (student.placementStatus === "Unplaced") unplaced++;
      else if (student.placementStatus === "Not Willing") notWilling++;
    });

    return {
      placed,
      unplaced,
      notWilling,
    };
  };

  const { placed, unplaced, notWilling } = getPlacementStats();

  const data = {
    labels: ["Placed", "Unplaced", "Not Willing"],
    datasets: [
      {
        data: [placed, unplaced, notWilling],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Avoid the loading text and show the pie chart immediately
  return (
   // <div className="p-6 min-h-screen flex flex-col items-center">
      <div className="company-detail-container p-6 flex flex-col items-center mt-16">

      <h2 className="text-3xl font-semibold mb-6">Placement Statistics</h2>

      <div className="flex justify-between items-center w-full max-w-6xl">
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 w-full max-w-md">
            <Pie data={data} />
          </div>
        </div>

        <div className="w-1/2 pl-6 space-y-4">
          <h3 className="text-2xl font-semibold">Placement Status Details</h3>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Placed Students:</span>
            <span>{placed}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Unplaced Students:</span>
            <span>{unplaced}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Not Willing Students:</span>
            <span>{notWilling}</span>
          </div>

          {/* Back Button */}
          <div className="mt-4 flex justify-end">
            <button 
              className="bg-blue-500 text-white p-2 rounded-md" 
              onClick={() => window.history.back()}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartPage;
