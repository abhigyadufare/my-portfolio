"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Greeting {
  text: string;
  language: string;
}

const LanguageLoader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState<number>(0);

  const greetings: Greeting[] = [
    { text: "Hello", language: "English" },
    { text: "नमस्ते", language: "Hindi" },
    { text: "Hola", language: "Spanish" },
    { text: "Bonjour", language: "French" },
    { text: "Ciao", language: "Italian" },
    { text: "こんにちは", language: "Japanese" },
    { text: "안녕하세요", language: "Korean" },
    { text: "Hallo", language: "German" },
    { text: "مرحبا", language: "Arabic" },
    { text: "你好", language: "Chinese" },
  ];

  useEffect(() => {
    // Flip through languages every 700ms
    const intervalId = setInterval(() => {
      setCurrentLanguageIndex(
        (prevIndex) => (prevIndex + 1) % greetings.length
      );
    }, 600);

    // Simulate app loading time
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Show loader for 5 seconds

    return () => {
      clearInterval(intervalId);
      clearTimeout(loadingTimeout);
    };
  }, []);

  if (!isLoading) {
    return null; // Loader disappears when loading is complete
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLanguageIndex}
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-5xl font-bold text-white mb-2">
                {greetings[currentLanguageIndex].text}
              </h2>
              <span className="text-sm text-slate-400">
                {greetings[currentLanguageIndex].language}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* <div className="mt-8">
          <div className="relative h-2 w-64 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
          <p className="text-slate-400 mt-4">Loading your application...</p>
        </div> */}
      </div>
    </div>
  );
};

export default LanguageLoader;
