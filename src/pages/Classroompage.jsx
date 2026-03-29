import React from "react";
import { FaUsers, FaFan } from "react-icons/fa";

const classroomData = [
  {
    id: 1,
    title: "সিনিয়র ক্লাসরুম",
    description:
      "আমাদের সিনিয়র ক্লাসরুমগুলো আধুনিক বসার ব্যবস্থা, ডিজিটাল বোর্ড এবং পর্যাপ্ত আলোসহ শিক্ষার্থীদের একটি মনোযোগী ও আরামদায়ক শেখার পরিবেশ প্রদান করে।",
    students: "৭০ শিক্ষার্থীর ক্ষমতা",
    facilities: ["ডিজিটাল বোর্ড", "প্রজেক্টর", "সিলিং ফ্যান", "সাউন্ড সিস্টেম"],
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350",
  },
  {
    id: 2,
    title: "জুনিয়র ক্লাসরুম",
    description:
      "প্রাকৃতিকভাবে ভালভাবে বাতানুকূলিত জুনিয়র ক্লাসরুম যা শিক্ষার্থীদের জন্য স্বাস্থ্যকর এবং আকর্ষণীয় পরিবেশ তৈরি করে।",
    students: "৬০ শিক্ষার্থীর ক্ষমতা",
    facilities: ["হোয়াইটবোর্ড", "প্রাকৃতিক আলো", "আরামদায়ক বেঞ্চ", "ফ্যান"],
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754",
  },
  {
    id: 3,
    title: "স্মার্ট ক্লাসরুম",
    description:
      "প্রযুক্তি-সক্ষম স্মার্ট ক্লাসরুম, মাল্টিমিডিয়া প্রজেক্টর এবং ইন্টারেক্টিভ বোর্ড দ্বারা শিক্ষার্থীদের ডিজিটাল শেখার অভিজ্ঞতা বৃদ্ধি করে।",
    students: "৬৫ শিক্ষার্থীর ক্ষমতা",
    facilities: ["ইন্টারেক্টিভ বোর্ড", "মাল্টিমিডিয়া প্রজেক্টর", "WiFi", "অডিও সিস্টেম"],
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  },
];

const Classroompage = () => {
  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">
      
      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-28">

        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            আমাদের ক্লাসরুম
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            আমাদের ক্লাসরুমগুলো আধুনিক, প্রশস্ত এবং সুষ্ঠুভাবে সজ্জিত, যা শিক্ষার্থীদের আরামদায়ক এবং অনুপ্রাণিত শেখার পরিবেশ প্রদান করে।
          </p>
        </div>

        {/* Classroom Sections */}
        {classroomData.map((room, index) => (
          <div
            key={room.id}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            
            {/* Image */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-[350px] object-cover hover:scale-105 transition duration-700"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              
              <h2 className="text-3xl font-bold text-cyan-400">
                {room.title}
              </h2>

              <p className="text-gray-300 leading-relaxed">
                {room.description}
              </p>

              <div className="flex items-center gap-3 text-cyan-400">
                <FaUsers />
                <span>{room.students}</span>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">
                  সুবিধাসমূহ:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-gray-300">
                  {room.facilities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FaFan className="text-cyan-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Gallery Section */}
        <div className="pt-10">
          
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ক্লাসরুম গ্যালারি
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              আমাদের সুসজ্জিত এবং শিক্ষার্থী-বান্ধব ক্লাসরুমের একটি ঝলক।
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            
            {[
              "https://images.unsplash.com/photo-1588072432836-e10032774350",
              "https://images.unsplash.com/photo-1577896851231-70ef18881754",
              "https://images.unsplash.com/photo-1509062522246-3755977927d7",
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
              "https://images.unsplash.com/photo-1562774053-701939374585",
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"
            ].map((img, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={img}
                    alt={`ক্লাসরুম ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Classroompage;
