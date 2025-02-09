const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();

// OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

async function uploadFile(filePath, mimeType) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "Uploaded_File",
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
      },
    });
    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Example usage:
uploadFile("path/to/your/file.pdf", "application/pdf");
