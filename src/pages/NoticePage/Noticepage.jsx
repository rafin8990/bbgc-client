import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt } from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";

const Noticepage = () => {
  const axiosSecure = useAxiossecure();
  const [selectedNotice, setSelectedNotice] = useState(null); // For modal

  // Fetch notices
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notice");
      return res.data;
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen py-16">
      {/* Glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[140px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-400/20 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Page Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          📢 All Notices
        </h1>

        {/* Notice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-center text-gray-400 col-span-full">Loading...</p>
          ) : notices.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No notices available.
            </p>
          ) : (
            notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform"
              >
                {/* Title */}
                <h2 className="text-lg font-semibold text-cyan-400 mb-2 line-clamp-2">
                  {notice.noticeTitle}
                </h2>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <FaCalendarAlt />
                  {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleDateString()
                    : ""}
                </div>

                {/* Description Preview */}
                <p className="text-gray-300 line-clamp-3 mb-4">
                  {notice.noticeDescription}
                </p>

                {/* বিস্তারিত Button */}
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="mt-auto px-4 py-2 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-500 transition"
                >
                  বিস্তারিত
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[#0a132d] w-full max-w-2xl mx-4 rounded-xl overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>

              {/* Modal Content */}
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                  {selectedNotice.noticeTitle}
                </h2>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <FaCalendarAlt />
                  {selectedNotice.createdAt
                    ? new Date(selectedNotice.createdAt).toLocaleDateString()
                    : ""}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {selectedNotice.noticeDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Noticepage;
