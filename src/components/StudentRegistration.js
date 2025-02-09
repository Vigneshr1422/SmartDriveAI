import React, { useState } from "react";
import { db } from "../auth/firebase"; // Firebase configuration

const StudentRegistration = () => {
  const [studentKey, setStudentKey] = useState(""); // Store the student's key
  const [registrationMessage, setRegistrationMessage] = useState(""); // Store registration result message

  // Function to handle student registration
  const handleRegister = async () => {
    try {
      // Fetch the admin-generated key from Firestore
      const adminKeyDoc = await db.collection("admin").doc("key").get();
      if (adminKeyDoc.exists) {
        const adminKey = adminKeyDoc.data().generatedKey;
        
        // If the student's key matches the admin key, proceed with registration
        if (studentKey === adminKey) {
          await db.collection("students").add({ key: studentKey, registrationDate: new Date() });
          setRegistrationMessage("Registration successful!");
        } else {
          setRegistrationMessage("Invalid key! Please use the correct admin key.");
        }
      } else {
        setRegistrationMessage("Admin key is not set.");
      }
    } catch (error) {
      console.error("Error during registration: ", error);
      setRegistrationMessage("Error during registration.");
    }
  };

  return (
    <div className="student-registration">
      <h2>Student Registration</h2>
      <input
        type="text"
        value={studentKey}
        onChange={(e) => setStudentKey(e.target.value)}
        placeholder="Enter Admin Key"
      />
      <button onClick={handleRegister}>Register</button>
      {registrationMessage && <p>{registrationMessage}</p>}
    </div>
  );
};

export default StudentRegistration;
