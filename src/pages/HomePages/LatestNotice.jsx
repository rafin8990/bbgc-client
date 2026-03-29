import React, { useState } from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt } from "react-icons/fa";

const LatestNotice = () => {
  const axiosSecure = useAxiossecure();
  const [selectedNotice, setSelectedNotice] = useState(null);

  const { data: noticeData = [], isLoading } = useQuery({
    queryKey: ["latest-notice"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notice");
      return res.data.slice(0, 3); // show only latest 6
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white py-20 px-6 overflow-hidden">

      {/* Glow Background (Same as Footer) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
            Latest Notice
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Stay updated with our latest announcements
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : noticeData.length === 0 ? (
          <p className="text-center text-gray-400">
            No notice available
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {noticeData.map((notice) => (
              <div
                key={notice._id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition hover:-translate-y-2 duration-300"
              >
                <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                  {notice.noticeTitle}
                </h3>

                <p className="text-sm text-gray-300 line-clamp-3">
                  {notice.noticeDescription}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <FaCalendarAlt />
                    {notice.createdAt
                      ? new Date(notice.createdAt).toLocaleDateString()
                      : ""}
                  </span>

                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-sm px-4 py-1 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition"
                  >
                    বিস্তারিত
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Modal ===== */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#050b1e] border border-white/10 shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="p-8 space-y-6">

              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                  NOTICE
                </span>

                <span className="text-xs text-cyan-400">
                  {selectedNotice.createdAt
                    ? new Date(selectedNotice.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {selectedNotice.noticeTitle}
              </h2>

              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                {selectedNotice.noticeDescription}
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestNotice;
