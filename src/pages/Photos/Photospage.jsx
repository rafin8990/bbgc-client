import React, { useState } from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Photospage = () => {
  const axiosSecure = useAxiossecure();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  /* ================= FETCH ================= */
  const { data: photoData = [], isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/photos");
      return res.data;
    },
  });

  return (
    <section className="relative min-h-screen bg-[#050b1e] text-white overflow-hidden py-12 md:py-14 px-6">
      {/* ========= Glow background (same as footer) ========= */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ========= Header ========= */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl font-bold mb-3">📸 Photo Gallery</h1>
          <p className="text-gray-400 text-sm">
            Our memorable moments & activities
          </p>
        </div>

        {/* ========= Grid ========= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {photoData.map((photo) => (
            <div
              key={photo._id}
              onClick={() => setSelectedPhoto(photo)}
              className="
                cursor-pointer group relative
                backdrop-blur-xl bg-white/5
                border border-white/10
                rounded-2xl overflow-hidden
                hover:shadow-cyan-500/30
                transition duration-500
              "
            >
              <div className="h-60 overflow-hidden">
               <img
  src={`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}${photo.file}`}
  alt={photo.title}
  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
/>
              </div>

              <div className="p-4 text-center">
                <h3 className="text-sm text-gray-200 truncate">
                  {photo.title}
                </h3>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-cyan-400 font-semibold">View Photo</span>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <p className="text-center text-gray-400 mt-6">Loading photos...</p>
        )}
      </div>

      {/* =================================================
            FOOTER STYLE GLASS MODAL
      ================================================= */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
        >
          {/* glow lights */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

          {/* modal card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-5xl
              backdrop-blur-xl bg-white/5
              border border-white/10
              rounded-2xl
              p-6
              shadow-2xl
              animate-[fadeIn_.3s_ease]
            "
          >
            {/* image */}
            <img
              src={`http://localhost:3000${selectedPhoto.file}`}
              alt={selectedPhoto.title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            {/* title */}
            <h3 className="text-center text-cyan-400 font-semibold mt-4 text-lg">
              {selectedPhoto.title}
            </h3>

            {/* close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="
                absolute top-3 right-3
                w-9 h-9 rounded-full
                border border-white/20
                hover:bg-white hover:text-black
                transition
              "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Photospage;
