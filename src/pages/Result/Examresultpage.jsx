import React, { useState, useEffect } from "react";

const Examresultpage = () => {
  // Countdown state (example: results in 5 days)
  const calculateTimeLeft = () => {
    const difference = +new Date("2026-02-20T00:00:00") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        দিন: Math.floor(difference / (1000 * 60 * 60 * 24)),
        ঘণ্টা: Math.floor((difference / (1000 * 60 * 60)) % 24),
        মিনিট: Math.floor((difference / 1000 / 60) % 60),
        সেকেন্ড: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="relative bg-[#050b1e] text-white min-h-screen flex flex-col justify-center items-center px-6">

      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/20 blur-[150px]" />

      <div className="relative text-center space-y-10 max-w-xl">

        <h1 className="text-5xl md:text-6xl font-bold text-cyan-400">
          ফলাফল শীঘ্রই প্রকাশিত হবে
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          আমাদের শিক্ষার্থীদের জন্য পরবর্তী পরীক্ষার ফলাফল আসছে। কিছুদিন অপেক্ষা করুন।  
          আপনি আমাদের সাইটে নিয়মিত ভিজিট করলে আপডেট দেখতে পাবেন।
        </p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-4 text-center">
          {Object.keys(timeLeft).map((interval, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <p className="text-4xl font-bold text-cyan-400">
                {timeLeft[interval] || 0}
              </p>
              <span className="text-gray-300">{interval}</span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-gray-400 text-sm mt-6">
          © 2026 আমাদের কলেজ. সকল অধিকার সংরক্ষিত।
        </p>

      </div>
    </div>
  );
};

export default Examresultpage;
