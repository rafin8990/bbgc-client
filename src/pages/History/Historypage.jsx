import React from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Historypage = () => {
  const axiosSecure = useAxiossecure();

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/history");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-8">
      
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Our <span className="text-cyan-400">History</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto leading-relaxed">
            A journey of knowledge, values, and dedication that shaped our
            institution through the years.
          </p>
        </div>

        {/* History Card */}
        {historyData && (
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

            {/* Gradient Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-blue-600/20 blur-xl -z-10" />

            <div className="flex flex-col md:flex-row gap-10 items-center">
              
              {/* Image Left */}
              {historyData.image && (
                <div className="md:w-1/2 w-full overflow-hidden rounded-2xl group">
                 <img
  src={`${import.meta.env.VITE_API_URL}${historyData.image}`}
  alt="History"
  className="w-full h-[300px] md:h-[380px] object-cover rounded-2xl transform group-hover:scale-105 transition duration-700"
/>

                </div>
              )}

              {/* Text Right */}
              <div className="md:w-1/2 w-full">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  {historyData.title}
                </h2>

                <p className="text-gray-300 text-justify leading-relaxed text-sm md:text-base">
                  {historyData.content}
                </p>

                {/* Accent line */}
                <div className="mt-6 h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Historypage;
