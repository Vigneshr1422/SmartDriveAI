import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc, 
  deleteDoc 
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // Import getFunctions for Firebase Functions


// const firebaseConfig = {
//   apiKey: "AIzaSyADTANd20EZ75eu35wRDu5clSCCWW9tGNo",
//   authDomain: "alternative-105fc.firebaseapp.com",
//   projectId: "alternative-105fc",
//   storageBucket: "alternative-105fc.firebasestorage.app",
//   messagingSenderId: "167716830330",
//   appId: "1:167716830330:web:512951912a8882a6e3cfc3"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBVdeopAqTd7QwsrlSku76PVrZeTOR_JT4",
  authDomain: "smartdriveai-122024.firebaseapp.com",
  projectId: "smartdriveai-122024",
  storageBucket: "smartdriveai-122024.firebasestorage.app",
  messagingSenderId: "951980259424",
  appId: "1:951980259424:web:ef9e3a1f1717f0b42f2b05"
};
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Initialize Firebase Functions

// Export Firebase services and methods
export { 
  auth, 
  db, 
  storage, 
  functions, // Export Firebase Functions
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  ref, 
  uploadBytes 
};
/*

this is old 
// const firebaseConfig = {
//   apiKey: "AIzaSyAWonbE581seJGJLZmx6YWNnCchrDnDNb4",
//   authDomain: "projectwo-819a1.firebaseapp.com",
//   projectId: "projectwo-819a1",
//   storageBucket: "projectwo-819a1.appspot.com",
//   messagingSenderId: "559813619723",
//   appId: "1:559813619723:web:09ed065e43e6bb1776d70e",
// };
*/