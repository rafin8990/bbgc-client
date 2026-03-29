import React, { useState } from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaBullseye, FaEye } from "react-icons/fa";

const MissionVisionpage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const axiosSecure = useAxiossecure();

  const { data: missionData = [], isLoading } = useQuery({
    queryKey: ["mission", activeCategory],
    queryFn: async () => {
      const url = activeCategory
        ? `/mission?category=${activeCategory}`
        : "/mission";
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const categories = [
    { name: "mission", icon: <FaBullseye /> },
    { name: "vision", icon: <FaEye /> },
  ];

  return (
    <section className="relative bg-[#050b1e] text-white min-h-screen overflow-hidden">
      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-14">
          <div>
            <h1 className="text-3xl font-bold">Mission & Vision</h1>
            <p className="text-gray-400 text-sm mt-2">
              Learn about our core Mission and Vision
            </p>
          </div>

        
         {/* Category Buttons */}
<div className="flex flex-wrap gap-3 mt-4 md:mt-0">
  {categories.map((cat) => (
    <button
      key={cat.name}
      onClick={() => setActiveCategory(cat.name)}
      className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border font-medium text-sm transition
        ${
          activeCategory === cat.name
            ? "bg-cyan-500 text-black border-cyan-400"
            : "border-white/20 hover:bg-white/10"
        }`}
    >
      {cat.icon} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
    </button>
  ))}
</div>

        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : missionData.length === 0 ? (
          <p className="text-center text-gray-400">No data available</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {missionData.map((item) => (
              <div
                key={item._id}
                className={`group relative cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/40 transition shadow-2xl`}
              >
                {/* Card Header */}
                <div className="p-6 flex flex-col h-full">
                  <span className="inline-block w-fit text-xs mb-3 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                    {item.category.toUpperCase()}
                  </span>

                  <h3 className="text-lg font-semibold mb-3 leading-snug">
                    {item.title}
                  </h3>

                  {/* Full description */}
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    {item.createdAt && (
                      <span className="text-xs text-gray-400">
                        📅 {item.createdAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionVisionpage;
