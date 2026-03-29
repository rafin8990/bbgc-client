import React from "react";
import { FaBook, FaUsers, FaLaptop, FaClock } from "react-icons/fa";
import CountUp from "react-countup";

// Library features
const featureData = [
  { id: 1, icon: <FaBook />, title: "বিভাগভিত্তিক বই" },
  { id: 2, icon: <FaUsers />, title: "আরামদায়ক পাঠক জোন" },
  { id: 3, icon: <FaLaptop />, title: "ডিজিটাল রিসোর্স" },
  { id: 4, icon: <FaClock />, title: "প্রশস্ত সময়সীমা" },
];

// Gallery images
const galleryImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581091215366-5ce476b7aa99?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092334603-61b3f022f5c2?auto=format&fit=crop&w=800&q=80",
];

const Librarypage = () => {
  const stats = [
    { id: 1, icon: <FaBook />, number: 10000, label: "বই" },
    { id: 2, icon: <FaLaptop />, number: 500, label: "ডিজিটাল রিসোর্স" },
    { id: 3, icon: <FaUsers />, number: 200, label: "পাঠক আসন" },
    { id: 4, icon: <FaClock />, number: 24, label: "সেবা ঘণ্টা" },
  ];

  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">

      {/* Glow Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/20 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-28">

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
            alt="Library"
            className="w-full h-[450px] object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10 text-center">
            <h1 className="text-5xl font-bold text-cyan-400 mb-6">
              আমাদের গ্রন্থাগার
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              শিক্ষার্থীদের জন্য আধুনিক সুবিধাসম্পন্ন গ্রন্থাগার। এখানে রয়েছে প্রচুর বই, ডিজিটাল রিসোর্স এবং পড়ার জন্য শান্ত ও আরামদায়ক পরিবেশ।
            </p>
          </div>
        </div>

        {/* Library Description */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">গ্রন্থাগারের বিবরণ</h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            আমাদের গ্রন্থাগার শিক্ষার্থীদের জ্ঞানার্জনের জন্য একটি আধুনিক এবং সম্পূর্ণ পরিবেশ প্রদান করে। এখানে বিভিন্ন বিষয়ের বই, ই-বুক, জার্নাল এবং রিসোর্স রয়েছে। শিক্ষার্থীরা সহজে পড়াশোনা করতে পারে, প্রজেক্ট ও গবেষণার জন্য প্রয়োজনীয় তথ্য পেতে পারে এবং একটি শান্ত পরিবেশে সময় কাটাতে পারে।
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {featureData.map((item) => (
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

        {/* Stats Section with Countdown */}
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 transition duration-500"
            >
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                <CountUp end={stat.number} duration={2} separator="," />
              </div>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">গ্রন্থাগার গ্যালারি</h2>
            <p className="text-gray-300">
              আমাদের গ্রন্থাগারের পরিবেশ এবং সুবিধাগুলি দেখুন।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Library ${index + 1}`}
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

export default Librarypage;
