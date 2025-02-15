import React from "react";
import { BookOpen, Layers, ShoppingCart, Headset } from "lucide-react";
import { Users, Briefcase, Rocket, ClipboardList } from "lucide-react";
import { MessageCircle, Calendar, FileText, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-100 pt-24"> {/* Add pt-20 to push content down */}
      {/* Hero Section */}
      <section id="home" >

      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center py-20">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-pink-500">Drive AI</span><br /> Empowering Student Placements
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            The ultimate platform for students, recruiters, and training partners
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            {/* <button className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition">
              Explore Opportunities
            </button> */}
             <Link to="/register">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
              Join Now
            </button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <img src="/first.png" alt="Illustration" className="w-full max-w-lg" />
        </div>
      </div>
      </section>


      {/* Drive AI Features Section */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[
            { icon: <BookOpen size={50} />, title: "AI-DRIVEN MOCK INTERVIEWS", desc: "Practice with real-time, AI-powered interview simulations." },
            { icon: <Layers size={50} />, title: "RESUME OPTIMIZATION", desc: "Get AI-powered ATS score and improve your resume." },
            { icon: <ShoppingCart size={50} />, title: "PLACEMENT OPPORTUNITIES", desc: "Discover placement drives with top companies and recruiters." },
            { icon: <Headset size={50} />, title: "24/7 SUPPORT", desc: "Access professional guidance and support whenever you need." }
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
            Drive AI is your all-in-one platform for **personalized mock interviews**, **ATS-friendly resumes**, and **real-time placement opportunities**. Take the leap toward a successful career with cutting-edge AI-powered tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Users size={60} className="text-blue-500" />, title: "AI-Powered Interviews", desc: "Experience realistic interview simulations with AI-driven feedback." },
              { icon: <MessageCircle size={60} className="text-green-500" />, title: "Instant Feedback", desc: "Get tailored feedback after each mock interview to refine your skills." },
              { icon: <FileText size={60} className="text-orange-500" />, title: "ATS-Optimized Resumes", desc: "Enhance your resume to get noticed by top recruiters with ATS optimization." },
              { icon: <Bell size={60} className="text-red-500" />, title: "Placement Alerts", desc: "Stay ahead with real-time updates on recruitment drives and job openings." },
              { icon: <Briefcase size={60} className="text-purple-500" />, title: "Career Guidance", desc: "Receive expert advice to shape your career trajectory with tailored recommendations." },
              { icon: <Calendar size={60} className="text-yellow-500" />, title: "Job Events Calendar", desc: "Stay organized with a calendar of job events and deadlines to never miss an opportunity." }
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
            Unlock your career potential with AI-driven mock interviews, resume optimization, and exclusive placement drives. Get ready to land your dream job with expert guidance and cutting-edge technology.
          </p>
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
                desc: "Connect with top recruiters from MNCs and startups actively hiring fresh talent through our exclusive job drives.",
                color: "text-pink-400"
              },
              {
                icon: <Rocket size={50} className="text-blue-400 mx-auto" />,
                title: "Industry-Ready Training",
                desc: "Enhance your skills with AI-based resume analysis, job-readiness coaching, and personalized career mentorship.",
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
              Whether you’re a fresher or an experienced job seeker, Drive AI provides the **best tools** to **boost your career**. Our **resume scanner, AI-driven interviews, and job alerts** will keep you ahead in the hiring process.
            </p>
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
