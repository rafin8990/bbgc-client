import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";

const apiBase = import.meta.env.VITE_API_URL || "";

function formatDisplayDate(value) {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const Stuffpage = () => {
  const axiosSecure = useAxiossecure();
  const [positionFilter, setPositionFilter] = useState("");

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff", "public"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staff");
      return res.data;
    },
  });

  const positionOptions = useMemo(() => {
    const set = new Set();
    staff.forEach((s) => {
      const p = (s.position || "").trim();
      if (p) set.add(p);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [staff]);

  const filteredStaff = useMemo(() => {
    if (!positionFilter) return staff;
    return staff.filter(
      (s) => (s.position || "").trim() === positionFilter
    );
  }, [staff, positionFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-white">
        Loading staff...
      </div>
    );
  }

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-12 md:py-14 px-4">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-2 sm:px-0">
        {/* Heading (left) + glassy position dropdown (right) */}
        <header className="mb-10 md:mb-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 pb-8 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300">
                Our Staff
              </span>
            </h1>
            <div className="mt-2 h-0.5 w-14 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
            <p className="mt-3 max-w-xl text-sm text-gray-400 leading-relaxed">
              Administrative and support members who keep our campus running —
              filter by position to see a specific role.
            </p>
          </div>

          <div className="w-full shrink-0 lg:w-auto lg:min-w-[200px] lg:max-w-[220px] lg:pt-1">
            <label
              htmlFor="staff-position-filter"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200/70"
            >
              Filter by position
            </label>
            <div className="relative rounded-xl border border-white/20 bg-white/10 p-0.5 shadow-md shadow-cyan-500/5 backdrop-blur-xl ring-1 ring-white/10 transition hover:border-cyan-400/35 hover:bg-white/[0.14] focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/25">
              <select
                id="staff-position-filter"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="block w-full min-h-0 cursor-pointer appearance-none rounded-lg border-0 bg-transparent py-2 pl-3 pr-9 text-xs font-medium text-white outline-none"
              >
                <option value="" className="bg-slate-900 text-gray-100">
                  All positions
                </option>
                {positionOptions.map((pos) => (
                  <option key={pos} value={pos} className="bg-slate-900 text-gray-100">
                    {pos}
                  </option>
                ))}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-cyan-300/90"
                aria-hidden
              />
            </div>
            <p className="mt-2 text-right text-xs text-gray-500">
              {filteredStaff.length} of {staff.length} shown
            </p>
          </div>
        </header>

        {filteredStaff.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            No staff for this position.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className="relative group rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden transition hover:-translate-y-2 hover:border-cyan-400/40"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={
                      member.image
                        ? `${apiBase}${member.image}`
                        : "https://i.ibb.co/ZVxZp5k/user.png"
                    }
                    alt={member.name || "Staff"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-cyan-400 font-medium mt-1">
                    {member.position || "—"}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-300 text-left">
                    {member.joiningDate && (
                      <p>
                        <span className="text-gray-500">Joining: </span>
                        {formatDisplayDate(member.joiningDate)}
                      </p>
                    )}
                    {member.dateOfBirth && (
                      <p>
                        <span className="text-gray-500">Date of birth: </span>
                        {formatDisplayDate(member.dateOfBirth)}
                      </p>
                    )}
                    {member.age != null && member.age !== "" && (
                      <p>
                        <span className="text-gray-500">Age: </span>
                        {member.age}
                      </p>
                    )}
                    {member.phone && (
                      <p>
                        <span className="text-gray-500">Phone: </span>
                        {member.phone}
                      </p>
                    )}
                    {member.email && (
                      <p className="break-all">
                        <span className="text-gray-500">Email: </span>
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Stuffpage;
