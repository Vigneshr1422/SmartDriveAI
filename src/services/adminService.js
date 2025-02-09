import { db } from "../auth/firebase"; // Assuming you're using Firebase Firestore

// Function to generate the admin key and save it to Firestore
export const generateAdminKey = async (newKey) => {
  try {
    await db.collection("admin").doc("key").set({
      generatedKey: newKey, // Save the new generated key
    });
    console.log("Key generated and saved successfully.");
  } catch (error) {
    console.error("Error generating key: ", error);
    throw new Error("Failed to generate key");
  }
};

// Function to fetch the generated key from Firestore
// adminService.js

// Function to fetch the fixed admin key
export const getAdminKey = async () => {
    try {
      // Predefined admin key
      const fixedAdminKey = "love"; // Replace "love" with the desired key
      return fixedAdminKey;
    } catch (error) {
      console.error("Error fetching key: ", error);
      throw new Error("Failed to fetch key");
    }
  };
  
