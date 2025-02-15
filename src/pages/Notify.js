import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../auth/firebase"; 
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom"; 

const Email = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); 
  const [toastMessage, setToastMessage] = useState(""); 
  const [sending, setSending] = useState(false); 
  const [selectedEmails, setSelectedEmails] = useState([]); 
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const sendSelectedEmails = async () => {
    if (!message) {
      setToastMessage("Message cannot be empty!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    if (selectedEmails.length === 0) {
      setToastMessage("No students selected!");
      setTimeout(() => setToastMessage(""), 3000);
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

    setToastMessage(
      failedEmails.length === 0
        ? "Emails sent successfully!"
        : `Failed to send to: ${failedEmails.join(", ")}`
    );

    setTimeout(() => setToastMessage(""), 3000);
    setSending(false);
  };

  const sendAllEmails = async () => {
    setSelectedEmails(students.map((student) => student.email));
    sendSelectedEmails();
  };

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">📩 Send Email to Students</h2>

        {toastMessage && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        )}

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
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg block mx-auto"
        >
          Back
        </button>

        {loading ? (
          <p className="text-center text-gray-600 mt-4">Loading students...</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">Reg No</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(student.email)}
                        onChange={() => handleCheckboxChange(student.email)}
                        className="h-4 w-4 text-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {student.regNo || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{student.name || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-4">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default Email;
