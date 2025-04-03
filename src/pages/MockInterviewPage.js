import { useEffect, useRef, useState } from "react";
import { FaUserTie, FaLaptopCode } from "react-icons/fa";
import { motion } from "framer-motion";

const MockInterview = () => {
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [chat, setChat] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const chatRef = useRef(null);

  // 15 Questions for Each Category
  const questions = {
    "General HR": [
      "Tell me about yourself.",
      "What are your strengths?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?",
      "Describe a challenging situation at work.",
      "What is your greatest weakness?",
      "Tell me about a time you showed leadership.",
      "How do you handle stress?",
      "Why do you want this job?",
      "What do you know about our company?",
      "What are your salary expectations?",
      "How do you handle criticism?",
      "Tell me about your biggest achievement.",
      "What motivates you?",
      "Do you have any questions for us?"
    ],
    C: [
      "What is a pointer?",
      "Explain dynamic memory allocation.",
      "What is a function pointer?",
      "Difference between malloc() and calloc().",
      "What is the use of sizeof()?",
      "Explain recursion with an example.",
      "What is a structure in C?",
      "How does a linked list work?",
      "What is a stack and queue?",
      "Difference between array and linked list.",
      "What is a static variable?",
      "Explain bitwise operators in C.",
      "What are storage classes in C?",
      "What is a segmentation fault?",
      "How does the C compiler work?"
    ],
    "C++": [
      "What is polymorphism?",
      "Explain inheritance in C++.",
      "What is an abstract class?",
      "What is STL in C++?",
      "What are constructors and destructors?",
      "Difference between struct and class.",
      "What is operator overloading?",
      "Explain virtual functions in C++.",
      "What is function overloading?",
      "What is exception handling in C++?",
      "Explain the concept of namespaces.",
      "What is a friend function?",
      "Difference between delete and free().",
      "What is RAII?",
      "What is a smart pointer in C++?"
    ],
    Java: [
      "What is OOP?",
      "Explain multithreading in Java.",
      "What is a constructor in Java?",
      "Explain method overloading and overriding.",
      "What is the difference between JDK, JRE, and JVM?",
      "What is garbage collection?",
      "Explain the use of final keyword.",
      "What are Java interfaces?",
      "Difference between abstract class and interface.",
      "What is the Collections Framework?",
      "Explain the concept of serialization.",
      "What is Java Reflection?",
      "Difference between HashMap and HashTable.",
      "What is a lambda expression?",
      "What is the difference between checked and unchecked exceptions?"
    ]
  };

  // Keyword bank for evaluation
  const keywordBank = {
    "Tell me about yourself.": ["experience", "skills", "education", "projects"],
    "What are your strengths?": ["communication", "problem-solving", "leadership"],
    "What is a pointer?": ["memory", "address", "variable"],
    "Explain dynamic memory allocation.": ["malloc", "calloc", "free"]
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const startInterview = (selectedCategory) => {
    setCategory(selectedCategory);
    setSubCategory(null);
    setQuestionIndex(0);
    setTotalScore(0);
    setChat([{ role: "AI", text: "Let's start! " + questions[selectedCategory][0] }]);
  };

  const selectSubCategory = (sub) => {
    setSubCategory(sub);
    setQuestionIndex(0);
    setTotalScore(0);
    setChat([{ role: "AI", text: "Let's start! " + questions[sub][0] }]);
  };

  const evaluateAnswer = () => {
    if (!answer.trim()) return;

    const currentQuestion = questions[subCategory || category][questionIndex];
    const keywords = keywordBank[currentQuestion] || [];

    let matchedKeywords = keywords.filter((keyword) => answer.toLowerCase().includes(keyword));
    let score = Math.round((matchedKeywords.length / keywords.length) * 10) || 2; // Minimum score 2/10

    setTotalScore((prev) => prev + score);

    let feedback =
      matchedKeywords.length === keywords.length
        ? "Excellent answer! You covered all important points."
        : `Your answer needs improvement. Try adding these points: ${keywords
            .filter((k) => !matchedKeywords.includes(k))
            .join(", ")}`;

    setChat((prev) => [
      ...prev,
      { role: "User", text: answer },
      { role: "AI", text: `Score: ${score}/10\nFeedback: ${feedback}` }
    ]);

    setAnswer("");

    if (questionIndex + 1 < questions[subCategory || category].length) {
      setQuestionIndex(questionIndex + 1);
      setChat((prev) => [...prev, { role: "AI", text: questions[subCategory || category][questionIndex + 1] }]);
    } else {
      setChat((prev) => [
        ...prev,
        { role: "BOT", text: `Interview Complete! Your total score: ${totalScore + score}/150` }
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-600 text-white text-center py-4 fixed top-0 shadow-md z-10">
        <h1 className="text-xl font-semibold">AI Mock Interview</h1>
      </header>

      <div className="flex flex-col items-center w-full pt-24 p-4">
        {!category ? (
         <div className="flex flex-col items-center justify-center gap-y-4">
         <button
           className="p-6 bg-white shadow-lg rounded-2xl hover:bg-blue-100 w-72 flex flex-col items-center"
           onClick={() => startInterview("General HR")}
         >
           <FaUserTie className="text-4xl text-blue-500 mb-2" />
           <span className="text-lg font-medium">General HR</span>
         </button>
       
         <button
           className="p-6 bg-white shadow-lg rounded-2xl hover:bg-green-100 w-72 flex flex-col items-center"
           onClick={() => setCategory("Technical HR")}
         >
           <FaLaptopCode className="text-4xl text-green-500 mb-2" />
           <span className="text-lg font-medium">Technical HR</span>
         </button>
       </div>
       
        ) : category === "Technical HR" && !subCategory ? (
          <div className="flex flex-col gap-4 mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C")}>C</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C++")}>C++</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("Java")}>Java</button>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col p-4 mt-4">
            <div ref={chatRef} className="h-96 overflow-y-auto p-4 flex flex-col gap-2">{chat.map((msg, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg max-w-[75%] ${msg.role === "AI" ? "self-start bg-blue-500 text-white" : "self-end bg-gray-300 text-black"}`}><strong>{msg.role}:</strong> {msg.text}</motion.div>))}</div>
            <div className="flex items-center gap-2 p-2 border-t">
              <textarea className="flex-1 p-2 border rounded-lg" placeholder="Type your answer..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={evaluateAnswer}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
