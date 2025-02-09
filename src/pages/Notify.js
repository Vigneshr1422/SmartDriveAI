import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../auth/firebase"; // Update with the correct path
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom"; // For navigation

const Email = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Message input field
  const [toastMessage, setToastMessage] = useState(""); // Toast for notifications
  const [sending, setSending] = useState(false); // To prevent multiple sends
  const [selectedEmails, setSelectedEmails] = useState([]); // To store selected emails
  const navigate = useNavigate(); // React Router navigation hook

  // Fetch students saved by the logged-in admin
  const fetchStudents = async () => {
    try {
      const auth = getAuth();
      const adminUid = auth.currentUser?.uid; // Get admin UID

      if (!adminUid) {
        console.error("Admin not authenticated.");
        setLoading(false);
        return;
      }

      // Reference the 'students' sub-collection under the admin's document
      const studentsRef = collection(db, `class-students/${adminUid}/students`);

      // Fetch all documents in ascending order of roll number
      const q = query(studentsRef, orderBy("regNo"));
      const querySnapshot = await getDocs(q);

      // Map the documents into student objects
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Student data
      }));

      setStudents(studentList); // Update the state with fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  // Handle sending email to selected students
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

    // Loop through all selected emails and send
    for (const email of selectedEmails) {
      try {
        await emailjs.send(
          "service_9azavw8", // Replace with your EmailJS Service ID
          "template_u73fu4p", // Replace with your EmailJS Template ID
          {
            to_email: email,
            message: message,
          },
          "1K4Z1DQiS0AVGorrW" // Replace with your EmailJS Public Key
        );
      } catch (error) {
        console.error("Failed to send email to:", email);
        failedEmails.push(email);
      }
    }

    if (failedEmails.length === 0) {
      setToastMessage("Emails sent to selected students!");
    } else {
      setToastMessage(`Failed to send emails to: ${failedEmails.join(", ")}`);
    }

    setTimeout(() => setToastMessage(""), 3000); // Clear toast
    setSending(false);
  };

  // Handle checkbox change
  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 m-16" > 
      <h2 className="text-2xl font-bold mb-4">Send Email to Students</h2>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Message Input */}
      <div className="mb-4">
        <textarea
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
          rows="4"
        />
      </div>

      {/* Send Selected Button */}
      <div className="mb-4">
        <button
          onClick={sendSelectedEmails}
          className={`${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 px-4 rounded-lg`}
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Selected"}
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mb-4"
      >
        Back
      </button>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-teal-500 text-white">
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
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(student.email)}
                      onChange={() => handleCheckboxChange(student.email)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.regNo || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.email || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

export default Email;
