import React from "react";
import { FaFlask, FaMicroscope, FaAtom, FaShieldAlt } from "react-icons/fa";

// Feature cards
const featureData = [
  {
    id: 1,
    icon: <FaFlask />,
    title: "রসায়ন পরীক্ষা",
    desc: "সম্পূর্ণ রসায়ন যন্ত্রপাতি এবং পরীক্ষার উপকরণ।"
  },
  {
    id: 2,
    icon: <FaMicroscope />,
    title: "জীববিজ্ঞান গবেষণা",
    desc: "উন্নত মাইক্রোস্কোপ এবং নমুনা পর্যবেক্ষণ সরঞ্জাম।"
  },
  {
    id: 3,
    icon: <FaAtom />,
    title: "ভৌত বিজ্ঞান যন্ত্রপাতি",
    desc: "পরিমাপ যন্ত্র এবং বৈদ্যুতিক পরীক্ষা কিট।"
  },
  {
    id: 4,
    icon: <FaShieldAlt />,
    title: "নিরাপত্তা ব্যবস্থা",
    desc: "উপযুক্ত ল্যাব নিরাপত্তা নির্দেশিকা এবং সুরক্ষা সরঞ্জাম।"
  }
];

// Gallery images (valid links)
const galleryImages = [
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581091012184-5c7c5b89a6e3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1602052577122-f73b9710adba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
];

// Hero and Overview Images
const heroImage = "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80";
const overviewImage = "https://images.unsplash.com/photo-1602052577122-f73b9710adba?auto=format&fit=crop&w=1200&q=80";

const Sciencelabpage = () => {
  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">

      {/* Glow Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/20 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-28">

        {/* Hero Section */}
        <div className="relative border border-white/10 overflow-hidden rounded-2xl">
          <img
            src={heroImage}
            alt="Science Lab"
            className="w-full h-[450px] object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h1 className="text-5xl font-bold text-cyan-400 mb-6">
              বিজ্ঞান ল্যাবরেটরি
            </h1>
            <p className="max-w-2xl text-gray-300 leading-relaxed">
              আমাদের বিজ্ঞান ল্যাবরেটরি শিক্ষার্থীদের পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানে হাতে-কলমে শেখার সুযোগ প্রদান করে। শিক্ষার্থীরা আধুনিক যন্ত্রপাতি ব্যবহার করে সুরক্ষিত পরিবেশে বাস্তব পরীক্ষা সম্পাদন করে।
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {featureData.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition duration-500"
            >
              <div className="text-3xl text-cyan-400 mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Lab Overview Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
            <img
              src={overviewImage}
              alt="Lab Equipment"
              className="w-full h-[400px] object-cover hover:scale-105 transition duration-700"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-400">
              বাস্তব শেখার পরিবেশ
            </h2>
            <p className="text-gray-300 leading-relaxed">
              শিক্ষার্থীরা তত্ত্বীয় শিক্ষা থেকে বের হয়ে বাস্তব পরীক্ষা পরিচালনা করে যা তাদের বিশ্লেষণাত্মক চিন্তা এবং বৈজ্ঞানিক ধারণা উন্নত করে। আমাদের ল্যাব পাঠ্যক্রম-ভিত্তিক ক্লাস এবং উন্নত পরীক্ষা সেশন সমর্থন করে।
            </p>

            <ul className="space-y-3 text-gray-300">
              <li>✔ আধুনিক ল্যাব বেঞ্চ</li>
              <li>✔ পর্যাপ্ত রাসায়নিক সংরক্ষণ ব্যবস্থা</li>
              <li>✔ বৈদ্যুতিক ও পদার্থবিজ্ঞান যন্ত্রপাতি</li>
              <li>✔ পরিষ্কার এবং ভালো বায়ুচলাচলযুক্ত কর্মস্থল</li>
            </ul>
          </div>

        </div>

        {/* Gallery Section */}
        <div className="space-y-12">

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              ল্যাবরেটরি গ্যালারি
            </h2>
            <p className="text-gray-300">
              আমাদের বিজ্ঞান ল্যাবের পরিবেশ এবং সুবিধাসমূহ দেখুন।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Science Lab ${index + 1}`}
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

export default Sciencelabpage;
