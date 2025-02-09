// // //const OPENAI_API_KEY = "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"; 
// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const questions = {
//   "General HR": [
//     "Tell me about yourself.",
//     "Why should we hire you?",
//     "What are your strengths and weaknesses?",
//   ],
//   C: [
//     "What is a pointer in C?",
//     "Explain memory allocation in C.",
//   ],
//   "C++": [
//     "What is polymorphism in C++?",
//     "Explain constructors and destructors in C++.",
//   ],
//   Java: [
//     "What are Java's advantages?",
//     "Explain multithreading in Java.",
//   ],
// };

// const MockInterview = () => {
//   const [category, setCategory] = useState(null);
//   const [subCategory, setSubCategory] = useState(null);
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [chat, setChat] = useState([]);

//   const startInterview = (selectedCategory) => {
//     setCategory(selectedCategory);
//     setSubCategory(null);
//     setQuestionIndex(0);
//     setChat([{ role: "AI", text: "Let's start! " + questions[selectedCategory][0] }]);
//   };

//   const selectSubCategory = (sub) => {
//     setSubCategory(sub);
//     setQuestionIndex(0);
//     setChat([{ role: "AI", text: "Let's start! " + questions[sub][0] }]);
//   };

//   const evaluateAnswer = () => {
//     if (!answer.trim()) return;
    
//     const correctAnswerPattern = {
//       Java: ["platform independence", "memory management", "multithreading"],
//       C: ["pointers", "memory allocation"],
//       "C++": ["polymorphism", "constructors", "destructors"],
//     };
    
//     let score = Math.floor(Math.random() * 6) + 5; 
//     let feedback = "Good attempt! Try to add more details.";
    
//     if (subCategory && correctAnswerPattern[subCategory]) {
//       let missingPoints = correctAnswerPattern[subCategory].filter(
//         (point) => !answer.toLowerCase().includes(point)
//       );
      
//       if (missingPoints.length > 0) {
//         feedback = `You missed key points: ${missingPoints.join(", ")}. Try to include these for a stronger answer.`;
//         score -= missingPoints.length;
//       }
//     }
    
//     setChat((prev) => [
//       ...prev,
//       { role: "User", text: answer },
//       { role: "AI", text: `Score: ${score}/10\nFeedback: ${feedback}` },
//     ]);
//     setAnswer("");
    
//     if (questionIndex + 1 < questions[subCategory || category].length) {
//       setQuestionIndex(questionIndex + 1);
//       setChat((prev) => [...prev, { role: "AI", text: questions[subCategory || category][questionIndex + 1] }]);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
//       {!category ? (
//         <div className="flex flex-col gap-4">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => startInterview("General HR")}>General HR</button>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => setCategory("Technical HR")}>
//             Technical HR
//           </button>
//         </div>
//       ) : category === "Technical HR" && !subCategory ? (
//         <div className="flex flex-col gap-4 mt-4">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C")}>C</button>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C++")}>C++</button>
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("Java")}>Java</button>
//         </div>
//       ) : (
//         <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col p-4">
//           <div className="h-96 overflow-y-auto p-4 flex flex-col gap-2">
//             {chat.map((msg, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`p-3 rounded-lg max-w-[75%] ${msg.role === "AI" ? "self-start bg-blue-500 text-white" : "self-end bg-gray-300 text-black"}`}
//               >
//                 <strong>{msg.role}:</strong> {msg.text}
//               </motion.div>
//             ))}
//           </div>
//           <div className="flex items-center gap-2 p-2 border-t">
//             <textarea
//               className="flex-1 p-2 border rounded-lg"
//               placeholder="Type your answer..."
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//             />
//             <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={evaluateAnswer}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MockInterview;


// // //const OPENAI_API_KEY = "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"; 
import { FaUserTie, FaLaptopCode } from "react-icons/fa"; // Import icons

import React, { useState } from "react";
import { motion } from "framer-motion";

const questions = {
  "General HR": [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in five years?",
    "Why do you want to work for our company?",
    "What do you know about our company?",
    "What motivates you?",
    "Describe a difficult work situation and how you handled it.",
    "What is your greatest professional achievement?",
    "How do you handle stress and pressure?",
    "How do you prioritize your tasks?",
    "Tell me about a time you showed leadership.",
    "Tell me about a time you worked in a team.",
    "What are your salary expectations?",
    "Do you prefer working independently or in a team?",
    "How do you handle constructive criticism?",
    "What is your greatest weakness, and how are you improving it?",
    "Tell me about a time you failed and what you learned from it.",
    "What do you do when you disagree with a coworker?",
    "Tell me about a time you went above and beyond at work.",
    "How do you handle tight deadlines?",
    "Describe your ideal work environment.",
    "What qualities do you think make a good leader?",
    "What do you do if you make a mistake at work?",
    "How do you handle conflict with a team member?",
    "What do you like to do outside of work?",
    "How do you stay up to date with industry trends?",
    "What would your previous manager say about you?",
    "If you were given a task you’ve never done before, how would you approach it?",
    "Tell me about a time you had to adapt to change quickly.",
    "What do you think is the most important workplace skill?",
    "What do you do if you receive unclear instructions?",
    "What is your work style?",
    "How do you handle multiple projects at the same time?",
    "What is your biggest professional challenge so far?",
    "What are your career goals?",
    "How do you stay motivated during repetitive tasks?",
    "Tell me about a time you disagreed with a manager.",
    "How do you handle feedback that you disagree with?",
    "Do you have any questions for us?"
  ],

  "C": [
    "What is a pointer in C?",
    "Explain memory allocation in C.",
    "What are storage classes in C?",
    "Differentiate between malloc() and calloc().",
    "What is a structure in C?",
    "How does a union differ from a structure?",
    "What is the difference between a stack and a queue?",
    "What is recursion in C?",
    "Explain the use of static variables in C.",
    "What is the difference between an array and a linked list?",
    "What is the use of the `sizeof` operator?",
    "Explain the concept of function pointers.",
    "How does pointer arithmetic work?",
    "What is the purpose of the `volatile` keyword?",
    "What is a segmentation fault in C?",
    "What are the differences between C and C++?",
    "Explain command-line arguments in C.",
    "What is a circular linked list?",
    "How does `strcpy` work internally?",
    "What is meant by memory leak?",
    "What is the difference between `const char *p`, `char *const p`, and `const char *const p`?",
    "Explain the importance of the `typedef` keyword.",
    "What is a dangling pointer?",
    "How can you prevent memory leaks in C?",
    "What is the role of header files in C?",
    "How does bitwise shifting work?",
    "What is an infinite loop? Give an example.",
    "Explain different ways to reverse a string in C.",
    "How does `strcmp` function work?",
    "What are the different types of sorting algorithms?",
    "How can you swap two numbers without using a third variable?",
    "What is the difference between pass by value and pass by reference?",
    "What are command-line arguments?",
    "Explain the difference between `fopen()` and `open()` functions.",
    "What is a macro in C?",
    "What is a memory-mapped file?",
    "What is the purpose of `fflush()`?",
    "What is a double pointer in C?",
    "What is the difference between `NULL` and `0` in C?"
  ],

  "C++": [
    "What is polymorphism in C++?",
    "Explain constructors and destructors in C++.",
    "What are the basic OOP principles?",
    "What is the difference between compile-time and runtime polymorphism?",
    "Explain function overloading and function overriding.",
    "What is a virtual function?",
    "Explain the concept of inheritance in C++.",
    "What is an abstract class?",
    "Differentiate between deep copy and shallow copy.",
    "What is an STL in C++?",
    "Explain the use of templates in C++.",
    "What is a friend function?",
    "What is the difference between `new` and `malloc`?",
    "How is exception handling done in C++?",
    "What is a destructor and when is it called?",
    "Explain multiple inheritance with an example.",
    "What are access specifiers in C++?",
    "What is the `this` pointer?",
    "Explain the concept of encapsulation.",
    "What is a smart pointer?",
    "What is the difference between `==` and `equals()`?",
    "How does operator overloading work?",
    "What is RAII (Resource Acquisition Is Initialization)?",
    "What are lambda expressions?",
    "Explain `static` keyword usage in C++.",
    "What are function objects?",
    "What is a virtual destructor?",
    "What is a namespace?",
    "What is the difference between `map` and `unordered_map`?",
    "How does memory allocation work in C++?",
    "What is a singleton class?",
    "What is the difference between stack and heap memory?",
    "What is a pure virtual function?",
    "Explain the Diamond Problem in C++.",
    "What is the difference between vector and array?",
    "What is a move constructor?",
    "What is `std::unique_ptr`?",
    "Explain `std::shared_ptr` and `std::weak_ptr`.",
    "What is `std::tuple` used for?",
    "Explain the `constexpr` keyword."
  ],

  "Java": [
    "What are Java's advantages?",
    "Explain multithreading in Java.",
    "What is the difference between JDK, JRE, and JVM?",
    "What are access modifiers in Java?",
    "What is an interface in Java?",
    "Explain the difference between `ArrayList` and `LinkedList`.",
    "What is the difference between `==` and `.equals()`?",
    "Explain method overloading and method overriding.",
    "What is a constructor in Java?",
    "What is garbage collection in Java?",
    "Explain the working of `final`, `finally`, and `finalize`.",
    "What is the difference between `throw` and `throws`?",
    "What is an abstract class?",
    "What is a static variable?",
    "What is a singleton class?",
    "Explain the concept of a thread pool.",
    "What is the purpose of the `super` keyword?",
    "What is reflection in Java?",
    "How does HashMap work internally?",
    "What is the difference between `StringBuilder` and `StringBuffer`?",
    "Explain the working of the `volatile` keyword.",
    "What is a functional interface?",
    "What is the use of `synchronized` keyword?",
    "What is a lambda expression?",
    "What are Java streams?",
    "Explain Java serialization.",
    "What are the different types of exceptions in Java?",
    "What is `Comparable` and `Comparator`?",
    "What is method reference in Java?",
    "What is Spring Framework?",
    "How does Hibernate work?",
    "What are default methods in an interface?",
    "What is a marker interface?",
    "What is Java Memory Model?",
    "What is the difference between `Executor` and `ExecutorService`?",
    "How does Java handle deadlocks?",
    "What is `Optional` class?",
    "What are weak references?",
    "What is a Proxy Class in Java?",
    "How does Java handle multiple inheritance?"
  ]
};


const MockInterview = () => {
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [chat, setChat] = useState([]);

  const startInterview = (selectedCategory) => {
    setCategory(selectedCategory);
    setSubCategory(null);
    setQuestionIndex(0);
    setChat([{ role: "AI", text: "Let's start! " + questions[selectedCategory][0] }]);
  };

  const selectSubCategory = (sub) => {
    setSubCategory(sub);
    setQuestionIndex(0);
    setChat([{ role: "AI", text: "Let's start! " + questions[sub][0] }]);
  };

  const evaluateAnswer = () => {
    if (!answer.trim()) return;
    
    let score = Math.floor(Math.random() * 6) + 5; 
    let feedback = "Good attempt! Try to add more details.";
    
    setChat((prev) => [
      ...prev,
      { role: "User", text: answer },
      { role: "AI", text: `Score: ${score}/10\nFeedback: ${feedback}` },
    ]);
    setAnswer("");
    
    if (questionIndex + 1 < questions[subCategory || category].length) {
      setQuestionIndex(questionIndex + 1);
      setChat((prev) => [...prev, { role: "AI", text: questions[subCategory || category][questionIndex + 1] }]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <header className="w-full bg-blue-600 text-white text-center py-4 fixed top-0 shadow-md z-10">
        <h1 className="text-xl font-semibold">AI Mock Interview</h1>
      </header>

      {/* Content Section - Adjusted to avoid header overlap */}
      <div className="flex flex-col items-center w-full pt-24 p-4">
        {/* General HR & Technical HR Buttons - Always Visible */}
        {!category ? (
         
<div className="flex flex-col items-center justify-center gap-y-6">
  {/* General HR Button */}
  <button
    className="flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-blue-200 w-64 h-24"
    onClick={() => startInterview("General HR")}
  >
    <FaUserTie className="text-3xl text-blue-500 mb-2" /> {/* HR Icon */}
    <span className="text-lg font-medium">General HR</span>
  </button>

  {/* Technical HR Button */}
  <button
    className="flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-xl hover:bg-green-200 w-64 h-24"
    onClick={() => setCategory("Technical HR")}
  >
    <FaLaptopCode className="text-3xl text-green-500 mb-2" /> {/* Tech Icon */}
    <span className="text-lg font-medium">Technical HR</span>
  </button>
</div>
        ) : category === "Technical HR" && !subCategory ? (
          <div className="flex flex-col gap-4 mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C")}>
              C
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("C++")}>
              C++
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => selectSubCategory("Java")}>
              Java
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg flex flex-col p-4 mt-4">
            {/* Chat Box */}
            <div className="h-96 overflow-y-auto p-4 flex flex-col gap-2">
              {chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg max-w-[75%] ${
                    msg.role === "AI" ? "self-start bg-blue-500 text-white" : "self-end bg-gray-300 text-black"
                  }`}
                >
                  <strong>{msg.role}:</strong> {msg.text}
                </motion.div>
              ))}
            </div>

            {/* Answer Input */}
            <div className="flex items-center gap-2 p-2 border-t">
              <textarea
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={evaluateAnswer}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
