import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Feedback Collection Portal
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-center max-w-2xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Collect and analyze feedback from your users with ease. Intuitive forms, smart dashboards, and powerful insights — all in one place.
      </motion.p>

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link to="/create-form">
          <button className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-100 transition-all duration-300">
            Create Form
          </button>
        </Link>
        <Link to="/my-forms">
          <button className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-purple-100 transition-all duration-300">
            My Forms
          </button>
        </Link>
      </motion.div>

      <motion.div
        className="mt-20 text-sm text-purple-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>Status: <span className="text-green-300 font-semibold">UP</span></p>
        <p>Database: <span className="text-green-300 font-semibold">Connected</span></p>
        <p>Server Time: {new Date().toLocaleString()}</p>
      </motion.div>
    </div>
  );
};

export default Home;
