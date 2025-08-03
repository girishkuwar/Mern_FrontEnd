import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, PieChart, Activity } from 'lucide-react'; // Lucide icons for floating charts

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden text-white animate-gradient bg-[length:400%_400%]">
      {/* Background Animation */}
      <style>{`
        .animate-gradient {
          background: linear-gradient(-45deg, #699cba, #4a738b, #699cba, #4a738b);
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }

        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }

        .floaty {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

      {/* Floating Icons */}
      <BarChart2 className="absolute top-10 left-10 w-10 h-10 text-white/20 floaty" />
      <PieChart className="absolute bottom-20 right-10 w-12 h-12 text-white/20 floaty" />
      <Activity className="absolute top-1/3 right-16 w-14 h-14 text-white/20 floaty" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Welcome to <span className="underline text-white">Charter</span>
        </h1>
        <p className="mt-4 text-lg text-white/90">
          Upload Excel files. Visualize 2D/3D Charts. Discover data insights.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <Link to="/login" className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started
          </Link>
          <Link to="/about" className="border border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Why use Charter?</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-600">Upload Excel</h3>
              <p className="text-gray-600 mt-2">Import spreadsheets and instantly transform them into charts.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-600">2D & 3D Charts</h3>
              <p className="text-gray-600 mt-2">Create bar, line, scatter, and surface charts interactively.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-600">Export & Share</h3>
              <p className="text-gray-600 mt-2">Download visuals or share them directly with your team.</p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default LandingPage;
