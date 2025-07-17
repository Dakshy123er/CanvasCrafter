import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import heroAnimation from '../assets/post-bg.json'; // ✅ Your Lottie JSON
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
    <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-32 py-16 mt-16 bg-white dark:bg-gray-900">
      {/* Text Content */}
      <div className="z-10 max-w-xl text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Upgrade To Premium
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
          You are allowed to generate free 30 images , after that upgrade to premium
        </p>
        <Link
          to="/Upgrade"
          className="inline-block bg-[#6469ff] hover:bg-[#4e53d2] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              >
          Upgrade Now
          </motion.button>
        </Link>
      </div>

      {/* Lottie Animation */}
      <div className="mt-10 lg:mt-0 lg:ml-10 w-full lg:w-1/2">
        <Player
          autoplay
          loop
          src={heroAnimation}
          className="w-full h-full"
        />
      </div>
    </section>
    </motion.div>
  );
};

export default Hero;
