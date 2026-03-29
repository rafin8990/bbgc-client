import { motion } from "framer-motion";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useRef } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Hero = () => {
  const axiosSecure = useAxiossecure();
  const swiperRef = useRef(null);

  // ================= Notices =================
  const { data: notices } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notice");
      return res.data;
    },
  });

  // ================= Chairman =================
  const { data: chairmanData } = useQuery({
    queryKey: ["chairman"],
    queryFn: async () => {
      const res = await axiosSecure.get("/chairmen");
      return res.data;
    },
  });
  const chairman = chairmanData?.[0];

  // ================= Principal =================
  const { data: principalData } = useQuery({
    queryKey: ["principal"],
    queryFn: async () => {
      const res = await axiosSecure.get("/principal");
      return res.data;
    },
  });
  const principal = principalData?.[0];

  // ================= Slider Images =================
  const { data: sliderImages = [] } = useQuery({
    queryKey: ["sliderPhotos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/photos");
      return res.data;
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[140px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-400/20 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid gap-8 lg:grid-cols-12">

        {/* LEFT: Authority Cards */}
        <div className="lg:col-span-3 space-y-6">
          {chairman && (
            <motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <img
                src={
                  chairman?.image
                    ? `${import.meta.env.VITE_API_URL}${chairman.image}`
                    : "https://i.ibb.co/ZVxZp5k/user.png"
                }
                alt={chairman?.name}
               className="w-35 h-35 mx-auto rounded-xl mb-4 object-cover border border-white/10 shadow-lg"
              />
              <h3 className="font-semibold">{chairman?.name}</h3>
              <p className="text-sm text-cyan-400">{chairman?.designation}</p>
            </motion.div>
          )}

          {principal && (
            <motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <img
                src={
                  principal?.image
                    ? `${import.meta.env.VITE_API_URL}${principal.image}`
                    : "https://i.ibb.co/ZVxZp5k/user.png"
                }
                alt={principal?.name}
               className="w-35 h-35 mx-auto rounded-xl mb-4 object-cover border border-white/10 shadow-lg"
              />
              <h3 className="font-semibold">{principal?.name}</h3>
              <p className="text-sm text-cyan-400">{principal?.designation}</p>
            </motion.div>
          )}
        </div>

        {/* CENTER: Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5"
        >
          <div className="h-[360px] relative group">

            {/* Swiper */}
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="h-full"
            >
              {sliderImages.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <div className="relative h-[360px]">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${slide.file}`}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-8">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                          {slide.title}
                        </h1>
                       
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Glass Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-5 top-1/2 -translate-y-1/2 
              w-12 h-12 rounded-full 
              bg-white/10 backdrop-blur-lg 
              border border-white/20 
              flex items-center justify-center 
              hover:bg-white/20 hover:scale-110 
              transition-all duration-300 
              shadow-lg"
            >
              <FaChevronLeft className="text-white text-lg" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-5 top-1/2 -translate-y-1/2 
              w-12 h-12 rounded-full 
              bg-white/10 backdrop-blur-lg 
              border border-white/20 
              flex items-center justify-center 
              hover:bg-white/20 hover:scale-110 
              transition-all duration-300 
              shadow-lg"
            >
              <FaChevronRight className="text-white text-lg" />
            </button>

          </div>

          {/* Footer Label */}
          <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md px-6 py-3 text-sm text-cyan-400">
            Achievement & Highlights
          </div>
        </motion.div>

        {/* RIGHT: Notices */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <h3 className="px-6 py-4 bg-white/10 font-semibold">
              Latest Notices
            </h3>

            <ul className="divide-y divide-white/10">
              {notices?.slice(0, 5)?.map((notice) => (
                <Link key={notice._id} to="/notice">
                  <li className="px-6 py-4 text-sm text-gray-300 hover:bg-white/5 cursor-pointer transition">
                    {notice.noticeTitle.slice(0, 60)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                </Link>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
