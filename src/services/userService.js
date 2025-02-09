import { db } from '../auth/firebase'; // Importing Firestore database
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Firestore methods

// Add or update the role for a user
export const addUserRole = async (userId, role, email) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Check if user document exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // If the user exists, update the role
      await updateDoc(userRef, { role });
      console.log(`Role ${role} assigned to user ${userId}`);
    } else {
      // If the user doesn't exist, create it with the given role and email
      await setDoc(userRef, { role, email });
      console.log(`User created and role ${role} assigned to user ${userId}`);
    }
  } catch (error) {
    console.error("Error assigning role: ", error.message);
    throw new Error(error.message); // Propagate error to be handled in RegisterPage
  }
};

// Save student department and section details
export const saveStudentDetails = async (userId, department, section) => {
  try {
    const studentRef = doc(db, "students", userId); // Reference to the student document

    // Check if the student document exists
    const studentSnap = await getDoc(studentRef);
    
    if (studentSnap.exists()) {
      // If the student exists, update the department and section
      await updateDoc(studentRef, { department, section });
      console.log(`Student details updated: ${department}, ${section}`);
    } else {
      // If the student doesn't exist, create it with the department and section
      await setDoc(studentRef, { department, section });
      console.log(`Student details saved: ${department}, ${section}`);
    }
  } catch (error) {
    console.error("Error saving student details: ", error.message);
    throw new Error(error.message); // Propagate error to be handled in RegisterPage
  }
};
