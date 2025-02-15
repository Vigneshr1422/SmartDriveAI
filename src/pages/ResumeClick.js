

import React, { useState } from "react";
import { FaJava, FaLaptopCode, FaPython, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { useSpring, animated } from '@react-spring/web'; // Corrected import for react-spring

const ResumeCheck = () => {
  const [atsScore, setAtsScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // Spring animation for progress bar
  const props = useSpring({ width: atsScore ? `${atsScore}%` : "0%", from: { width: "0%" } });

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle domain selection
  const handleDomainSelect = (selectedDomain) => {
    setDomain(selectedDomain);
    setShowUpload(true);
  };

  // Mock function to calculate ATS score and feedback
  const getMockAtsFeedback = (file, domain) => {
    let score = Math.floor(Math.random() * 100); // Random score for demo

    const suggestions = {
      "java": "Add more Java-related keywords like Spring, Hibernate.",
      "python": "Consider adding data science or machine learning-related keywords.",
      "full-stack": "Focus on frontend and backend technologies like React, Node.js, MongoDB."
    };

    return {
      score,
      feedback: suggestions[domain] || "Include more relevant keywords based on your domain."
    };
  };

  // Handle resume check action
  const handleResumeCheck = () => {
    if (!file || !domain) {
      alert("Please select a domain and a file.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const { score, feedback } = getMockAtsFeedback(file, domain);
      setAtsScore(score);
      setFeedback(feedback);
      setLoading(false);
    }, 2000);
  };

  // Handle back to domain selection
  const handleBack = () => {
    setShowUpload(false);
    setAtsScore(null);
    setFeedback(null);
    setFile(null);
    setDomain(null);
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-white rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-4">
        {showUpload ? "Upload Resume and Check ATS" : "Select a Domain"}
      </h2>

      {!showUpload ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button onClick={() => handleDomainSelect("java")} className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100">
            <FaJava className="text-3xl text-blue-500 mb-2" />
            <span>Java</span>
          </button>
          <button onClick={() => handleDomainSelect("full-stack")} className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100">
            <FaLaptopCode className="text-3xl text-green-500 mb-2" />
            <span>Full Stack</span>
          </button>
          <button onClick={() => handleDomainSelect("python")} className="icon-button flex flex-col items-center text-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100">
            <FaPython className="text-3xl text-yellow-500 mb-2" />
            <span>Python</span>
          </button>
        </div>
      ) : (
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleResumeCheck} className="mt-4 p-2 bg-blue-500 text-white rounded" disabled={loading}>
            {loading ? "Processing..." : "Check ATS"}
          </button>
          <button onClick={handleBack} className="mt-4 p-2 bg-gray-500 text-white rounded">
            Back to Domain Selection
          </button>
        </div>
      )}

      {atsScore !== null && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">ATS Score: {atsScore}</h3>
          <div className="relative w-full h-4 bg-gray-200 rounded">
            <animated.div style={props} className="h-4 bg-blue-500 rounded"></animated.div>
          </div>

          <div className="mt-4">
            {atsScore >= 80 ? (
              <div className="p-4 bg-green-200 text-green-800 rounded">
                <FaCheckCircle /> Strong resume! {feedback}
              </div>
            ) : atsScore >= 50 ? (
              <div className="p-4 bg-yellow-200 text-yellow-800 rounded">
                <FaExclamationTriangle /> Moderate resume. {feedback}
              </div>
            ) : (
              <div className="p-4 bg-red-200 text-red-800 rounded">
                <FaTimesCircle /> Weak resume. {feedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeCheck;

