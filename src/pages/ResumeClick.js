import React, { useState } from "react";
import { FaJava, FaLaptopCode,FaCheckCircle,FaExclamationTriangle,FaTimesCircle, FaPython, FaClipboardList, FaBug, FaReact, FaCloud, FaDatabase, FaBrain, FaCode } from "react-icons/fa"; // Importing relevant icons
import axios from "axios";

const ResumeCheck = () => {
  const [atsScore, setAtsScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle domain selection
  const handleDomainSelect = (selectedDomain) => {
    setDomain(selectedDomain);
    setShowUpload(true);
  };

  // Handle resume check action
  const handleResumeCheck = async () => {
    if (!file || !domain) {
      alert("Please select a domain and a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("domain", domain);

    try {
      // Send file to the backend to process and get ATS score
      const response = await axios.post("http://localhost:5000/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set the received ATS score and feedback
      setAtsScore(response.data.score);
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error uploading resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to domain selection
  const handleBack = () => {
    setShowUpload(false);
    setAtsScore(null);
    setFeedback(null);
    setFile(null);
    setDomain(null);
  };

  // Get domain-specific keywords and skills
  const getKeywords = (domain) => {
    switch (domain) {
      case "java":
        return "Java, J2EE, Spring, Hibernate, REST API, MVC, SQL, OOP, JUnit";
      case "full-stack":
        return "HTML, CSS, JavaScript, React, Node.js, MongoDB, Express, REST APIs, Git";
      case "python":
        return "Python, Django, Flask, SQL, API Development, Data Science, Machine Learning";
      case "software-developer":
        return "C++, Java, SQL, Algorithms, Data Structures, OOP, MVC";
      case "qa-testing":
        return "Testing, Automation, Selenium, Java, Python, Regression Testing, Agile";
      case "devops":
        return "CI/CD, Jenkins, Docker, Kubernetes, Terraform, AWS, Azure";
      case "cloud-computing":
        return "AWS, Azure, GCP, Cloud Infrastructure, DevOps, Docker, Kubernetes, Terraform";
      case "database":
        return "SQL, NoSQL, MySQL, MongoDB, Database Design, Query Optimization, Data Modeling";
      case "data-science":
        return "Python, R, Data Analysis, Machine Learning, Deep Learning, TensorFlow, Pandas, Numpy";
      case "backend":
        return "Node.js, Express, MongoDB, REST APIs, SQL, Python, Java";
      default:
        return "Java, J2EE, Python, SQL, React, Node.js";
    }
  };

  const getSkills = (domain) => {
    switch (domain) {
      case "java":
        return "Java, Spring, Hibernate, SQL, JUnit, Problem-solving, OOP, Data Structures";
      case "full-stack":
        return "React, Node.js, JavaScript, HTML, CSS, Git, REST APIs, MongoDB";
      case "python":
        return "Python, Django, Flask, SQL, Data Science, Problem-solving";
      case "software-developer":
        return "Java, SQL, Algorithms, Data Structures, C++, OOP, MVC";
      case "qa-testing":
        return "Selenium, Automation Testing, Python, Regression Testing, Agile";
      case "devops":
        return "Jenkins, Docker, Kubernetes, AWS, Azure, CI/CD";
      case "cloud-computing":
        return "AWS, Azure, Docker, Kubernetes, Cloud Infrastructure, Terraform";
      case "database":
        return "SQL, MongoDB, MySQL, Query Optimization, Data Modeling";
      case "data-science":
        return "Python, Machine Learning, TensorFlow, Pandas, Numpy, Data Analysis";
      case "backend":
        return "Node.js, Express, MongoDB, SQL, Python, REST APIs";
      default:
        return "Java, SQL, React, Python, Data Structures, Algorithms";
    }
  };

  // Suggestions rendering with bullet points and more actionable advice
  const getSuggestions = (score, domain) => {
    let suggestions = "";
    const keywords = getKeywords(domain);
    const skills = getSkills(domain);
  
    if (score >= 80) {
      suggestions = (
        <div className="mt-6 p-6 border-2 border-green-500 rounded-lg bg-gradient-to-r from-green-300 to-green-500 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-4">
            <FaCheckCircle className="text-4xl text-white" />
            <p className="text-xl font-bold text-white">
              Your resume is strong and well-optimized for ATS! To make it even better, consider the following tweaks:
            </p>
          </div>
          <ul className="list-disc pl-6 mt-4 text-white">
            <li><strong>Focus on adding:</strong> {keywords} keywords to your resume.</li>
            <li><strong>Enhance these skills:</strong> {skills} for a more robust profile.</li>
            <li><strong>Consider showcasing:</strong> Your achievements with metrics, like "Improved performance by X%".</li>
          </ul>
        </div>
      );
    } else if (score >= 50) {
      suggestions = (
        <div className="mt-6 p-6 border-2 border-yellow-500 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-4">
            <FaExclamationTriangle className="text-4xl text-white" />
            <p className="text-xl font-bold text-white">
              Your resume is on the right track, but there are areas to improve. Here's what you can do to enhance your resume:
            </p>
          </div>
          <ul className="list-disc pl-6 mt-4 text-white">
            <li><strong>Incorporate these keywords:</strong> {keywords}</li>
            <li><strong>Make sure to include:</strong> {skills} for a stronger impact.</li>
            <li><strong>Highlight achievements:</strong> Use action verbs and measurable results.</li>
          </ul>
        </div>
      );
    } else {
      suggestions = (
        <div className="mt-6 p-6 border-2 border-red-500 rounded-lg bg-gradient-to-r from-red-300 to-red-500 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-4">
            <FaTimesCircle className="text-4xl text-white" />
            <p className="text-xl font-bold text-white">
              Your resume could benefit from some significant changes. Focus on adding more relevant skills and experience. Here’s how you can improve:
            </p>
          </div>
          <ul className="list-disc pl-6 mt-4 text-white">
            <li><strong>Include keywords like:</strong> {keywords}</li>
            <li><strong>Update your skills section with:</strong> {skills}</li>
            <li><strong>Quantify your experience:</strong> For example, “Led a team of X” or “Increased revenue by Y%”.</li>
          </ul>
        </div>
      );
    }
  
    return suggestions;
  };
  

  return (
    <div className="p-10 max-w-lg mx-auto bg-white rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-4">
        {showUpload ? "Upload Resume and Check ATS" : "Select a Domain"}
      </h2>

      {!showUpload ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Domain selection buttons with icons */}
          <button
            onClick={() => handleDomainSelect("java")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaJava className="text-3xl text-blue-500 mb-2" />
            <span>Java</span>
          </button>
          <button
            onClick={() => handleDomainSelect("full-stack")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaLaptopCode className="text-3xl text-green-500 mb-2" />
            <span>Full Stack</span>
          </button>
          <button
            onClick={() => handleDomainSelect("python")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaPython className="text-3xl text-yellow-500 mb-2" />
            <span>Python</span>
          </button>
          <button
            onClick={() => handleDomainSelect("software-developer")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaCode className="text-3xl text-gray-700 mb-2" />
            <span>Software Developer</span>
          </button>
          <button
            onClick={() => handleDomainSelect("qa-testing")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaClipboardList className="text-3xl text-purple-500 mb-2" />
            <span>QA Testing</span>
          </button>
          <button
            onClick={() => handleDomainSelect("devops")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaLaptopCode className="text-3xl text-red-500 mb-2" />
            <span>DevOps</span>
          </button>
          <button
            onClick={() => handleDomainSelect("cloud-computing")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaCloud className="text-3xl text-blue-500 mb-2" />
            <span>Cloud Computing</span>
          </button>
          <button
            onClick={() => handleDomainSelect("database")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaDatabase className="text-3xl text-orange-500 mb-2" />
            <span>Database Management</span>
          </button>
          <button
            onClick={() => handleDomainSelect("data-science")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaBrain className="text-3xl text-green-500 mb-2" />
            <span>Data Science</span>
          </button>
          <button
            onClick={() => handleDomainSelect("backend")}
            className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
          >
            <FaReact className="text-3xl text-teal-500 mb-2" />
            <span>Backend Development</span>
          </button>
        </div>
      ) : (
        <div>
          {/* File upload and ATS check */}
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
            className="mb-4"
          />
          <button
            onClick={handleResumeCheck}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Processing..." : "Check Resume"}
          </button>

          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Back to Domain Selection
          </button>

          {atsScore !== null && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Your ATS Score: {atsScore}%</h3>
              <p>{feedback}</p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Suggestions:</h4>
                {getSuggestions(atsScore, domain)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeCheck;

// import React, { useState } from "react";
// import { FaJava, FaLaptopCode, FaPython, FaClipboardList, FaBug, FaReact, FaCloud, FaDatabase, FaBrain, FaCode } from "react-icons/fa"; // Importing relevant icons
// import axios from "axios";

// const ResumeCheck = () => {
//   const [atsScore, setAtsScore] = useState(null);
//   const [feedback, setFeedback] = useState(null);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [domain, setDomain] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);

//   // Handle file input change
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle domain selection
//   const handleDomainSelect = (selectedDomain) => {
//     setDomain(selectedDomain);
//     setShowUpload(true);
//   };

//   // Handle resume check action
//   const handleResumeCheck = async () => {
//     if (!file || !domain) {
//       alert("Please select a domain and a file.");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("resume", file);
//     formData.append("domain", domain);

//     try {
//       // Send file to the backend to process and get ATS score
//       const response = await axios.post("http://localhost:5000/upload-resume", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Set the received ATS score and feedback
//       setAtsScore(response.data.score);
//       setFeedback(response.data.feedback);
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       alert("Error uploading resume. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle back to domain selection
//   const handleBack = () => {
//     setShowUpload(false);
//     setAtsScore(null);
//     setFeedback(null);
//     setFile(null);
//     setDomain(null);
//   };

//   // Get domain-specific keywords and skills
//   const getKeywords = (domain) => {
//     switch (domain) {
//       case "java":
//         return "Java, J2EE, Spring, Hibernate, REST API, MVC, SQL, OOP, JUnit";
//       case "full-stack":
//         return "HTML, CSS, JavaScript, React, Node.js, MongoDB, Express, REST APIs, Git";
//       case "python":
//         return "Python, Django, Flask, SQL, API Development, Data Science, Machine Learning";
//       case "software-developer":
//         return "C++, Java, SQL, Algorithms, Data Structures, OOP, MVC";
//       case "qa-testing":
//         return "Testing, Automation, Selenium, Java, Python, Regression Testing, Agile";
//       case "devops":
//         return "CI/CD, Jenkins, Docker, Kubernetes, Terraform, AWS, Azure";
//       case "cloud-computing":
//         return "AWS, Azure, GCP, Cloud Infrastructure, DevOps, Docker, Kubernetes, Terraform";
//       case "database":
//         return "SQL, NoSQL, MySQL, MongoDB, Database Design, Query Optimization, Data Modeling";
//       case "data-science":
//         return "Python, R, Data Analysis, Machine Learning, Deep Learning, TensorFlow, Pandas, Numpy";
//       case "backend":
//         return "Node.js, Express, MongoDB, REST APIs, SQL, Python, Java";
//       default:
//         return "Java, J2EE, Python, SQL, React, Node.js";
//     }
//   };

//   const getSkills = (domain) => {
//     switch (domain) {
//       case "java":
//         return "Java, Spring, Hibernate, SQL, JUnit, Problem-solving, OOP, Data Structures";
//       case "full-stack":
//         return "React, Node.js, JavaScript, HTML, CSS, Git, REST APIs, MongoDB";
//       case "python":
//         return "Python, Django, Flask, SQL, Data Science, Problem-solving";
//       case "software-developer":
//         return "Java, SQL, Algorithms, Data Structures, C++, OOP, MVC";
//       case "qa-testing":
//         return "Selenium, Automation Testing, Python, Regression Testing, Agile";
//       case "devops":
//         return "Jenkins, Docker, Kubernetes, AWS, Azure, CI/CD";
//       case "cloud-computing":
//         return "AWS, Azure, Docker, Kubernetes, Cloud Infrastructure, Terraform";
//       case "database":
//         return "SQL, MongoDB, MySQL, Query Optimization, Data Modeling";
//       case "data-science":
//         return "Python, Machine Learning, TensorFlow, Pandas, Numpy, Data Analysis";
//       case "backend":
//         return "Node.js, Express, MongoDB, SQL, Python, REST APIs";
//       default:
//         return "Java, SQL, React, Python, Data Structures, Algorithms";
//     }
//   };

//   // Suggestions rendering with bullet points and more actionable advice
//   const getSuggestions = (score, domain) => {
//     let suggestions = "";
//     const keywords = getKeywords(domain);
//     const skills = getSkills(domain);

//     if (score >= 80) {
//       suggestions = (
//         <div>
//           <p>Your resume is strong and well-optimized for ATS! To make it even better, consider the following tweaks:</p>
//           <ul className="list-disc pl-6">
//             <li><strong>Focus on adding:</strong> {keywords} keywords to your resume.</li>
//             <li><strong>Enhance these skills:</strong> {skills} for a more robust profile.</li>
//             <li><strong>Consider showcasing:</strong> Your achievements with metrics, like "Improved performance by X%".</li>
//           </ul>
//         </div>
//       );
//     } else if (score >= 50) {
//       suggestions = (
//         <div>
//           <p>Your resume is on the right track, but there are areas to improve. Here's what you can do to enhance your resume:</p>
//           <ul className="list-disc pl-6">
//             <li><strong>Incorporate these keywords:</strong> {keywords}</li>
//             <li><strong>Make sure to include:</strong> {skills} for a stronger impact.</li>
//             <li><strong>Highlight achievements:</strong> Use action verbs and measurable results.</li>
//           </ul>
//         </div>
//       );
//     } else {
//       suggestions = (
//         <div>
//           <p>Your resume could benefit from some significant changes. Focus on adding more relevant skills and experience. Here’s how you can improve:</p>
//           <ul className="list-disc pl-6">
//             <li><strong>Include keywords like:</strong> {keywords}</li>
//             <li><strong>Update your skills section with:</strong> {skills}</li>
//             <li><strong>Quantify your experience:</strong> For example, “Led a team of X” or “Increased revenue by Y%”.</li>
//           </ul>
//         </div>
//       );
//     }

//     return suggestions;
//   };

//   return (
// <div className="p-10 max-w-lg mx-auto bg-white rounded shadow mt-20">
// <h2 className="text-2xl font-bold mb-4">
//         {showUpload ? "Upload Resume and Check ATS" : "Select a Domain"}
//       </h2>

//       {!showUpload ? (
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           {/* Domain selection buttons with icons */}
//           <button
//             onClick={() => handleDomainSelect("java")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaJava className="text-3xl text-blue-500 mb-2" />
//             <span>Java</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("full-stack")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaLaptopCode className="text-3xl text-green-500 mb-2" />
//             <span>Full Stack</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("python")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaPython className="text-3xl text-yellow-500 mb-2" />
//             <span>Python</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("software-developer")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaCode className="text-3xl text-gray-700 mb-2" />
//             <span>Software Developer</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("qa-testing")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaClipboardList className="text-3xl text-purple-500 mb-2" />
//             <span>QA Testing</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("devops")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaLaptopCode className="text-3xl text-red-500 mb-2" />
//             <span>DevOps</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("cloud-computing")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaCloud className="text-3xl text-blue-500 mb-2" />
//             <span>Cloud Computing</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("database")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaDatabase className="text-3xl text-orange-500 mb-2" />
//             <span>Database Management</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("data-science")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaBrain className="text-3xl text-green-500 mb-2" />
//             <span>Data Science</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("backend")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaReact className="text-3xl text-teal-500 mb-2" />
//             <span>Backend Development</span>
//           </button>
//         </div>
//       ) : (
//         <div>
//           {/* File upload and ATS check */}
//           <input
//             type="file"
//             accept=".jpg, .jpeg, .png"
//             onChange={handleFileChange}
//             className="mb-4"
//           />
//           <button
//             onClick={handleResumeCheck}
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {loading ? "Processing..." : "Check Resume"}
//           </button>

//           <button
//             onClick={handleBack}
//             className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
//           >
//             Back to Domain Selection
//           </button>

//           {atsScore !== null && (
//             <div className="mt-4">
//               <h3 className="text-xl font-semibold">Your ATS Score: {atsScore}%</h3>
//               <p>{feedback}</p>
//               <div className="mt-4">
//                 <h4 className="font-semibold">Suggestions:</h4>
//                 {getSuggestions(atsScore, domain)}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeCheck;

// import React, { useState } from "react";
// import axios from "axios";
// import { FaJava, FaReact, FaPython, FaClipboardList, FaLaptopCode, FaBug } from "react-icons/fa"; // Importing relevant icons

// const ResumeCheck = () => {
//   const [atsScore, setAtsScore] = useState(null);
//   const [feedback, setFeedback] = useState(null);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [domain, setDomain] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);

//   // Handle file input change
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle domain selection
//   const handleDomainSelect = (selectedDomain) => {
//     setDomain(selectedDomain);
//     setShowUpload(true);
//   };

//   // Handle resume check action
//   const handleResumeCheck = async () => {
//     if (!file || !domain) {
//       alert("Please select a domain and a file.");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("resume", file);
//     formData.append("domain", domain);

//     try {
//       // Send file to the backend to process and get ATS score
//       const response = await axios.post("http://localhost:5000/upload-resume", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Set the received ATS score and feedback
//       setAtsScore(response.data.score);
//       setFeedback(response.data.feedback);
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       alert("Error uploading resume. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle back to domain selection
//   const handleBack = () => {
//     setShowUpload(false);
//     setAtsScore(null);
//     setFeedback(null);
//     setFile(null);
//     setDomain(null);
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">
//         {showUpload ? "Upload Resume and Check ATS" : "Select a Domain"}
//       </h2>

//       {!showUpload ? (
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           {/* Domain selection buttons with icons */}
//           <button
//             onClick={() => handleDomainSelect("java")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaJava className="text-3xl text-blue-500 mb-2" />
//             <span>Java</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("full-stack")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaLaptopCode className="text-3xl text-green-500 mb-2" />
//             <span>Full Stack</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("python")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaPython className="text-3xl text-yellow-500 mb-2" />
//             <span>Python</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("software-developer")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaClipboardList className="text-3xl text-indigo-500 mb-2" />
//             <span>Software Developer</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("qa-testing")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaBug className="text-3xl text-red-500 mb-2" />
//             <span>QA Testing</span>
//           </button>
//           <button
//             onClick={() => handleDomainSelect("devops")}
//             className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100"
//           >
//             <FaReact className="text-3xl text-purple-500 mb-2" />
//             <span>DevOps</span>
//           </button>
//         </div>
//       ) : (
//         <div>
//           {/* File upload and ATS check */}
//           <input
//             type="file"
//             accept=".jpg, .jpeg, .png"
//             onChange={handleFileChange}
//             className="mb-4"
//           />
//           <button
//             onClick={handleResumeCheck}
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {loading ? "Processing..." : "Check Resume"}
//           </button>

//           <button
//             onClick={handleBack}
//             className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
//           >
//             Back to Domain Selection
//           </button>

//           {atsScore !== null && (
//             <div className="mt-4">
//               <h3 className="text-xl font-semibold">Your ATS Score: {atsScore}%</h3>
//               <p>{feedback}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeCheck;
