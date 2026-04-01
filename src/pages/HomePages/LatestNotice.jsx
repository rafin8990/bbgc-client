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
      return res.data.slice(0, 3);
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white py-6 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-cyan-400/20 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
            Latest Notice
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Stay updated with our latest announcements
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : noticeData.length === 0 ? (
          <p className="text-center text-gray-400">No notice available</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {noticeData.map((notice) => (
              <div
                key={notice._id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition hover:-translate-y-2 duration-300"
              >
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 flex items-center justify-between">
                  <span>{notice.noticeTitle}</span>
                  {notice.file && (
                    <span className="text-cyan-400 text-sm bg-cyan-400/20 px-2 py-1 rounded-full ml-2">
                      📎
                    </span>
                  )}
                </h3>

                <p className="text-sm text-gray-300 line-clamp-3">
                  {notice.noticeDescription}
                </p>

                {/* File */}
                {notice.file && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 p-2 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                      <span className="text-cyan-400 text-sm">📄</span>
                      <div className="flex-1">
                        <p className="text-cyan-400 font-medium text-xs">
                          Attachment Available
                        </p>
                      </div>
                      <a
                        href={`${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:3000"
                        }${notice.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-cyan-400 text-black font-semibold rounded text-xs"
                      >
                        View
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
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

      {/* Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#050b1e] border border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                  NOTICE
                </span>

                <span className="text-xs text-cyan-400">
                  {selectedNotice.createdAt
                    ? new Date(
                        selectedNotice.createdAt
                      ).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {selectedNotice.noticeTitle}
              </h2>

              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                {selectedNotice.noticeDescription}
              </div>

              {selectedNotice.file && (
                <div className="mt-4 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 text-2xl">📄</span>
                    <div className="flex-1">
                      <h3 className="text-cyan-400 font-semibold">
                        Document Attachment
                      </h3>
                    </div>
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL ||
                        "http://localhost:3000"
                      }${selectedNotice.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded-lg"
                    >
                      📥 Download/View
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestNotice;