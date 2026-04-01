import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaSchool, FaUsers, FaBook, FaAward } from "react-icons/fa";

const About = () => {
  const axiosSecure = useAxiossecure();

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const res = await axiosSecure.get("/about");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="bg-[#050b1e] text-white min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );

  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const imageUrl = aboutData?.image
    ? `${API_URL}/${aboutData.image.replace(/^\//, "")}`
    : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";

  const stats =
    aboutData?.stats && aboutData.stats.length > 0
      ? aboutData.stats.map((stat) => ({
          icon: <FaSchool />,
          end: parseInt(stat.value) || 0,
          suffix: stat.icon || "",
          label: stat.label || "",
        }))
      : [
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
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-6 px-6">
      {/* Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-cyan-400/20 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-3">
            {aboutData?.aboutTitle || "About Our Institution"}
          </h1>
          <p className="text-gray-400">
            {aboutData?.aboutSubtitle ||
              "Excellence in Islamic & Modern Education"}
          </p>
        </div>

        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Image */}
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
              className="w-full h-[360px] object-cover"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              {aboutData?.title || "Our History"}
            </h2>

            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {aboutData?.content ||
                "Our institution has been dedicated to providing quality education with strong moral values."}
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition duration-300"
            >
              <div className="text-4xl text-cyan-400 mb-3 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-white">
                <CountUp
                  start={0}
                  end={item.end}
                  duration={2.5}
                  suffix={item.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </h3>

              <p className="text-gray-400 text-sm mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;