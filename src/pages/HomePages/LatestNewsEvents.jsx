import React, { useState } from "react";
import { Link } from "react-router";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const LatestNewsEvents = () => {
  const axiosSecure = useAxiossecure();
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: newsData = [], isLoading } = useQuery({
    queryKey: ["latest-news-events"],
    queryFn: async () => {
      const newsRes = await axiosSecure.get("/news?category=news");
      const eventsRes = await axiosSecure.get("/news?category=events");

      // merge + sort latest first
      const combined = [...newsRes.data, ...eventsRes.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return combined.slice(0,3); // show only latest 6
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white py-8 px-6 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              Latest News & Events
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Discover our recent announcements & activities
            </p>
          </div>

          <Link
            to="/news-events"
            className="mt-6 md:mt-0 px-6 py-2 rounded-full bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition flex items-center gap-2"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : newsData.length === 0 ? (
          <p className="text-center text-gray-400">
            No news or events available
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {newsData.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/40 transition hover:-translate-y-2 duration-300"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b1e]/70 to-transparent" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col h-full">
                  <span className="inline-block w-fit text-xs mb-3 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                    {item.category?.toUpperCase()}
                  </span>

                  <h3 className="text-lg font-semibold mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-2">
                      <FaCalendarAlt />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </span>

                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                      Read more →
                    </span>
                  </div>
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

            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-400 hover:text-black transition"
            >
              ✕
            </button>

            {selectedItem.image && (
              <div className="h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={`${import.meta.env.VITE_API_URL}${selectedItem.image}`}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                  {selectedItem.category?.toUpperCase()}
                </span>

                <span className="text-xs text-cyan-400">
                  {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <h2 className="text-2xl font-bold leading-snug">
                {selectedItem.title}
              </h2>

              <div className="text-sm text-justify text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedItem.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestNewsEvents;
