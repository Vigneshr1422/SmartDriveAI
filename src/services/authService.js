// // src/services/authService.js
// import { auth, db } from "../auth/firebase"; // Import Firebase auth and Firestore
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore"; // Import methods for Firestore

// // Register a new user
// export const registerUser = async (email, password) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Store the user in Firestore with a default role (e.g., student)
//     await setDoc(doc(db, "users", user.uid), {
//       email: user.email,
//       role: "student", // Default role
//     });

//     return userCredential; // Return the user credential
//   } catch (error) {
//     console.error("Error registering user: ", error);
//     throw error;
//   }
// };

// // Login an existing user
// export const loginUser = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     return userCredential; // Return the user credential
//   } catch (error) {
//     console.error("Error logging in user: ", error);
//     throw error;
//   }
// };

// // Get the role of the user from Firestore
// export const getUserRole = async (userId) => {
//   try {
//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       return userSnap.data().role; // Return the role
//     } else {
//       throw new Error("User role not found");
//     }
//   } catch (error) {
//     console.error("Error getting user role:", error);
//     throw error;
//   }
// };
import { auth, db } from "../auth/firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ✅ Register a new user
export const registerUser = async (email, password, department, section) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "student",
      department,
      section
    });

    return userCredential;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};

// ✅ Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
};

// ✅ Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

// ✅ Get current logged-in user
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};

// ✅ Get user role from Firestore
export const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role;
    } else {
      throw new Error("User role not found");
    }
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
};

// ✅ Get user details (including department & section)
export const getUserDetails = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error("User details not found");
    }
  } catch (error) {
    console.error("Error getting user details:", error);
    throw error;
  }
};
