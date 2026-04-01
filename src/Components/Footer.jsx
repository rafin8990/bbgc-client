import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa6";
import logo from '../assets/bbgclogo.jpeg'
import { useQuery } from '@tanstack/react-query';
import useAxiossecure from '../Hooks/useAxiossecure';

const Footer = () => {
  const axiosSecure = useAxiossecure();

  const { data: footerData, isLoading } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const res = await axiosSecure.get('/footer');
      return res.data;
    }
  });

  return (
    <footer className="relative bg-[#050b1e] text-white overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        
        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* About */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <img
              src={footerData?.about?.logo ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${footerData.about.logo}` : logo}
              alt="logo"
              className="w-16 h-16 rounded-full mb-4"
            />
            <p className="text-sm text-gray-300 leading-relaxed">
              {isLoading ? "Loading..." : (footerData?.about?.description || "শিক্ষা মানুষের মৌলিক অধিকার। সুশিক্ষিত জাতিই একটি উন্নত রাষ্ট্র গঠনের প্রধান ভিত্তি।")}
            </p>

            <div className="flex gap-3 mt-5">
              {footerData?.about?.socialLinks?.facebook && (
                <a
                  href={footerData.about.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <FaFacebookF />
                </a>
              )}
              {footerData?.about?.socialLinks?.instagram && (
                <a
                  href={footerData.about.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <FaInstagram />
                </a>
              )}
              {footerData?.about?.socialLinks?.youtube && (
                <a
                  href={footerData.about.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

          {/* Important Links */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Important Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {isLoading ? (
                <li>Loading...</li>
              ) : footerData?.importantLinks && footerData.importantLinks.length > 0 ? (
                footerData.importantLinks.map((link, i) => (
                  <li key={i}>
                    <a className="hover:text-cyan-400 transition" href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.title}
                    </a>
                  </li>
                ))
              ) : (
                [
                  "প্রাথমিক/ইবতেদায়ী ফলাফল",
                  "ই-বুক",
                  "শিক্ষক বাতায়ন",
                  "শিক্ষা মন্ত্রণালয়",
                ].map((item, i) => (
                  <li key={i}>
                    <a className="hover:text-cyan-400 transition" href="#">
                      {item}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Location */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="flex gap-3 text-sm text-gray-300">
              <FaLocationDot className="text-cyan-400 mt-1" />
              <p>
                {isLoading ? "Loading..." : (footerData?.location || "Mathiura West Para\nBeanibazar, Sylhet\nBangladesh")}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {footerData?.contact?.phone && (
                <li className="flex gap-3">
                  <FaPhone className="text-cyan-400" />
                  {footerData.contact.phone}
                </li>
              )}
              {footerData?.contact?.email && (
                <li className="flex gap-3">
                  <FaEnvelope className="text-cyan-400" />
                  {footerData.contact.email}
                </li>
              )}
              {footerData?.contact?.website && (
                <li className="flex gap-3">
                  <FaGlobe className="text-cyan-400" />
                  {footerData.contact.website}
                </li>
              )}
              {!footerData?.contact && !isLoading && (
                <>
                  <li className="flex gap-3">
                    <FaPhone className="text-cyan-400" />
                    01719739145
                  </li>
                  <li className="flex gap-3">
                    <FaEnvelope className="text-cyan-400" />
                    jumdm@gmail.com
                  </li>
                  <li className="flex gap-3">
                    <FaGlobe className="text-cyan-400" />
                    www.jumdm.edu.bd
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-6" />

        {/* Bottom */}
        <p className="text-center text-xs text-gray-400">
          {isLoading ? "Loading..." : (footerData?.copyright || "© 2026 Jannatul Ummah Girls Dakhil Madrasa ·")}
          {!isLoading && footerData?.copyright && (
            <span className="block mt-1 text-cyan-400">
              SoftEdge Technology LTD
            </span>
          )}
          {!footerData?.copyright && !isLoading && (
            <span className="block mt-1 text-cyan-400">
              SoftEdge Technology LTD
            </span>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
