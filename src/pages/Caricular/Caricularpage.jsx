import React from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Circularpage = () => {
  const axiosSecure = useAxiossecure();

  const { data: circularData = [], isLoading } = useQuery({
    queryKey: ["circular"],
    queryFn: async () => {
      const res = await axiosSecure.get("/circular");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#050b1e] text-white px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8">📢 Circulars</h1>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading circulars...</p>
        ) : circularData.length === 0 ? (
          <p className="text-center text-gray-400">No circulars found.</p>
        ) : (
          <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="grid gap-4 md:hidden">
              {circularData.map((item, i) => (
                <div
                  key={item._id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <p className="text-indigo-400 font-semibold mb-2">#{i + 1}</p>

                  <h3 className="font-semibold mb-3">{item.title}</h3>

                  <a
                    href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${item.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm bg-indigo-600 border-0 text-white"
                  >
                    View PDF
                  </a>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP TABLE VIEW ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/30 shadow-2xl border-separate border-spacing-0">

                {/* Table Head */}
                <thead>
                  <tr className="bg-white/10">
                    {["#", "Title", "PDF"].map((h, index) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-300 border-b border-white/20 ${
                          index !== 2 ? "border-r border-white/10" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {circularData.map((item, i) => (
                    <tr
                      key={item._id}
                      className="hover:bg-white/10 transition-all duration-300"
                    >
                      <td className="px-6 py-4 font-semibold text-indigo-300 border-b border-r border-white/10">
                        {i + 1}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        {item.title}
                      </td>

                      <td className="px-6 py-4 border-b border-white/10">
                        <a
                          href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${item.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition"
                        >
                          📄 View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Circularpage;
