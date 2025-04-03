import React, { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../auth/firebase"; // Ensure Firebase is initialized
import moment from "moment"; // Ensure moment.js is installed
import { useNavigate } from "react-router-dom"; // For back navigation

const DriveStu = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchAdminIds();
    }, []);

    const fetchAdminIds = async () => {
        try {
            const adminsRef = collection(db, "admins");
            const adminsSnapshot = await getDocs(adminsRef);

            let adminIds = [];
            adminsSnapshot.forEach((doc) => {
                adminIds.push(doc.id);
            });

            if (adminIds.length > 0) {
                fetchAllDrives(adminIds);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            setLoading(false);
        }
    };

    const fetchAllDrives = (adminIds) => {
        let allDrives = [];

        adminIds.forEach((adminId) => {
            const drivesRef = collection(db, `admin/${adminId}/drives`);

            // Listen for real-time updates
            onSnapshot(drivesRef, (snapshot) => {
                let fetchedDrives = [];
                snapshot.forEach((doc) => {
                    fetchedDrives.push({ id: doc.id, ...doc.data() });
                });

                allDrives = [...allDrives, ...fetchedDrives];
                sortDrives(allDrives);
            });
        });
    };

    const sortDrives = (drives) => {
        const today = moment().format("YYYY-MM-DD");

        const upcoming = drives
            .filter((drive) => moment(drive.date).isAfter(today))
            .sort((a, b) => moment(a.date) - moment(b.date));

        const completed = drives
            .filter((drive) => moment(drive.date).isBefore(today))
            .sort((a, b) => moment(b.date) - moment(a.date));

        setDrives([...upcoming, ...completed]);
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto m-14">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Drive Details
            </h2>

            {loading ? (
                <p className="text-center text-gray-500 text-lg">Loading...</p>
            ) : drives.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No drives available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left text-lg">S. No.</th>
                                <th className="py-4 px-6 text-left text-lg">Company</th>
                                <th className="py-4 px-6 text-left text-lg">Role</th>
                                <th className="py-4 px-6 text-left text-lg">Location</th>
                                <th className="py-4 px-6 text-left text-lg">Salary</th>
                                <th className="py-4 px-6 text-left text-lg">Date</th>
                                <th className="py-4 px-6 text-left text-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drives.map((drive, index) => (
                                <tr
                                    key={drive.id}
                                    className={`transition-all duration-300 border-b ${
                                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                    } hover:bg-gray-200`}
                                >
                                    <td className="py-5 px-6 font-semibold text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="py-5 px-6 font-semibold text-gray-700">
                                        {drive.companyName}
                                    </td>
                                    <td className="py-5 px-6 text-gray-600">{drive.role}</td>
                                    <td className="py-5 px-6 text-gray-600">{drive.location}</td>
                                    <td className="py-5 px-6 text-gray-600">₹{drive.salary}</td>
                                    <td className="py-5 px-6 text-gray-600">{drive.date}</td>
                                    <td className="py-5 px-6">
                                        {moment(drive.date).isBefore(moment()) ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-sm text-sm">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-sm text-sm">
                                                Upcoming
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Back Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md text-lg hover:bg-gray-900 transition duration-300"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriveStu;
