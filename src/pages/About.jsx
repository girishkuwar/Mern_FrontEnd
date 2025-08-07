import React from 'react'

const About = () => {
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
            <section className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl my-3.5 mx-auto px-6 py-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Charter</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Charter is a data-driven platform designed to help users upload, analyze,
                    and visualize Excel datasets with ease. Whether you're tracking sales,
                    managing projects, or exploring trends, Charter empowers you with powerful
                    graphing tools and clean insights.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-10">
                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-blue-600">Our Mission</h2>
                        <p className="text-gray-700">
                            We aim to democratize data visualization by making it accessible to
                            everyone. Charter is built for speed, simplicity, and clarity—no steep
                            learning curve, no clutter.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-blue-600">What We Offer</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Easy Excel file uploads</li>
                            <li>Customizable graph visualizations</li>
                            <li>3D charts powered by Three.js</li>
                            <li>AI-powered data summaries</li>
                            <li>Responsive and intuitive dashboards</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About