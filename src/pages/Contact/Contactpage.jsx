import React from "react";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapLocationDot,
} from "react-icons/fa6";

const Contactpage = () => {
  return (
    <section className="relative min-h-screen bg-[#050b1e] text-white overflow-hidden py-20 px-6">
      {/* ================= Glow Background ================= */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <FaMapLocationDot className="text-cyan-400" />
            Contact Us
          </h1>
          <p className="text-gray-400 text-sm">
            Get in touch with us anytime
          </p>
        </div>

        {/* ================= Cards ================= */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-14">
          {/* ========= Address ========= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FaLocationDot className="text-cyan-400" />
              Institute Address
            </h3>

            <p className="text-gray-300 leading-relaxed">
              Mathiura West Para <br />
              Beanibazar, Sylhet <br />
              Bangladesh
            </p>
          </div>

          {/* ========= Web & Email ========= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FaGlobe className="text-cyan-400" />
              Web & Email
            </h3>

            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3 items-center">
                <FaGlobe className="text-cyan-400" />
                <a
                  href="https://www.jumdm.edu.bd/"
                  className="hover:text-cyan-400 transition"
                  target="_blank"
                >
                  www.jumdm.edu.bd
                </a>
              </li>

              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-cyan-400" />
                jumdm@gmail.com
              </li>
            </ul>
          </div>

          {/* ========= Phone ========= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FaPhone className="text-cyan-400" />
              Contact Number
            </h3>

            <p className="text-gray-300 text-lg">01719739145</p>
          </div>
        </div>

        {/* ================= Map ================= */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <iframe
            title="location"
            src="https://www.google.com/maps?q=Mathiura%20West%20Para%20Beanibazar%20Sylhet&output=embed"
            className="w-full h-[450px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Contactpage;
