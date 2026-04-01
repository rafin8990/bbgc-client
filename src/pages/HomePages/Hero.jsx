import { motion } from "framer-motion";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Hero = () => {
  const axiosSecure = useAxiossecure();
  const swiperRef = useRef(null);

  const { data: notices } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notice");
      return res.data;
    },
  });

  const { data: chairmanData } = useQuery({
    queryKey: ["chairman"],
    queryFn: async () => {
      const res = await axiosSecure.get("/chairmen");
      return res.data;
    },
  });
  const chairman = chairmanData?.[0];

  const { data: principalData } = useQuery({
    queryKey: ["principal"],
    queryFn: async () => {
      const res = await axiosSecure.get("/principal");
      return res.data;
    },
  });
  const principal = principalData?.[0];

  const {
    data: sliderImages = [],
    isLoading: sliderLoading,
    error: sliderError,
  } = useQuery({
    queryKey: ["slider"],
    queryFn: async () => {
      const res = await axiosSecure.get("/slider");
      return res.data;
    },
  });

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT */}
        <div className="lg:col-span-3 h-full flex flex-col gap-4">
          {principal && (
            <motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex-1 flex flex-col">
              <img
                src={
                  principal?.image
                    ? `${import.meta.env.VITE_API_URL}${principal.image}`
                    : "https://i.ibb.co/ZVxZp5k/user.png"
                }
                alt={principal?.name}
                className="w-full h-40 rounded-2xl mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{principal?.name}</h3>
              <p className="text-sm text-cyan-400">
                {principal?.designation}
              </p>
            </motion.div>
          )}

          {chairman && (
            <motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex-1 flex flex-col">
              <img
                src={
                  chairman?.image
                    ? `${import.meta.env.VITE_API_URL}${chairman.image}`
                    : "https://i.ibb.co/ZVxZp5k/user.png"
                }
                alt={chairman?.name}
                className="w-full h-40 rounded-2xl mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{chairman?.name}</h3>
              <p className="text-sm text-cyan-400">
                {chairman?.designation}
              </p>
            </motion.div>
          )}
        </div>

        {/* CENTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 h-full rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5"
        >
          <div className="h-full min-h-[420px] relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={sliderImages.length > 1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="h-full"
            >
              {sliderLoading ? (
                <SwiperSlide>
                  <div className="h-full flex items-center justify-center">
                    Loading...
                  </div>
                </SwiperSlide>
              ) : sliderError ? (
                <SwiperSlide>
                  <div className="h-full flex items-center justify-center">
                    Failed to load
                  </div>
                </SwiperSlide>
              ) : (
                sliderImages.map((slide) => (
                  <SwiperSlide key={slide._id}>
                    <div className="relative h-full">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${slide.image}`}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-8">
                        <h1 className="text-4xl font-bold text-center px-8">
                          {slide.title}
                        </h1>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>

            {/* Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center"
            >
              <FaChevronRight />
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <div className="lg:col-span-3 h-full">
          <motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
            <h3 className="px-5 py-4 bg-white/10 font-semibold">
              Latest Notices
            </h3>

            <ul className="divide-y divide-white/10 flex-1">
              {notices?.slice(0, 5)?.map((notice) => (
                <Link key={notice._id} to="/notice">
                  <li className="px-5 py-4 text-sm text-gray-300 hover:bg-white/5 transition">
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