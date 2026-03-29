import React from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Classroutinepage = () => {
  const axiosSecure = useAxiossecure();

  const { data: routineData = [], isLoading } = useQuery({
    queryKey: ["routine"],
    queryFn: async () => {
      const res = await axiosSecure.get("/routine");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#050b1e] text-white px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📚 Class Routine</h1>

        {isLoading ? (
          <p className="text-gray-300 text-center">Loading routines...</p>
        ) : routineData.length === 0 ? (
          <p className="text-gray-300 text-center">No routines found.</p>
        ) : (
          <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="grid gap-4 md:hidden">
              {routineData.map((routine, i) => (
                <div
                  key={routine._id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-indigo-400 font-bold">
                      #{i + 1}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      {routine.day}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Class:</span>{" "}
                      <span className="font-medium">{routine.className}</span>
                    </p>

                    <p>
                      <span className="text-gray-400">Section:</span>{" "}
                      <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">
                        {routine.section}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">Time:</span>{" "}
                      ⏰ {routine.startTime} – {routine.endTime}
                    </p>

                    <p>
                      <span className="text-gray-400">Subject:</span>{" "}
                      <span className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-300">
                        {routine.subject}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">Teacher:</span>{" "}
                      {routine.teacherName}
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
                      "Class",
                      "Section",
                      "Day",
                      "Time",
                      "Subject",
                      "Teacher",
                    ].map((h, index) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-300 border-b border-white/20 ${
                          index !== 6 ? "border-r border-white/10" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {routineData.map((routine, i) => (
                    <tr
                      key={routine._id}
                      className="hover:bg-white/10 transition-all duration-300"
                    >
                      <td className="px-6 py-4 font-semibold text-indigo-300 border-b border-r border-white/10">
                        {i + 1}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        {routine.className}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                          {routine.section}
                        </span>
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                          {routine.day}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm border-b border-r border-white/10">
                        ⏰ {routine.startTime} – {routine.endTime}
                      </td>

                      <td className="px-6 py-4 border-b border-r border-white/10">
                        <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300">
                          {routine.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4 border-b border-white/10">
                        {routine.teacherName}
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

export default Classroutinepage;
