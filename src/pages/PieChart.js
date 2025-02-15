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
    <div className="company-detail-container p-4 sm:p-6 flex flex-col items-center mt-14">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
        Placement Statistics
      </h2>
  
      <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full max-w-6xl">
        
        {/* Pie Chart Section */}
        <div className="w-full sm:w-1/2 flex justify-center mb-6 sm:mb-0">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border-2 border-gray-300 
                          w-full max-w-[280px] sm:max-w-md flex justify-center">
            <Pie data={data} />
          </div>
        </div>
  
        {/* Placement Details */}
        <div className="w-full max-w-[250px] sm:max-w-none sm:w-1/2 sm:pl-6 space-y-3 text-center sm:text-left mx-auto">
  <h3 className="text-xs sm:text-2xl font-semibold">Placement Status Details</h3>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
    {/* Placed Students */}
    <div className="bg-green-100 border-l-4 border-green-500 p-2 sm:p-4 rounded-lg shadow text-center sm:text-left">
      <h4 className="font-medium text-green-700 text-xs sm:text-lg">Placed</h4>
      <p className="text-sm sm:text-xl font-bold">{placed}</p>
    </div>

    {/* Unplaced Students */}
    <div className="bg-red-100 border-l-4 border-red-500 p-2 sm:p-4 rounded-lg shadow text-center sm:text-left">
      <h4 className="font-medium text-red-700 text-xs sm:text-lg">Unplaced</h4>
      <p className="text-sm sm:text-xl font-bold">{unplaced}</p>
    </div>

    {/* Not Willing Students */}
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 sm:p-4 rounded-lg shadow text-center sm:text-left">
      <h4 className="font-medium text-yellow-700 text-xs sm:text-lg">Not Willing</h4>
      <p className="text-sm sm:text-xl font-bold">{notWilling}</p>
    </div>
  </div>

  {/* Back Button */}
  <div className="mt-2 flex justify-center sm:justify-end">
    <button 
      className="bg-blue-500 text-white px-2 py-1 sm:px-6 sm:py-3 rounded-md shadow hover:bg-blue-600 transition"
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
