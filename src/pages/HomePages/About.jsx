import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaSchool, FaUsers, FaBook, FaAward } from "react-icons/fa";

const About = () => {
  const axiosSecure = useAxiossecure();

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/history");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="bg-[#050b1e] text-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const history = Array.isArray(historyData)
    ? historyData[0]
    : historyData;

  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const imageUrl = history?.image
    ? `${API_URL}/${history.image.replace(/^\//, "")}`
    : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";

  const stats = [
    {
      icon: <FaSchool />,
      end: 25,
      suffix: "+",
      label: "Experience",
    },
    {
      icon: <FaUsers />,
      end: 5000,
      suffix: "+",
      label: "Students",
    },
    {
      icon: <FaBook />,
      end: 50,
      suffix: "+",
      label: "Courses",
    },
    {
      icon: <FaAward />,
      end: 100,
      suffix: "%",
      label: "Success Rate",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#050b1e] text-white overflow-hidden py-20 px-6">

      {/* ===== Glow Background ===== */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto space-y-20">

        {/* ===== Header ===== */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
            About Our Institution
          </h1>
          <p className="text-gray-400">
            Excellence in Islamic & Modern Education
          </p>
        </div>

        {/* ===== About Section ===== */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
          >
            <img
              src={imageUrl}
              alt="Institution"
              className="w-full h-[420px] object-cover"
            />
          </motion.div>

          {/* Text Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10"
          >
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6">
              {history?.title || "Our History"}
            </h2>

            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {history?.content ||
                "Our institution has been dedicated to providing quality education with strong moral values."}
            </p>
          </motion.div>
        </div>

        {/* ===== Animated Stats Section ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition duration-300"
            >
              <div className="text-4xl text-cyan-400 mb-4 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-3xl font-bold text-white">
                <CountUp
                  start={0}
                  end={item.end}
                  duration={2.5}
                  suffix={item.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===== Bottom Message ===== */}
        <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl py-6 text-cyan-400 font-semibold">
          Join us and shape a brighter future together 🚀
        </div>

      </div>
    </section>
  );
};

export default About;
