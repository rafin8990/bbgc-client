import React from "react";
import {
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaGlobeAsia,
} from "react-icons/fa";

const Whaystudypage = () => {
  const features = [
    {
      icon: <FaGraduationCap />,
      title: "উচ্চমানের শিক্ষা",
      desc: "আমরা আধুনিক পাঠ্যক্রম এবং অভিজ্ঞ শিক্ষকদের মাধ্যমে উচ্চমানের শিক্ষা প্রদান করি।",
    },
    {
      icon: <FaBookOpen />,
      title: "বিস্তৃত পাঠ্যক্রম",
      desc: "আমাদের বিস্তৃত পাঠ্যক্রম ছাত্রদের সামগ্রিক বিকাশে সহায়তা করে।",
    },
    {
      icon: <FaUsers />,
      title: "সহযোগী পরিবেশ",
      desc: "আমাদের প্রতিষ্ঠানে রয়েছে একটি বন্ধুত্বপূর্ণ এবং সহযোগী শিক্ষা পরিবেশ।",
    },
    {
      icon: <FaGlobeAsia />,
      title: "আন্তর্জাতিক সুযোগ",
      desc: "আমরা ছাত্রদের জন্য বিভিন্ন আন্তর্জাতিক সুযোগ-সুবিধা প্রদান করি।",
    },
  ];

  return (
    <section className="relative bg-[#050b1e] text-white min-h-screen overflow-hidden py-20 px-6">
      {/* ================= Glow Background ================= */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
            আমাদের প্রতিষ্ঠানে পড়াশোনা করার কারণ
          </h1>
          <p className="text-gray-400">
            আমাদের বিশেষ সুবিধাগুলো এক নজরে
          </p>
        </div>

        {/* ================= Cards ================= */}
        <div className="grid md:grid-cols-2 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 text-center hover:-translate-y-3 hover:shadow-cyan-500/20 transition duration-500"
            >
              {/* Icon */}
              <div className="text-5xl text-cyan-400 mb-6 flex justify-center group-hover:scale-110 transition">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>

              {/* Desc */}
              <p className="text-gray-300 leading-relaxed text-lg">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= Bottom Message ================= */}
        <div className="text-center mt-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl py-6 text-cyan-400 font-semibold text-lg">
          আমাদের প্রতিষ্ঠানে যোগ দিন এবং আপনার ভবিষ্যতকে উজ্জ্বল করুন!
        </div>
      </div>
    </section>
  );
};

export default Whaystudypage;
