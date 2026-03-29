import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiossecure from "../../Hooks/useAxiossecure";

const Teacherspage = () => {
  const axiosSecure = useAxiossecure();

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/teacher");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-white">
        Loading teachers...
      </div>
    );
  }

  return (
    <section className="relative bg-[#050b1e] overflow-hidden py-20 px-4">
      {/* Glow background (same as footer) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Our Honorable Teachers
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Meet our experienced and dedicated teachers who guide students
            towards success.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="relative group rounded-2xl 
              backdrop-blur-xl bg-white/5 
              border border-white/10 
              overflow-hidden
              transition hover:-translate-y-2 hover:border-cyan-400/40"
            >
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img
          src={
            teacher.image
              ? `${import.meta.env.VITE_API_URL}${teacher.image}`
              : "https://i.ibb.co/ZVxZp5k/user.png"
          }
          alt={teacher.name || "Teacher"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white">
                  {teacher.name}
                </h3>

                <p className="text-sm text-cyan-400 font-medium mt-1">
                  {teacher.designation}
                </p>

                {teacher.subject && (
                  <p className="mt-2 text-sm text-gray-300">
                    Subject: {teacher.subject}
                  </p>
                )}
              </div>

              {/* Subtle glass shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teacherspage;
