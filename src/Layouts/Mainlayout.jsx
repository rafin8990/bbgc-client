import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import logo from "../assets/bbgclogo.jpeg";
import Marquee from "react-fast-marquee";
import NoticeMarquee from "../Components/NoticeMarquee";
import { useQuery } from "@tanstack/react-query";
import useAxiossecure from "../Hooks/useAxiossecure";

const Mainlayout = () => {
  const axiosSecure = useAxiossecure();

  const { data: headerData, isLoading: headerLoading } = useQuery({
    queryKey: ["header"],
    queryFn: async () => {
      const res = await axiosSecure.get("/header");
      return res.data;
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b1e] text-white">
      <header>
        <div className="relative w-full overflow-hidden bg-[#050b1e]">
          {/* Glow effects */}
          <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-blue-600/30 blur-[140px]" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 md:w-[420px] md:h-[420px] bg-cyan-400/20 blur-[160px]" />

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center">
            {/* Glass Card */}
            <div
              className="
                w-full max-w-7xl
                flex flex-col sm:flex-row
                items-center sm:items-start
                gap-4 sm:gap-6 lg:gap-8
                backdrop-blur-xl bg-white/10
                border border-white/20
                rounded-2xl
                px-4 sm:px-6 md:px-8 lg:px-10
                py-3 sm:py-4 lg:py-5
                shadow-xl
                overflow-hidden
              "
            >
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full bg-white/20 grid place-items-center shrink-0">
                <img
                  src={
                    headerData?.image
                      ? `${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:3000"
                        }${headerData.image}`
                      : logo
                  }
                  alt="logo"
                  className="w-full h-full object-contain rounded-full transition-opacity duration-300"
                  onError={(e) => {
                    e.target.src = logo;
                  }}
                />
              </div>

              {/* Text */}
              <div className="text-white text-center sm:text-left flex-1 min-w-0">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-wide leading-tight mb-2 break-words">
                  {headerLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    headerData?.title || "BEANIBAZAR GOVERNMENT COLLEGE"
                  )}
                </h1>

                <div className="space-y-1">
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed break-words">
                    {headerLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <>
                        {headerData?.description ||
                          "BEANIBAZAR GOVT. COLLEGE"}
                        {headerData?.establishmentDate && (
                          <span className="text-cyan-300 font-medium">
                            {" "}
                            - {headerData.establishmentDate}
                          </span>
                        )}
                      </>
                    )}
                  </p>

                  <p className="text-xs sm:text-sm md:text-base text-gray-400 break-words">
                    {headerLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      headerData?.location ||
                      "Beanibazar, Sylhet, Bangladesh"
                    )}
                  </p>

                  {headerData?.einNumber && !headerLoading && (
                    <p className="text-xs sm:text-sm md:text-base">
                      <span className="text-cyan-300 font-medium">
                        EIIN: {headerData.einNumber}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <Navbar />
      </header>

      <main>
        <NoticeMarquee />
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>

      <Marquee />
    </div>
  );
};

export default Mainlayout;