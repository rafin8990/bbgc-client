import React from "react";
import { FaDesktop, FaWifi, FaUsers, FaMicrochip } from "react-icons/fa";

const statsData = [
  { id: 1, icon: <FaDesktop />, title: "৪০+ কম্পিউটার" },
  { id: 2, icon: <FaWifi />, title: "উচ্চ গতির ইন্টারনেট" },
  { id: 3, icon: <FaUsers />, title: "৪৫ শিক্ষার্থীর ক্ষমতা" },
  { id: 4, icon: <FaMicrochip />, title: "সর্বশেষ সফটওয়্যার" },
];

const galleryData = [
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
];

const Computerlabpage = () => {
  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">

      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-24">

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80"
            alt="কম্পিউটার ল্যাব"
            className="w-full h-[400px] object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
              আধুনিক কম্পিউটার ল্যাব
            </h1>
            <p className="text-gray-300 max-w-2xl">
              উন্নত ডেস্কটপ সিস্টেম এবং উচ্চ গতির ইন্টারনেট দ্বারা সজ্জিত, যা শিক্ষার্থীদের হাতে-কলমে ডিজিটাল শেখার অভিজ্ঞতা নিশ্চিত করে।
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {statsData.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 transition duration-500"
            >
              <div className="text-3xl text-cyan-400 mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-400">
              ব্যবহারিক ও ডিজিটাল শিক্ষা
            </h2>
            <p className="text-gray-300 leading-relaxed">
              আমাদের কম্পিউটার ল্যাব ICT শিক্ষা, প্রোগ্রামিং অনুশীলন, মাল্টিমিডিয়া শেখা এবং অনলাইন গবেষণা সমর্থন করে। শিক্ষার্থীরা হাতে-কলমে সেশনগুলির মাধ্যমে বাস্তব জ্ঞান অর্জন করে।
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              alt="ল্যাব পরিবেশ"
              className="w-full h-[350px] object-cover hover:scale-105 transition duration-700"
            />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">ল্যাব গ্যালারি</h2>
            <p className="text-gray-300">
              আমাদের আধুনিক কম্পিউটার ল্যাবের একটি ঝলক।
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryData.map((img, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                <img
                  src={img}
                  alt={`কম্পিউটার ল্যাব ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Computerlabpage;
