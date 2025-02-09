/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer with your email credentials.
 * Replace 'your-email@gmail.com' and 'your-email-password' with your actual
 * email credentials. It's recommended to use Firebase Config for storing
 * credentials securely.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "vigneshas1422@gmail.com", // Replace with
    // Firebase Config for production
    pass: process.env.EMAIL_PASS || "ryeb kyai fjeb mint", // Replace with
    // Firebase Config for production
  },
});

/**
 * Cloud Function to send emails to a list of students.
 */
exports.sendEmails = onRequest(async (req, res) => {
  logger.info("sendEmails function triggered", {structuredData: true});

  const {emails, message} = req.body; // Expecting emails (array) and
  // message (string) in the request body

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    res.status(400).send(
     "Invalid request: 'emails' must be a non-empty array.."
    );
    return;
  }

  if (!message || typeof message !== "string") {
    res.status(400).send("Invalid request: 'message' must be a string.");
    return;
  }

  try {
    // Send an email to each recipient in the array
    for (const email of emails) {
      await transporter.sendMail({
        from: `"Admin"<${process.env.EMAIL_USER || "vigneshas1422@gmail.com"}>`,
        to: email,
        subject: "Notification from Admin",
        text: message,
      });
      logger.info(`Email sent to ${email}`);
    }

    res.status(200).send("Emails sent successfully!");
  } catch (error) {
    logger.error("Error sending emails", error);
    res.status(500).send("Failed to send emails.");
  }
});
