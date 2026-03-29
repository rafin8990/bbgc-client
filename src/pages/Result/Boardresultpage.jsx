import React, { useEffect, useState } from "react";
import { FaHourglassHalf } from "react-icons/fa";

const Boardresultpage = () => {
  const [dots, setDots] = useState("...");

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#050b1e] text-white min-h-screen flex justify-center items-center px-6">

      {/* Glow Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/20 blur-[150px]" />

      <div className="relative flex flex-col items-center text-center max-w-lg space-y-10">

        {/* Icon */}
        <div className="text-cyan-400 text-6xl animate-bounce">
          <FaHourglassHalf />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">
          বোর্ড ফলাফল প্রকাশিত হবে
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed">
          আমাদের শিক্ষার্থীদের বোর্ড ফলাফল শীঘ্রই প্রকাশিত হবে।  
          অনুগ্রহ করে ধৈর্য ধরুন এবং নিয়মিত সাইট ভিজিট করুন {dots}
        </p>

        {/* Glassy Info Box */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 w-full shadow-xl">
          <h2 className="text-cyan-400 text-2xl font-semibold mb-2">
            গুরুত্বপূর্ণ তথ্য
          </h2>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✔ ফলাফল শুধুমাত্র সরকারি ওয়েবসাইটে প্রকাশিত হবে।</li>
            <li>✔ লগইন করে আপনার রোল নম্বর ব্যবহার করুন।</li>
            <li>✔ ফলাফল সংরক্ষণ করুন পরবর্তী প্রয়োজনের জন্য।</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6">
          © 2026 আমাদের কলেজ. সকল অধিকার সংরক্ষিত।
        </p>

      </div>
    </div>
  );
};

export default Boardresultpage;
