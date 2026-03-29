import { useQuery } from "@tanstack/react-query";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";

const Chairmenpage = () => {
  const axiosSecure = useAxiossecure();

  const { data: chairmen = [], isLoading } = useQuery({
    queryKey: ["chairmen"],
    queryFn: async () => {
      const res = await axiosSecure.get("/chairmen");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10 text-gray-300">Loading...</p>;
  }

  if (!chairmen.length) {
    return (
      <p className="text-center py-10 text-gray-400">
        No chairman data found
      </p>
    );
  }

  return (
    <section className="relative bg-[#050b1e] overflow-hidden">
      {/* Glow background (same as footer) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Message from the Vice Principal
        </h2>

        {chairmen.map((chairman) => (
          <div
            key={chairman._id}
            className="
              grid md:grid-cols-3 gap-10 
              backdrop-blur-xl bg-white/5 
              border border-white/10 
              rounded-3xl p-10
              shadow-lg
            "
          >
            {/* Image */}
            <div className="flex justify-center">
             <img
  src={`${import.meta.env.VITE_API_URL}${chairman.image}`} // ← fix here
  alt={chairman.name}
  className="
    w-60 h-60 object-cover rounded-2xl
    border border-white/20
  "
/>

            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-5">
              <div>
                <h3 className="text-3xl font-semibold text-white">
                  {chairman.name}
                </h3>
                <p className="text-cyan-400 text-sm tracking-wide mt-1">
                  {chairman.designation}
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed text-justify">
                {chairman.message}
              </p>

              {/* Social Links */}
              <div className="flex gap-4 pt-6 text-lg">
                {chairman.facebook && (
                  <a
                    href={chairman.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-10 h-10 grid place-items-center
                      rounded-full border border-white/20
                      text-white
                      hover:bg-cyan-400 hover:text-black
                      transition
                    "
                  >
                    <FaFacebook />
                  </a>
                )}

                {chairman.instagram && (
                  <a
                    href={chairman.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-10 h-10 grid place-items-center
                      rounded-full border border-white/20
                      text-white
                      hover:bg-cyan-400 hover:text-black
                      transition
                    "
                  >
                    <FaInstagram />
                  </a>
                )}

                {chairman.youtube && (
                  <a
                    href={chairman.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-10 h-10 grid place-items-center
                      rounded-full border border-white/20
                      text-white
                      hover:bg-cyan-400 hover:text-black
                      transition
                    "
                  >
                    <FaYoutube />
                  </a>
                )}

                {chairman.twitter && (
                  <a
                    href={chairman.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-10 h-10 grid place-items-center
                      rounded-full border border-white/20
                      text-white
                      hover:bg-cyan-400 hover:text-black
                      transition
                    "
                  >
                    <FaTwitter />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Chairmenpage;
