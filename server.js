require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI API Key (Stored in .env)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Configure Multer for file upload (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============================
// 🚀 AI MOCK INTERVIEW FEATURE
// ============================

// Sample model answers for answer evaluation
const modelAnswers = {
  "What is polymorphism in Java?":
    "Polymorphism in Java allows objects of different classes to be treated as objects of a common superclass. It enables method overriding and method overloading.",
  "What are the four pillars of OOP?":
    "The four pillars of Object-Oriented Programming (OOP) are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
};

// Endpoint to fetch AI-generated interview questions
app.post("/api/get-questions", async (req, res) => {
  const { type, language } = req.body;
  try {
    const prompt =
      type === "Technical"
        ? `Provide 15 technical interview questions for a ${language} developer.`
        : `Provide 15 common HR interview questions.`;

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );

    const questions = response.data.choices[0].message.content
      .trim()
      .split("\n");
    res.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Endpoint to evaluate interview answers
app.post("/api/evaluate-answer", async (req, res) => {
  const { question, answer, type } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required." });
  }

  // Get model answer for comparison
  const modelAnswer = modelAnswers[question] || "";

  try {
    const prompt = `Evaluate the given answer based on correctness, keyword matching, clarity, grammar, and relevance:\n\nQuestion: ${question}\nModel Answer: ${modelAnswer}\nUser Answer: ${answer}\n\nProvide feedback, highlight missing points, and assign a score out of 10.`;

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );

    const evaluation = response.data.choices[0].message.content.trim();
    res.json({ evaluation });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({ error: "Failed to evaluate answer." });
  }
});

// ============================
// 🎯 RESUME ATS SCORING FEATURE
// ============================

// Endpoint to handle resume upload
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Check for valid file format
    if (!["application/pdf", "image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Please upload a valid PDF or JPEG/PNG file." });
    }

    // Extract text from the PDF if uploaded
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text; // Extracted text from PDF
    } else {
      text = "OCR processing not implemented"; // Placeholder
    }

    // Calculate ATS score and feedback
    const atsScore = calculateATSScore(text, req.body.domain);
    const feedback = generateFeedback(atsScore);

    // Send response
    res.json({ score: atsScore, feedback });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ error: "Error processing resume. Please try again." });
  }
});

// Function to calculate ATS score
const calculateATSScore = (text, domain) => {
  let keywords = [];
  switch (domain) {
    case "java":
      keywords = ["Java", "Spring", "Hibernate", "J2EE"];
      break;
    case "full-stack":
      keywords = ["JavaScript", "React", "Node.js", "MongoDB", "Express"];
      break;
    case "python":
      keywords = ["Python", "Django", "Flask", "Data Science", "Machine Learning"];
      break;
    case "software-developer":
      keywords = ["Software Development", "C#", "Java", "Agile", "Scrum"];
      break;
    case "qa-testing":
      keywords = ["QA", "Testing", "Automation", "Selenium"];
      break;
    case "devops":
      keywords = ["DevOps", "Docker", "Kubernetes", "CI/CD", "AWS"];
      break;
    case "cloud-computing":
      keywords = ["AWS", "Azure", "Cloud", "GCP"];
      break;
    case "database-management":
      keywords = ["SQL", "NoSQL", "MySQL", "MongoDB", "PostgreSQL"];
      break;
    case "data-science":
      keywords = ["Data Science", "Python", "Pandas", "Machine Learning", "Deep Learning"];
      break;
    case "backend":
      keywords = ["Node.js", "Express", "Python", "API Development", "Microservices"];
      break;
    default:
      keywords = ["JavaScript", "Java", "Python", "SQL"];
  }

  let score = 0;
  let totalKeywords = keywords.length;

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    if (regex.test(text)) {
      score++;
    }
  });

  return Math.round((score / totalKeywords) * 100);
};

// Function to generate feedback based on ATS score
const generateFeedback = (score) => {
  if (score >= 80) {
    return "Great job! Your resume is well-optimized for ATS.";
  } else if (score >= 50) {
    return "Your resume is good but could use some improvements.";
  } else {
    return "Consider adding more relevant keywords and skills to improve your ATS score.";
  }
};

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse"); // Library to parse PDFs
// const cors = require("cors");
// const axios = require("axios");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // OpenAI API Key (Stored in .env)
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Configure Multer for file upload (in-memory storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ============================
// // 🚀 AI MOCK INTERVIEW FEATURE
// // ============================

// // Endpoint to fetch AI-generated questions
// app.post("/api/get-questions", async (req, res) => {
//   const { type, language } = req.body;
//   try {
//     const prompt =
//       type === "Technical"
//         ? `Provide 15 technical interview questions for a ${language} developer.`
//         : `Provide 15 common HR interview questions.`;

//     const response = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "text-davinci-003",
//         prompt: prompt,
//         max_tokens: 300,
//         temperature: 0.7,
//       },
//       {
//         headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
//       }
//     );

//     const questions = response.data.choices[0].text.trim().split("\n");
//     res.json({ questions });
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(500).json({ error: "Failed to fetch questions" });
//   }
// });

// // Endpoint to evaluate interview answers
// app.post("/api/evaluate-answer", async (req, res) => {
//   const { question, answer, type } = req.body;
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "text-davinci-003",
//         prompt: `Evaluate the following answer for a ${type} interview:\n\nQuestion: ${question}\nAnswer: ${answer}\n\nProvide feedback and a score out of 10.`,
//         max_tokens: 150,
//         temperature: 0.7,
//       },
//       {
//         headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
//       }
//     );

//     const evaluation = response.data.choices[0].text.trim();
//     res.json({ evaluation });
//   } catch (error) {
//     console.error("Error evaluating answer:", error);
//     res.status(500).json({ error: "Failed to evaluate answer" });
//   }
// });

// // ============================
// // 🎯 RESUME ATS SCORING FEATURE
// // ============================

// // Endpoint to handle resume upload
// app.post("/upload-resume", upload.single("resume"), async (req, res) => {
//   try {
//     // Check if the file is uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // Check if the uploaded file is a valid format (PDF or image)
//     if (!["application/pdf", "image/jpeg", "image/png"].includes(req.file.mimetype)) {
//       return res.status(400).json({ error: "Please upload a valid PDF or JPEG/PNG file." });
//     }

//     // Extract text from the PDF if uploaded
//     let text = "";
//     if (req.file.mimetype === "application/pdf") {
//       const pdfData = await pdfParse(req.file.buffer);
//       text = pdfData.text; // Extracted text from PDF
//     } else {
//       text = "OCR processing not implemented"; // Placeholder
//     }

//     // Calculate ATS score and feedback based on domain
//     const atsScore = calculateATSScore(text, req.body.domain);
//     const feedback = generateFeedback(atsScore);

//     // Send response with ATS score and feedback
//     res.json({ score: atsScore, feedback });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     res.status(500).json({ error: "Error processing resume. Please try again." });
//   }
// });

// // Function to calculate ATS score based on keywords
// const calculateATSScore = (text, domain) => {
//   let keywords = [];
//   switch (domain) {
//     case "java":
//       keywords = ["Java", "Spring", "Hibernate", "J2EE"];
//       break;
//     case "full-stack":
//       keywords = ["JavaScript", "React", "Node.js", "MongoDB", "Express"];
//       break;
//     case "python":
//       keywords = ["Python", "Django", "Flask", "Data Science", "Machine Learning"];
//       break;
//     case "software-developer":
//       keywords = ["Software Development", "C#", "Java", "Agile", "Scrum"];
//       break;
//     case "qa-testing":
//       keywords = ["QA", "Testing", "Automation", "Selenium"];
//       break;
//     case "devops":
//       keywords = ["DevOps", "Docker", "Kubernetes", "CI/CD", "AWS"];
//       break;
//     case "cloud-computing":
//       keywords = ["AWS", "Azure", "Cloud", "GCP"];
//       break;
//     case "database-management":
//       keywords = ["SQL", "NoSQL", "MySQL", "MongoDB", "PostgreSQL"];
//       break;
//     case "data-science":
//       keywords = ["Data Science", "Python", "Pandas", "Machine Learning", "Deep Learning"];
//       break;
//     case "backend":
//       keywords = ["Node.js", "Express", "Python", "API Development", "Microservices"];
//       break;
//     default:
//       keywords = ["JavaScript", "Java", "Python", "SQL"];
//   }

//   let score = 0;
//   let totalKeywords = keywords.length;

//   keywords.forEach(keyword => {
//     const regex = new RegExp(`\\b${keyword}\\b`, "gi");
//     if (regex.test(text)) {
//       score++;
//     }
//   });

//   return Math.round((score / totalKeywords) * 100);
// };

// // Function to generate feedback based on ATS score
// const generateFeedback = (score) => {
//   if (score >= 80) {
//     return "Great job! Your resume is well-optimized for ATS.";
//   } else if (score >= 50) {
//     return "Your resume is good but could use some improvements.";
//   } else {
//     return "Consider adding more relevant keywords and skills to improve your ATS score.";
//   }
// };

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// const express = require("express");
// const multer = require("multer");
// const pdfParse = require("pdf-parse"); // Library to parse PDFs
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Configure Multer for file upload (in-memory storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Endpoint to handle resume upload
// app.post("/upload-resume", upload.single("resume"), async (req, res) => {
//   try {
//     // Check if the file is uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // Check if the uploaded file is a valid format (PDF or image)
//     if (!["application/pdf", "image/jpeg", "image/png"].includes(req.file.mimetype)) {
//       return res.status(400).json({ error: "Please upload a valid PDF or JPEG/PNG file." });
//     }

//     // Extract text from the PDF if uploaded
//     let text = "";
//     if (req.file.mimetype === "application/pdf") {
//       const pdfData = await pdfParse(req.file.buffer);
//       text = pdfData.text; // Extracted text from PDF
//     } else {
//       // For image formats, you can add additional logic to parse text from the image using an OCR library
//       text = "OCR processing not implemented"; // Placeholder
//     }

//     // Calculate ATS score and feedback based on domain
//     const atsScore = calculateATSScore(text, req.body.domain);
//     const feedback = generateFeedback(atsScore);

//     // Send response with ATS score and feedback
//     res.json({ score: atsScore, feedback });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     res.status(500).json({ error: "Error processing resume. Please try again." });
//   }
// });

// // Function to calculate ATS score based on keywords
// // Continue the calculateATSScore function
// const calculateATSScore = (text, domain) => {
//   let keywords = [];
//   // Domain-specific keywords
//   switch (domain) {
//     case "java":
//       keywords = ["Java", "Spring", "Hibernate", "J2EE"];
//       break;
//     case "full-stack":
//       keywords = ["JavaScript", "React", "Node.js", "MongoDB", "Express"];
//       break;
//     case "python":
//       keywords = ["Python", "Django", "Flask", "Data Science", "Machine Learning"];
//       break;
//     case "software-developer":
//       keywords = ["Software Development", "C#", "Java", "Agile", "Scrum"];
//       break;
//     case "qa-testing":
//       keywords = ["QA", "Testing", "Automation", "Selenium"];
//       break;
//     case "devops":
//       keywords = ["DevOps", "Docker", "Kubernetes", "CI/CD", "AWS"];
//       break;
//     case "cloud-computing":
//       keywords = ["AWS", "Azure", "Cloud", "GCP"];
//       break;
//     case "database-management":
//       keywords = ["SQL", "NoSQL", "MySQL", "MongoDB", "PostgreSQL"];
//       break;
//     case "data-science":
//       keywords = ["Data Science", "Python", "Pandas", "Machine Learning", "Deep Learning"];
//       break;
//     case "backend":
//       keywords = ["Node.js", "Express", "Python", "API Development", "Microservices"];
//       break;
//     default:
//       keywords = ["JavaScript", "Java", "Python", "SQL"];
//   }

//   let score = 0;
//   let totalKeywords = keywords.length;

//   // Check how many keywords are present in the resume text
//   keywords.forEach(keyword => {
//     const regex = new RegExp(`\\b${keyword}\\b`, "gi");
//     if (regex.test(text)) {
//       score++;
//     }
//   });

//   // Calculate percentage score
//   return Math.round((score / totalKeywords) * 100);
// };

// // Function to generate feedback based on ATS score
// const generateFeedback = (score) => {
//   if (score >= 80) {
//     return "Great job! Your resume is well-optimized for ATS.";
//   } else if (score >= 50) {
//     return "Your resume is good but could use some improvements.";
//   } else {
//     return "Consider adding more relevant keywords and skills to improve your ATS score.";
//   }
// };


// // Function to generate feedback based on score
// // const generateFeedback = (score) => {
// //   if (score > 80) return "Excellent resume! Well-optimized for ATS.";
// //   if (score > 50) return "Good resume, but consider adding more keywords.";
// //   return "Your resume needs improvement. Include relevant skills and experiences.";
// // };

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
