import { useEffect, useRef, useState } from "react";
import { FaUserTie, FaLaptopCode, FaMicrophone, FaKeyboard } from "react-icons/fa";
import { motion } from "framer-motion";

const questionBank = {
  "General HR": [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?",
    "How do you handle stress?",
    "What motivates you?",
    "What is your greatest weakness?",
    "Describe a challenging situation at work.",
    "Why do you want this job?",
    "Do you have any questions for us?",
    "Describe your leadership experience.",
    "What are your long-term career goals?",
    "How do you handle feedback?",
    "What do you know about our company?",
    "How do you handle conflict at work?",
    "What is your management style?",
    "Describe a time you made a mistake.",
    "What sets you apart from other candidates?",
    "What is your ideal work environment?",
    "How do you prioritize tasks?",
    "How do you stay motivated during routine work?",
    "Have you ever led a team?",
    "How do you manage deadlines?",
    "How do you adapt to change?",
    "Describe your decision-making process.",
    "What would you do in your first 30 days here?",
    "How do you balance work and life?",
    "Describe your communication style.",
    "How do you handle criticism?",
    "What do you expect from your manager?"
  ],
  Java: [
    "What is JVM?",
    "Difference between JDK, JRE, and JVM.",
    "What is OOP in Java?",
    "Explain Inheritance with example.",
    "What are access modifiers in Java?",
    "What is the difference between ArrayList and LinkedList?",
    "What is Exception Handling?",
    "What is the use of 'final' keyword?",
    "Difference between method overloading and overriding.",
    "What is a constructor in Java?",
    "What is the difference between '== operator' and 'equals()' method in Java?",
    "Explain the concept of garbage collection in Java.",
    "What are static methods and static variables in Java?",
    "What is the significance of the 'this' keyword in Java?",
    "How does Java handle memory management?",
    "What is the difference between String, StringBuilder, and StringBuffer in Java?",
    "Explain the concept of multithreading in Java.",
    "What are Java Collections Framework?",
    "What is the difference between ArrayList and LinkedList in Java?",
    "Explain the concept of serialization in Java.",
    "What is a lambda expression in Java?",
    "Describe the purpose of the 'super' keyword in Java.",
    "What is the difference between 'break' and 'continue' statements in Java?",
    "Explain the concept of reflection in Java.",
    "What are default methods in interfaces?",
    "How does Java implement memory leak prevention?",
    "What is the difference between shallow copy and deep copy in Java?",
    "Explain the concept of dependency injection in Java.",
    "What are functional interfaces in Java?",
    "Describe the Observer design pattern in Java.",
    "What is the purpose of the 'volatile' keyword in Java?",
    "Explain the difference between 'HashMap' and 'Hashtable' in Java.",
    "What is the significance of the 'transient' keyword in Java?",
    "How does Java support internationalization (i18n)?",
    "What are the different types of inner classes in Java?",
    "Explain the concept of method reference in Java.",
    "What is the difference between 'Comparable' and 'Comparator' interfaces?",
    "Describe the Singleton design pattern and its implementation in Java.",
    "What is the purpose of the 'assert' keyword in Java?",
    "How does Java handle multiple inheritance?"
  ],
  Python: [
    "What is Python?",
    "What are Python's key features?",
    "What is the difference between list and tuple?",
    "What are Python decorators?",
    "What is lambda function?",
    "Explain Python’s memory management.",
    "What are modules and packages?",
    "What is PEP8?",
    "Difference between deep copy and shallow copy.",
    "What is a Python generator?",
    "What is the difference between 'is' and '==' in Python?",
    "Explain the concept of Python's Global Interpreter Lock (GIL).",
    "What are Python's built-in data types?",
    "How is memory managed in Python?",
    "What is the difference between deep and shallow copy?",
    "What are Python's namespaces?",
    "Explain the use of 'self' in Python classes.",
    "What is the difference between 'staticmethod' and 'classmethod'?",
    "How does Python handle exceptions?",
    "What is the purpose of 'if __name__ == \"__main__\"' in Python scripts?",
    "What are Python's iterators and generators?",
    "Explain the concept of list comprehension.",
    "What is the difference between 'append()' and 'extend()' methods in Python?",
    "How does Python manage memory?",
    "What is the difference between 'deepcopy()' and 'copy()' methods?",
    "Explain the concept of Python's decorators.",
    "What are Python's lambda functions?",
    "How does Python implement multithreading?",
    "What is the difference between 'range()' and 'xrange()'?",
    "Explain the concept of Python's context managers.",
    "What are Python's magic methods?",
    "How does Python handle memory leaks?",
    "What is the difference between 'is' and '==' operators?",
    "Explain the concept of Python's metaclasses.",
    "What are Python's coroutines?",
    "How does Python implement inheritance?",
    "What is the difference between old-style and new-style classes in Python?",
    "Explain the concept of Python's descriptors.",
    "What are Python's weak references?",
    "How does Python handle circular references?"
  ],
  "C++": [
    "What is C++?",
    "Explain OOP concepts in C++.",
    "What is the difference between struct and class?",
    "What is a virtual function?",
    "What is the use of 'this' pointer?",
    "What is constructor and destructor?",
    "What is operator overloading?",
    "Difference between compile-time and run-time polymorphism.",
    "What are templates in C++?",
    "What is the difference between new and malloc?",
    "What is the difference between 'delete' and 'delete[]' in C++?",
    "Explain the concept of friend function in C++.",
    "What are the different types of inheritance in C++?",
    "What is the significance of the 'mutable' keyword in C++?",
    "Explain the concept of exception handling in C++.",
    "What is the use of 'namespace' in C++?",
    "What is the difference between 'const' and 'constexpr' in C++?",
    "Explain the concept of RAII (Resource Acquisition Is Initialization).",
    "What are smart pointers in C++?",
    "What is the difference between 'std::vector' and 'std::array'?",
    "Explain the concept of move semantics in C++11.",
    "What is the use of 'decltype' in C++?",
    "What are lambda expressions in C++11?",
    "Explain the concept of 'std::unique_ptr' and 'std::shared_ptr'.",
    "What is the difference between 'std::map' and 'std::unordered_map'?",
    "What is the significance of the 'explicit' keyword in C++?",
    "Explain the concept of function overloading in C++.",
    "What are virtual destructors in C++?",
    "What is the difference between 'std::list' and 'std::vector'?",
    "Explain the concept of 'std::forward' in C++11.",
    "What is the use of 'std::move' in C++?",
    "What are variadic templates in C++11?",
    "Explain the concept of 'std::async' and 'std::future' in C++11.",
    "What is the difference between 'std::queue' and 'std::stack'?",
    "What are the different storage classes in C++?",
    "Explain the concept of 'std::function' in C++11.",
    "What is the use of 'std::bind' in C++?",
    "What are the different casting operators in C++?",
    "Explain the concept of 'std::thread' in C++11.",
    "What is the difference between 'std::mutex' and 'std::recursive_mutex'?"
  ]
};

const keywordBank = {
 "Tell me about yourself.": ["experience", "skills", "education", "projects"],
  "What are your strengths?": ["communication", "problem-solving", "leadership"],
  "Why should we hire you?": ["fit", "value", "skills", "company needs"],
  "Where do you see yourself in 5 years?": ["goals", "growth", "career path", "vision"],
  "How do you handle stress?": ["coping mechanisms", "time management", "mindfulness"],
  "What motivates you?": ["goals", "impact", "recognition", "challenge"],
  "What is your greatest weakness?": ["self-awareness", "improvement", "honesty"],
  "Describe a challenging situation at work.": ["problem-solving", "conflict resolution", "resilience"],
  "Why do you want this job?": ["interest", "company values", "career growth"],
  "Do you have any questions for us?": ["curiosity", "company culture", "role clarity"],
  "Describe your leadership experience.": ["teamwork", "delegation", "initiative"],
  "What are your long-term career goals?": ["vision", "development", "ambition"],
  "How do you handle feedback?": ["receptiveness", "growth mindset", "adaptability"],
  "What do you know about our company?": ["research", "industry", "values", "products"],
  "How do you handle conflict at work?": ["communication", "empathy", "resolution"],
  "What is your management style?": ["leadership", "delegation", "supportive"],
  "Describe a time you made a mistake.": ["learning", "accountability", "growth"],
  "What sets you apart from other candidates?": ["uniqueness", "value", "skills"],
  "What is your ideal work environment?": ["culture", "collaboration", "flexibility"],
  "How do you prioritize tasks?": ["organization", "time management", "urgency"],
  "How do you stay motivated during routine work?": ["discipline", "purpose", "focus"],
  "Have you ever led a team?": ["leadership", "teamwork", "responsibility"],
  "How do you manage deadlines?": ["planning", "time management", "efficiency"],
  "How do you adapt to change?": ["flexibility", "openness", "resilience"],
  "Describe your decision-making process.": ["analysis", "data", "logic", "intuition"],
  "What would you do in your first 30 days here?": ["onboarding", "learning", "relationships"],
  "How do you balance work and life?": ["time management", "boundaries", "wellbeing"],
  "Describe your communication style.": ["clarity", "listening", "collaboration"],
  "How do you handle criticism?": ["acceptance", "learning", "growth mindset"],
  "What do you expect from your manager?": ["support", "feedback", "transparency"],
    "What is JVM?": ["java", "virtual", "machine"],
    "Difference between JDK, JRE, and JVM.": ["jdk", "jre", "jvm", "difference"],
    "What is OOP in Java?": ["oop", "object", "oriented", "java"],
    "Explain Inheritance with example.": ["inheritance", "example", "oop"],
    "What are access modifiers in Java?": ["access", "modifiers", "private", "public", "protected"],
    "What is the difference between ArrayList and LinkedList?": ["arraylist", "linkedlist", "list", "collection", "difference"],
    "What is Exception Handling?": ["exception", "handling", "try", "catch", "throw"],
    "What is the use of 'final' keyword?": ["final", "keyword", "constant", "inheritance"],
    "Difference between method overloading and overriding.": ["method", "overloading", "overriding", "polymorphism"],
    "What is a constructor in Java?": ["constructor", "initialization", "class"],
    "What is the difference between '== operator' and 'equals()' method in Java?": ["equals", "==", "comparison", "reference", "value"],
    "Explain the concept of garbage collection in Java.": ["garbage", "collection", "memory", "management"],
    "What are static methods and static variables in Java?": ["static", "methods", "variables", "class"],
    "What is the significance of the 'this' keyword in Java?": ["this", "keyword", "reference", "current", "object"],
    "How does Java handle memory management?": ["java", "memory", "management", "heap", "stack"],
    "What is the difference between String, StringBuilder, and StringBuffer in Java?": ["string", "stringbuilder", "stringbuffer", "difference", "immutable", "mutable"],
    "Explain the concept of multithreading in Java.": ["multithreading", "thread", "concurrency"],
    "What are Java Collections Framework?": ["collections", "framework", "list", "set", "map"],
    "Explain the concept of serialization in Java.": ["serialization", "object", "stream", "byte"],
    "What is a lambda expression in Java?": ["lambda", "expression", "functional", "interface"],
    "Describe the purpose of the 'super' keyword in Java.": ["super", "keyword", "inheritance", "parent"],
    "What is the difference between 'break' and 'continue' statements in Java?": ["break", "continue", "loop", "control"],
    "Explain the concept of reflection in Java.": ["reflection", "runtime", "class", "methods"],
    "What are default methods in interfaces?": ["default", "methods", "interfaces", "java 8"],
    "How does Java implement memory leak prevention?": ["java", "memory", "leak", "prevention"],
    "What is the difference between shallow copy and deep copy in Java?": ["shallow", "deep", "copy", "clone", "reference"],
    "Explain the concept of dependency injection in Java.": ["dependency", "injection", "spring", "loose", "coupling"],
    "What are functional interfaces in Java?": ["functional", "interface", "lambda", "java 8"],
    "Describe the Observer design pattern in Java.": ["observer", "design", "pattern", "behavioral"],
    "What is the purpose of the 'volatile' keyword in Java?": ["volatile", "keyword", "thread", "memory"],
    "Explain the difference between 'HashMap' and 'Hashtable' in Java.": ["hashmap", "hashtable", "map", "synchronization"],
    "What is the significance of the 'transient' keyword in Java?": ["transient", "keyword", "serialization"],
    "How does Java support internationalization (i18n)?": ["internationalization", "i18n", "localization", "resource", "bundle"],
    "What are the different types of inner classes in Java?": ["inner", "classes", "static", "anonymous", "local"],
    "Explain the concept of method reference in Java.": ["method", "reference", "lambda", "java 8"],
    "What is the difference between 'Comparable' and 'Comparator' interfaces?": ["comparable", "comparator", "sorting", "interface"],
    "Describe the Singleton design pattern and its implementation in Java.": ["singleton", "design", "pattern", "instance"],
    "What is the purpose of the 'assert' keyword in Java?": ["assert", "keyword", "testing", "assertion"],
    "How does Java handle multiple inheritance?": ["multiple", "inheritance", "interface", "java"],
    "What is Python?": ["python", "programming", "language"],
  "What are Python's key features?": ["interpreted", "dynamically", "typed", "object-oriented", "extensive", "libraries"],
  "What is the difference between list and tuple?": ["list", "tuple", "mutable", "immutable", "difference"],
  "What are Python decorators?": ["decorators", "functions", "wrappers", "syntax"],
  "What is lambda function?": ["lambda", "anonymous", "function"],
  "Explain Python’s memory management.": ["memory", "management", "garbage", "collector"],
  "What are modules and packages?": ["modules", "packages", "import", "namespace"],
  "What is PEP8?": ["pep8", "style", "guide", "conventions"],
  "Difference between deep copy and shallow copy.": ["deep", "shallow", "copy", "clone"],
  "What is a Python generator?": ["generator", "yield", "iterator"],
  "What is the difference between 'is' and '==' in Python?": ["is", "==", "comparison", "identity", "equality"],
  "Explain the concept of Python's Global Interpreter Lock (GIL).": ["gil", "global", "interpreter", "lock", "threading"],
  "What are Python's built-in data types?": ["data", "types", "int", "float", "list", "tuple", "dict"],
  "How is memory managed in Python?": ["memory", "management", "garbage", "collector"],
  "What are Python's namespaces?": ["namespace", "scope", "variable"],
  "Explain the use of 'self' in Python classes.": ["self", "class", "instance", "method"],
  "What is the difference between 'staticmethod' and 'classmethod'?": ["staticmethod", "classmethod", "decorator", "difference"],
  "How does Python handle exceptions?": ["exception", "handling", "try", "except", "raise"],
  "What is the purpose of 'if __name__ == \"__main__\"' in Python scripts?": ["__name__", "__main__", "script", "execution"],
  "What are Python's iterators and generators?": ["iterator", "generator", "yield", "next"],
  "Explain the concept of list comprehension.": ["list", "comprehension", "syntax", "iteration"],
  "What is the difference between 'append()' and 'extend()' methods in Python?": ["append", "extend", "list", "methods", "difference"],
  "How does Python implement multithreading?": ["multithreading", "thread", "threading", "gil"],
  "What is the difference between 'range()' and 'xrange()'?": ["range", "xrange", "iteration", "difference"],
  "Explain the concept of Python's context managers.": ["context", "manager", "with", "statement"],
  "What are Python's magic methods?": ["magic", "methods", "dunder", "special"],
  "How does Python handle memory leaks?": ["memory", "leak", "garbage", "collector"],
  "Explain the concept of Python's metaclasses.": ["metaclass", "class", "type", "inheritance"],
  "What are Python's coroutines?": ["coroutine", "async", "await", "asynchronous"],
  "How does Python implement inheritance?": ["inheritance", "class", "object", "oop"],
  "What is the difference between old-style and new-style classes in Python?": ["old-style", "new-style", "class", "difference"],
  "Explain the concept of Python's descriptors.": ["descriptor", "attribute", "getter", "setter"],
  "What are Python's weak references?": ["weakref", "reference", "garbage", "collector"],
  "How does Python handle circular references?": ["circular", "reference", "garbage", "collector"],

  // C++ Questions and Keywords
  "What is C++?": ["c++", "programming", "language"],
  "Explain OOP concepts in C++.": ["oop", "object-oriented", "encapsulation", "inheritance", "polymorphism", "abstraction"],
  "What is the difference between struct and class?": ["struct", "class", "access", "specifier", "difference"],
  "What is a virtual function?": ["virtual", "function", "polymorphism", "override"],
  "What is the use of 'this' pointer?": ["this", "pointer", "object", "instance"],
  "What is constructor and destructor?": ["constructor", "destructor", "class", "object", "lifecycle"],
  "What is operator overloading?": ["operator", "overloading", "polymorphism"],
  "Difference between compile-time and run-time polymorphism.": ["compile-time", "run-time", "polymorphism", "difference"],
  "What are templates in C++?": ["templates", "generic", "programming", "type", "parameter"],
  "What is the difference between new and malloc?": ["new", "malloc", "memory", "allocation", "difference"],
  "What is the difference between 'delete' and 'delete[]' in C++?": ["delete", "delete[]", "memory", "deallocation", "difference"],
  "Explain the concept of friend function in C++.": ["friend", "function", "access", "private", "members"],
  "What are the different types of inheritance in C++?": ["inheritance", "single", "multiple", "multilevel", "hierarchical", "hybrid"],
  "What is the significance of the 'mutable' keyword in C++?": ["mutable", "keyword", "const", "member", "variable"],
  "Explain the concept of exception handling in C++.": ["exception", "handling", "try", "catch", "throw"],
  "What is the use of 'namespace' in C++?": ["namespace", "scope", "identifier"],
  "What is the difference between 'const' and 'constexpr' in C++?": ["const", "constexpr", "constant", "expression", "difference"],
  "Explain the concept of RAII (Resource Acquisition Is Initialization).": ["raii", "resource", "management", "constructor", "destructor"],
  "What are smart pointers in C++?": ["smart", "pointer", "unique_ptr", "shared_ptr", "weak_ptr"],
  "What is the difference between 'std::vector' and 'std::array'?": ["vector", "array", "std", "difference"],
  "Explain the concept of move semantics in C++11.": ["move", "semantics", "rvalue", "reference", "c++11"],
  
  };

const getRandomQuestions = (topic, count = 10) => {
  const shuffled = [...questionBank[topic]].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const MockInterview = () => {
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chat, setChat] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mode, setMode] = useState("voice"); // "voice" or "chat"
  const [typedAnswer, setTypedAnswer] = useState("");

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const startInterview = (mainCategory, subCat = null) => {
    setCategory(mainCategory);
    setSubCategory(subCat);
    const selectedTopic = subCat || mainCategory;
    const qList = getRandomQuestions(selectedTopic, mainCategory === "General HR" ? 10 : 5);
    setQuestions(qList);
    setQuestionIndex(0);
    setChat([{ role: "AI", text: `🎙️ Let's start!\n${qList[0]}` }]);
    setTotalScore(0);
  };

  const evaluateAnswer = (spokenText) => {
    if (!spokenText.trim()) return;

    const currentQuestion = questions[questionIndex];
    const keywords = keywordBank[currentQuestion] || [];
    const doc = window.nlp(spokenText);
    const extractedWords = doc.terms().out('array').map((w) => w.toLowerCase());
    const matchedKeywords = keywords.filter((kw) =>
      extractedWords.includes(kw.toLowerCase())
    );

    const totalKeywords = keywords.length;
    const matchedCount = matchedKeywords.length;
    const score = totalKeywords > 0 ? (matchedCount / totalKeywords) * 10 : 0;
    setTotalScore((prev) => prev + score);

    let feedback = "";
    if (totalKeywords === 0) {
      feedback = "⚠️ No key points defined for this question. Skipping scoring.";
    } else if (score >= 9) {
      feedback = "✅ Excellent! You covered all important points.";
    } else if (score >= 7) {
      feedback = `👍 Good job! But you can improve by including: ${keywords
        .filter((kw) => !matchedKeywords.includes(kw.toLowerCase()))
        .join(", ")}`;
    } else if (score >= 4) {
      feedback = `📝 Fair attempt. Try to include more key points like: ${keywords
        .filter((kw) => !matchedKeywords.includes(kw.toLowerCase()))
        .join(", ")}`;
    } else {
      feedback = `❗Needs improvement. You missed most of the key points. Try to include: ${keywords
        .filter((kw) => !matchedKeywords.includes(kw.toLowerCase()))
        .join(", ")}`;
    }

    setChat((prev) => [
      ...prev,
      { role: "User", text: `Your answer is: ${spokenText}` },
      { role: "AI", text: `🎯 Score: ${score.toFixed(1)}/10\n📑 Feedback: ${feedback}` }
    ]);

    if (questionIndex + 1 < questions.length) {
      const nextQ = questions[questionIndex + 1];
      setQuestionIndex((prev) => prev + 1);
      setChat((prev) => [...prev, { role: "AI", text: nextQ }]);
    } else {
      setChat((prev) => [
        ...prev,
        {
          role: "BOT",
          text: `✅ Interview Complete!\n🎯 Final Score: ${(totalScore + score).toFixed(1)} / ${questions.length * 10}`
        }
      ]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setRecording(true);

    recognition.onresult = (e) => {
      setRecording(false);
      const spoken = e.results[0][0].transcript;
      evaluateAnswer(spoken);
    };

    recognition.onerror = (e) => {
      setRecording(false);
      console.error("Speech recognition error:", e.error);
    };

    recognition.start();
  };

  const handleTextSubmit = () => {
    if (typedAnswer.trim()) {
      evaluateAnswer(typedAnswer);
      setTypedAnswer("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-600 text-white text-center py-4 fixed top-0 z-10">
        <h1 className="text-xl font-bold">🤖 AI Mock Interview</h1>
      </header>

      <div className="pt-24 p-4 w-full flex flex-col items-center">
        {!category ? (
          <div className="grid gap-6">
            <button
              className="p-6 bg-white shadow-xl rounded-2xl hover:bg-blue-100 w-72 flex flex-col items-center"
              onClick={() => startInterview("General HR")}
            >
              <FaUserTie className="text-4xl text-blue-500 mb-2" />
              <span className="text-lg font-medium">General HR</span>
            </button>

            <button
              className="p-6 bg-white shadow-xl rounded-2xl hover:bg-green-100 w-72 flex flex-col items-center"
              onClick={() => setCategory("Technical HR")}
            >
              <FaLaptopCode className="text-4xl text-green-500 mb-2" />
              <span className="text-lg font-medium">Technical HR</span>
            </button>
          </div>
        ) : category === "Technical HR" && !subCategory ? (
          <div className="flex gap-4 mt-6">
            {["Java", "Python", "C++"].map((tech) => (
              <button
                key={tech}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg"
                onClick={() => startInterview("Technical HR", tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-center text-lg font-semibold mb-2">AI Mock Interview</h2>

            <div className="flex justify-center gap-4 mb-2">
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  mode === "voice" ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setMode("voice")}
              >
                <FaMicrophone className="inline mr-1" /> Voice
              </button>
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  mode === "chat" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setMode("chat")}
              >
                <FaKeyboard className="inline mr-1" /> Chat
              </button>
            </div>

            <div
              ref={chatRef}
              className="h-96 overflow-y-auto p-4 space-y-3 border rounded flex flex-col"
            >
              {chat.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "AI" || msg.role === "BOT"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[70%] break-words ${
                      msg.role === "AI" || msg.role === "BOT"
                        ? "bg-blue-100 text-black text-left"
                        : "bg-green-200 text-black text-right"
                    }`}
                  >
                    <p className="text-sm text-gray-600 font-semibold">
                      {msg.role === "AI"
                        ? "🤖 AI"
                        : msg.role === "User"
                        ? "👨‍🎓 You"
                        : "🤖 BOT"}
                    </p>
                    <p className="mt-1 whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center mt-4 gap-2">
              {mode === "voice" ? (
                <button
                  onClick={startVoiceInput}
                  className="bg-green-500 text-white px-5 py-2 rounded-full flex items-center gap-3"
                >
                  <FaMicrophone />
                  {recording ? (
                    <span className="animate-pulse">Listening...</span>
                  ) : (
                    "Speak Answer"
                  )}
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Type your answer..."
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-4 rounded"
                    onClick={handleTextSubmit}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;

