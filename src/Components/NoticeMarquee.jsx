import Marquee from "react-fast-marquee";
import { FaBell } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const NoticeMarquee = () => {
  const axiosSecure = useAxiossecure();

  const { data: notices } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notice");
      return res.data;
    },
  });

  return (
    <section className="relative bg-[#050b1e] overflow-hidden py-6">
      
      {/* Glow effects (same as footer) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Container */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

          {/* Left Badge */}
          <div className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shrink-0">
            <FaBell className="animate-pulse" />
            <span>Notice</span>
          </div>

          {/* Marquee */}
          <Marquee
            speed={45}
            pauseOnHover
            gradient={false}
            className="py-4"
          >
            {notices?.map((notice) => (
              <div
                key={notice._id}
                className="flex items-center gap-4 mx-10 text-gray-200 hover:text-white transition"
              >
                {/* Icon */}
                <span className="w-8 h-8 grid place-items-center rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                  <FaBell />
                </span>

                {/* Text */}
                <span className="whitespace-nowrap text-sm md:text-base">
                  {notice.noticeDescription}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default NoticeMarquee;
