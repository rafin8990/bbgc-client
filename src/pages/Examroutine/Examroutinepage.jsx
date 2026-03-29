import React from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Examroutinepage = () => {
  const axiosSecure = useAxiossecure();

  const { data: examRoutineData = [], isLoading } = useQuery({
    queryKey: ["exam-routine"],
    queryFn: async () => {
      const res = await axiosSecure.get("/exam-routine");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#050b1e] text-white px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📝 Exam Routine</h1>

        {isLoading ? (
          <p className="text-gray-300 text-center">Loading exam routines...</p>
        ) : examRoutineData.length === 0 ? (
          <p className="text-gray-300 text-center">
            No exam routines found.
          </p>
        ) : (
          <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="grid gap-4 md:hidden">
              {examRoutineData.map((exam, i) => (
                <div
                  key={exam._id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-indigo-400 font-bold">
                      #{i + 1}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-rose-500/20 text-rose-300">
                      {exam.examName}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Class:</span>{" "}
                      <span className="font-medium">
                        {exam.className}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">Subject:</span>{" "}
                      <span className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-300">
                        {exam.subject}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">Date:</span>{" "}
                      📅 {exam.date}
                    </p>

                    <p>
                      <span className="text-gray-400">Time:</span>{" "}
                      ⏰ {exam.startTime} – {exam.endTime}
                    </p>

                    <p>
                      <span className="text-gray-400">Venue:</span>{" "}
                      🏫 {exam.venue}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP TABLE VIEW ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/30 shadow-2xl border-separate border-spacing-0">
                <thead>
                  <tr className="bg-white/10">
                    {[
                      "#",
                      "Exam",
                      "Class",
                      "Subject",
                      "Date",
                      "Time",
                      "Venue",
                    ].map((h, index) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-300 border-b border-white/20 ${
                          index !== 6
                            ? "border-r border-white/10"
                            : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {examRoutineData.map((exam, i) => (
                    <tr
                      key={exam._id}
                      className="hover:bg-white/10 transition-all duration-300"
                    >
                      <td className="px-6 py-4 font-semibold text-indigo-300 border-b border-r border-white/10">
                        {i + 1}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        <span className="px-3 py-1 text-xs rounded-full bg-rose-500/20 text-rose-300">
                          {exam.examName}
                        </span>
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        {exam.className}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300">
                          {exam.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        📅 {exam.date}
                      </td>

                      <td className="px-6 py-4 text-sm border-b border-r border-white/10">
                        ⏰ {exam.startTime} – {exam.endTime}
                      </td>

                      <td className="px-6 py-4 border-b border-white/10">
                        🏫 {exam.venue}
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

export default Examroutinepage;
