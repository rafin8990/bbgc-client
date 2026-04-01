import React, { useState } from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaCalendar } from "react-icons/fa";

const Achievementspage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const axiosSecure = useAxiossecure();

  const { data: achievementsData = [], isLoading } = useQuery({
    queryKey: ["achievements", activeCategory],
    queryFn: async () => {
      const url =
        activeCategory === "all"
          ? "/achievements"
          : `/achievements?category=${activeCategory}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden pt-2 pb-10">
      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30  blur-[120px]" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-0 pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-gray-400 text-sm mt-2">
              Celebrating our academic, sports & co-curricular successes
            </p>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-3">
            {["all", "academic", "sports", "curricular"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full border transition
                  ${
                    activeCategory === cat
                      ? "bg-cyan-500 text-black border-cyan-400"
                      : "border-white/20 hover:bg-white/10"
                  }`}
              >
                {cat === "all"
                  ? "All"
                  : cat === "academic"
                  ? "Academic"
                  : cat === "sports"
                  ? "Sports"
                  : "Co-curricular"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : achievementsData.length === 0 ? (
          <p className="text-center text-gray-400">
            No achievements available
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {achievementsData.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-48 mb-4 overflow-hidden rounded-xl relative">
                    <img
  src={`${import.meta.env.VITE_API_URL}${item.image}`}
  alt={item.title}
  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
/>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b1e]/70 to-transparent" />
                  </div>
                )}

                <span className="inline-block mb-3 px-3 py-1 text-xs rounded-full bg-cyan-400/20 text-cyan-400">
                  {item.category?.toUpperCase()}
                </span>

                <h3 className="text-lg font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-300 line-clamp-4">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  {item.createdAt && (
                    <span className="text-xs text-gray-400">
                      📅 {item.createdAt}
                    </span>
                  )}
                  <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                    Read more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#050b1e] border border-white/10 shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-400 hover:text-black transition"
            >
              ✕
            </button>

            {/* Image */}
            {selectedItem.image && (
              <div className="h-64 overflow-hidden rounded-t-2xl">
               <img
  src={`${import.meta.env.VITE_API_URL}${selectedItem.image}`}
  alt={selectedItem.title}
  className="w-full h-full object-cover"
/>

              </div>
            )}

            {/* Modal Content */}
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                  {selectedItem.category?.toUpperCase()}
                </span>

                {selectedItem.createdAt && (
                  <span className="text-xs flex items-center text-cyan-400">
                    <FaCalendar className="mr-2" />
                    {selectedItem.createdAt}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold">
                {selectedItem.title}
              </h2>

              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Achievementspage;
