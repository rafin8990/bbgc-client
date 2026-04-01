import React from "react";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Atglancepage = () => {
  const axiosSecure = useAxiossecure();

  // 🔥 SAME as your admin page
  const backendURL = "http://localhost:3000";

  const { data: glanceData = [], isLoading } = useQuery({
    queryKey: ["glance"],
    queryFn: async () => {
      const res = await axiosSecure.get("/glance");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#050b1e] text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-8">
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            At a <span className="text-cyan-400">Glance</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto leading-relaxed">
            Quick highlights and important insights about our institution.
          </p>
        </div>

        {/* Cards */}
        {/* Cards */}
<div className="space-y-10">
  {glanceData.map((item, index) => (
    <div
      key={item._id}
      className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-blue-600/20 blur-xl -z-10" />

      {/* GRID layout (better than flex) */}
      <div
        className={`grid md:grid-cols-2 items-stretch ${
          index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Image */}
        <div className="h-[260px] md:h-full">
          <img
            src={
              item.image
                ? `${backendURL}${item.image}`
                : "/placeholder.png"
            }
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {item.title}
          </h2>

          <p className="text-gray-300 text-justify leading-relaxed text-sm md:text-base">
            {item.description}
          </p>

          <div className="mt-6 h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" />
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default Atglancepage;
