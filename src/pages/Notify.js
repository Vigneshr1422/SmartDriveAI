import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../auth/firebase";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const Email = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;

      if (!adminUid) {
        console.error("Admin not authenticated.");
        setLoading(false);
        return;
      }

      const studentsRef = collection(db, `class-students/${adminUid}/students`);
      const q = query(studentsRef, orderBy("regNo"));
      const querySnapshot = await getDocs(q);

      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);
      setFilteredStudents(studentList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const sendSelectedEmails = async () => {
    if (!message) {
      showToast("Message cannot be empty!");
      return;
    }

    if (selectedEmails.length === 0) {
      showToast("No students selected!");
      return;
    }

    setSending(true);
    const failedEmails = [];

    for (const email of selectedEmails) {
      try {
        await emailjs.send(
          "service_9azavw8",
          "template_u73fu4p",
          { to_email: email, message: message },
          "1K4Z1DQiS0AVGorrW"
        );
      } catch (error) {
        console.error("Failed to send email to:", email);
        failedEmails.push(email);
      }
    }

    showToast(
      failedEmails.length === 0
        ? "Emails sent successfully!"
        : `Failed to send to: ${failedEmails.join(", ")}`
    );

    setSending(false);
  };

  const sendAllEmails = () => {
    const emails = filteredStudents.map((student) => student.email);
    setSelectedEmails(emails);
    sendSelectedEmails();
  };

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "All") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) => student.placementStatus === status
      );
      setFilteredStudents(filtered);
    }
    setSelectedEmails([]); // Reset selection on filter
  };

  return (
<div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-32 px-4 pb-4 overflow-y-auto">
  <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📩 Send Email to Students
        </h1>

        {toastMessage && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6 flex-wrap">
          {["All", "Placed", "Unplaced", "Not Willing"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows="4"
        />

        <div className="flex space-x-4 justify-center mb-4">
          <button
            onClick={sendSelectedEmails}
            className={`${
              sending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white py-2 px-4 rounded-lg`}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send to Selected"}
          </button>

          <button
            onClick={sendAllEmails}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Send to All
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg block mx-auto mb-6"
        >
          Back
        </button>

        {loading ? (
  <p className="text-center text-gray-600">Loading students...</p>
) : filteredStudents.length > 0 ? (
  <div className="overflow-auto max-h-[60vh] border rounded-xl relative">

<table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-blue-500 text-white sticky top-0">
                <tr>
                  <th className="border px-4 py-2">Select</th>
                  <th className="border px-4 py-2">S.No</th>
                  <th className="border px-4 py-2">Reg No</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
                  >
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(student.email)}
                        onChange={() => handleCheckboxChange(student.email)}
                        className="h-4 w-4 text-blue-500"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{student.regNo || "N/A"}</td>
                    <td className="border px-4 py-2">{student.name || "N/A"}</td>
                    <td className="border px-4 py-2">{student.email || "N/A"}</td>
                    <td className="border px-4 py-2 text-center">{student.placementStatus || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default Email;
