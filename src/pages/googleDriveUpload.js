import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// OAuth2 Credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

// Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

/**
 * Upload file to Google Drive
 * @param {string} filePath - Local file path
 * @param {string} mimeType - File MIME type (e.g., 'image/jpeg', 'application/pdf')
 * @returns {Promise<Object>} - Uploaded file metadata
 */
export async function uploadToGoogleDrive(filePath, mimeType) {
    try {
        const fileName = path.basename(filePath);
        const folderId = 'YOUR_GOOGLE_DRIVE_FOLDER_ID'; // Change this to your folder ID

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });

        console.log(`File uploaded successfully: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}
