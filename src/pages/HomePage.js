import React from "react";
import { BookOpen,ShieldCheck ,ClipboardList } from "lucide-react";
import { Users, Briefcase, Rocket } from "lucide-react";
import { FileText,GraduationCap,Mail,Lock  } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-100 pt-24"> {/* Add pt-20 to push content down */}
      {/* Hero Section */}
      <section id="home">

<div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center py-20">
  <div className="lg:w-1/2 text-center lg:text-left">
    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
      Welcome to <span className="text-pink-500">Drive AI</span><br /> Empowering Student Placements
    </h1>
    <p className="text-lg text-gray-700 mb-8">
      🪄Revolutionizing Student Placements with Smart Tracking & Insights
    </p>
    <div className="flex space-x-4 justify-center lg:justify-start">
      <Link to="/register">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Join Now
        </button>
      </Link>
    </div>
  </div>

  <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
    <img 
      src="/first.png" 
      alt="Illustration" 
      className="w-full max-w-lg object-cover" 
      loading="lazy" 
    />
  </div>

</div>
</section>



      {/* Drive AI Features Section */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[
            { icon: <BookOpen size={50} />, title: "AI-MOCK INTERVIEWS", desc: "Practice with real-time, AI-powered interview simulations." },
            { icon: <FileText  size={50} />, title: "RESUME OPTIMIZATION", desc: "Get AI-powered ATS score for resumes in PDF format and evaluate them using AI." },
            { icon: <ClipboardList  size={50} />, title: "DRIVE MANAGEMENT", desc: "Effortlessly manage upcoming drives, track reports, and student placement records." },
            { icon: <ShieldCheck  size={50} />, title: "ROLE-BASED ACCESS", desc: "Admins manage data and access relevant information based on their department and section." }
          ].map((item, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-lg transform transition duration-500 hover:-translate-y-2 hover:scale-105">
              <div className="flex justify-center mb-4 text-yellow-300 animate-bounce">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2 tracking-wide">{item.title}</h3>
              <p className="text-gray-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <section id="about" >

      {/* Why Choose Drive AI Section */}
{/* Why Choose Drive AI Section */}
<div id="about" className="bg-gray-50 py-16 min-h-screen">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            Why Choose Drive AI? 🚀
          </h2>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            Drive AI is your all-in-one platform for personalized mock interviews, ATS-friendly resumes, and real-time placement opportunities. Take the leap toward a successful career with cutting-edge AI-powered tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
{ icon: <Users size={60} className="text-blue-500" />, title: "AI-Powered Interviews", desc: "Experience realistic interview simulations with AI-driven feedback." },
{ icon: <ClipboardList size={60} className="text-green-500" />, title: "Admin Module", desc: "Manage placement drives, track student progress, and oversee training programs with ease." },
{ icon: <GraduationCap size={60} className="text-purple-500" />, title: "Student Module", desc: "Access AI-driven mock interviews, resume optimization, and personalized career guidance." },
{ icon: <FileText size={60} className="text-orange-500" />, title: "ATS-Optimized Resumes", desc: "Enhance your resume to get noticed by top recruiters with ATS optimization." },
{ icon: <Mail size={60} className="text-red-500" />, title: "Automated Alerts", desc: "Students receive instant email notifications for recruitment drives, ensuring they never miss an opportunity." },
{ icon: <BookOpen size={60} className="text-yellow-500" />, title: "Training Partner", desc: "Manage training partner programs and upload study materials." }

            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                <div className="bg-blue-50 p-4 rounded-full mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>

      <section id="features" >

      {/* Drive AI Advantage Section */}
      <div className="bg-gray-900 text-white py-16 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Drive AI: Your Ultimate Placement Partner 🚀
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Streamline placement processes with AI-powered mock interviews, ATS-optimized resumes, and efficient management for Admins, Students, and Training Partners.          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Users size={50} className="text-yellow-400 mx-auto" />,
                title: "AI-Powered Interview Prep",
                desc: "Practice HR & Technical interviews with an AI bot that gives real-time feedback and detailed performance analysis.",
                color: "text-yellow-400"
              },
              {
                icon: <Briefcase size={50} className="text-pink-400 mx-auto" />,
                title: "Exclusive Placement Drives",
                desc: "Easily manage placement drives, track student performance, and oversee training partnerships for smooth operations.",
                color: "text-pink-400"
              },
              {
                icon: <Lock  size={50} className="text-blue-400 mx-auto" />,
                title: "Special Key Access",
                desc: "Receive a unique key for registration to unlock exclusive features tailored to your role: Admin, Manager, or Student.",
                color: "text-blue-400"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="mb-4">{item.icon}</div>
                <h3 className={`text-xl font-bold ${item.color}`}>{item.title}</h3>
                <p className="text-gray-300 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-300">
              🎯 Start Your Journey with Drive AI Today!
            </h3>
            <p className="text-gray-300 mt-4">
            Drive AI empowers you with AI-driven interviews, resume optimization,
             real-time job alerts, and the ability to track student company details and placed student
              counts, keeping you ahead in the hiring process.</p>
            <Link to="/register">
              <button className="mt-6 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-lg transition duration-300">
                Get Started 🚀
              </button>
            </Link>
          </div>
        </div>
      </div>
      </section>

    </div>
  );
};

export default HomePage;
