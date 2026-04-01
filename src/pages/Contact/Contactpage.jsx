import React from "react";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapLocationDot,
} from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useAxiossecure from "../../Hooks/useAxiossecure";

const Contactpage = () => {
  const axiosSecure = useAxiossecure();
  const { data: contact, isLoading } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contact");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <section className="relative bg-[#050b1e] text-white overflow-hidden py-8 px-6">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-center py-16">
          <div className="loading loading-spinner loading-lg text-cyan-400"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-8 px-6">
      {/* ================= Glow Background ================= */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* ================= Header ================= */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <FaMapLocationDot className="text-cyan-400" />
            {contact?.title || "Contact Us"}
          </h1>
          <p className="text-gray-400 text-sm">
            {contact?.subtitle || "Get in touch with us anytime"}
          </p>
        </div>

        {/* ================= Cards ================= */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* ========= Address ========= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FaLocationDot className="text-cyan-400" />
              Address
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {contact?.address || "Address not available"}
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
                {contact?.web ? (
                  <a
                    href={contact.web.startsWith("http") ? contact.web : `https://${contact.web}`}
                    className="hover:text-cyan-400 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.web}
                  </a>
                ) : (
                  "Website not available"
                )}
              </li>
              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-cyan-400" />
                {contact?.email || "Email not available"}
              </li>
            </ul>
          </div>

          {/* ========= Phone ========= */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:shadow-cyan-500/20 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FaPhone className="text-cyan-400" />
              Contact Number
            </h3>
            <p className="text-gray-300 text-lg">{contact?.phone || "Phone not available"}</p>
          </div>
        </div>

        {/* ================= Map =================
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <iframe
            title="location"
            src={contact?.mapUrl || "https://www.google.com/maps?q=Mathiura%20West%20Para%20Beanibazar%20Sylhet&output=embed"}
            className="w-full h-[450px]"
            loading="lazy"
          />
        </div> */}
      </div>
    </section>
  );
};

export default Contactpage;
