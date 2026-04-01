import React, { useState } from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaPlay, FaTimes, FaVideo } from "react-icons/fa";

const Videopage = () => {
  const axiosSecure = useAxiossecure();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  /* ================= FETCH ================= */
  const { data: videoData = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/videos");
      return res.data;
    },
  });

  return (
    <section className="relative min-h-screen bg-[#050b1e] text-white overflow-hidden py-12 md:py-14 px-6">
      {/* ================= Glow Background ================= */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <FaVideo className="text-cyan-400" />
            Video Gallery
          </h1>
          <p className="text-gray-400 text-sm">
            Watch our events & activities
          </p>
        </div>

        {/* ================= Loading ================= */}
        {isLoading && (
          <p className="text-center text-gray-400 mt-6">Loading videos...</p>
        )}

        {/* ================= Grid ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {videoData.map((video) => (
            <div
              key={video._id}
              onClick={() => setSelectedVideo(video)}
              className="
                group cursor-pointer relative
                rounded-3xl overflow-hidden
                backdrop-blur-xl bg-white/5
                border border-white/10
                shadow-xl
                hover:-translate-y-2
                hover:shadow-cyan-500/30
                transition-all duration-500
              "
            >
              {/* ========= Video Preview ========= */}
              <div className="relative h-60 overflow-hidden">
                <video
                  src={`${API_URL}${video.file}`}
                  muted
                  loop
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-110
                    transition duration-700
                  "
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* glowing border */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-cyan-400/40 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

                {/* play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="
                      w-16 h-16 flex items-center justify-center
                      rounded-full
                      bg-cyan-500/20 backdrop-blur-md
                      border border-cyan-400/40
                      text-cyan-300
                      group-hover:scale-110
                      transition
                    "
                  >
                    <FaPlay size={20} />
                  </div>
                </div>

                {/* badge */}
                <span className="absolute top-3 left-3 text-xs bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  Video
                </span>
              </div>

              {/* ========= Info ========= */}
              <div className="p-5 text-center bg-gradient-to-b from-white/5 to-transparent">
                <h3 className="text-sm font-semibold text-gray-200 truncate group-hover:text-cyan-400 transition">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Click to watch</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
                GLASS MODAL PLAYER
      ================================================= */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
        >
          {/* glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

          {/* modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-5xl
              backdrop-blur-xl bg-white/5
              border border-white/10
              rounded-3xl
              p-6
              shadow-2xl
            "
          >
            {/* video */}
            <video
              src={`${API_URL}${selectedVideo.file}`}
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-xl"
            />

            {/* title */}
            <h3 className="text-center text-cyan-400 font-semibold mt-4 text-lg">
              {selectedVideo.title}
            </h3>

            {/* close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="
                absolute top-3 right-3
                w-10 h-10 flex items-center justify-center
                rounded-full
                border border-white/20
                hover:bg-white hover:text-black
                transition
              "
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Videopage;
