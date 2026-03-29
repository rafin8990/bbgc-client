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
const Footer = () => {
  return (
    <footer className="relative bg-[#050b1e] text-white overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        
        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* About */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 rounded-full mb-4"
            />
            <p className="text-sm text-gray-300 leading-relaxed">
              শিক্ষা মানুষের মৌলিক অধিকার। সুশিক্ষিত জাতিই একটি
              উন্নত রাষ্ট্র গঠনের প্রধান ভিত্তি।
            </p>

            <div className="flex gap-3 mt-5">
              {[FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 grid place-items-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Important Links */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Important Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
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
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="flex gap-3 text-sm text-gray-300">
              <FaLocationDot className="text-cyan-400 mt-1" />
              <p>
                Mathiura West Para <br />
                Beanibazar, Sylhet <br />
                Bangladesh
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
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
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Bottom */}
        <p className="text-center text-xs text-gray-400">
          © 2026 Jannatul Ummah Girls Dakhil Madrasa ·  
          <span className="text-cyan-400">
            {" "}Developed by Bangladesh Associate of IT Solution
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
