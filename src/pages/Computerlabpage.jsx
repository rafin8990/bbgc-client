import React, { useMemo } from "react";
import { FaDesktop, FaWifi, FaUsers, FaMicrochip } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

/**
 * Public page — data from GET /computer-lab (single MongoDB doc or null).
 * Matches server fields: heroTitle, heroSubtitle, heroImage, stats[], about*, gallery[], gallerySection*.
 */

const defaultStats = [
  { id: 1, icon: "desktop", title: "৪০+ কম্পিউটার" },
  { id: 2, icon: "wifi", title: "উচ্চ গতির ইন্টারনেট" },
  { id: 3, icon: "users", title: "৪৫ শিক্ষার্থীর ক্ষমতা" },
  { id: 4, icon: "microchip", title: "সর্বশেষ সফটওয়্যার" },
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
];

const iconByKey = {
  desktop: <FaDesktop />,
  wifi: <FaWifi />,
  users: <FaUsers />,
  microchip: <FaMicrochip />,
};

function resolveIcon(icon) {
  const key = String(icon ?? "desktop").toLowerCase().trim();
  return iconByKey[key] || iconByKey.desktop;
}

function imgUrl(path) {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const rel = trimmed.replace(/^\//, "");
  return `${base}/${rel}`;
}

const Computerlabpage = () => {
  const axiosSecure = useAxiossecure();

  const {
    data: raw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["computer-lab-public"],
    queryFn: async () => {
      const res = await axiosSecure.get("/computer-lab");
      return res.data ?? null;
    },
    staleTime: 60 * 1000,
  });

  const doc = raw && typeof raw === "object" ? raw : null;

  const content = useMemo(() => {
    const heroTitle = doc?.heroTitle || "আধুনিক কম্পিউটার ল্যাব";
    const heroSubtitle =
      doc?.heroSubtitle ||
      "উন্নত ডেস্কটপ সিস্টেম এবং উচ্চ গতির ইন্টারনেট দ্বারা সজ্জিত, যা শিক্ষার্থীদের হাতে-কলমে ডিজিটাল শেখার অভিজ্ঞতা নিশ্চিত করে।";
    const heroFallback =
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80";
    const heroImage =
      doc?.heroImage && imgUrl(doc.heroImage) ? imgUrl(doc.heroImage) : heroFallback;

    const statsList =
      Array.isArray(doc?.stats) && doc.stats.length > 0
        ? doc.stats.map((s, i) => ({
            id: i,
            icon: resolveIcon(s.icon),
            title: s.title ?? "",
          }))
        : defaultStats.map((s) => ({
            id: s.id,
            icon: resolveIcon(s.icon),
            title: s.title,
          }));

    const aboutTitle = doc?.aboutTitle || "ব্যবহারিক ও ডিজিটাল শিক্ষা";
    const aboutDescription =
      doc?.aboutDescription ||
      "আমাদের কম্পিউটার ল্যাব ICT শিক্ষা, প্রোগ্রামিং অনুশীলন, মাল্টিমিডিয়া শেখা এবং অনলাইন গবেষণা সমর্থন করে। শিক্ষার্থীরা হাতে-কলমে সেশনগুলির মাধ্যমে বাস্তব জ্ঞান অর্জন করে।";
    const aboutFallback =
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";
    const aboutImage =
      doc?.aboutImage && imgUrl(doc.aboutImage)
        ? imgUrl(doc.aboutImage)
        : aboutFallback;

    const galleryTitle = doc?.gallerySectionTitle || "ল্যাব গ্যালারি";
    const gallerySubtitle =
      doc?.gallerySectionSubtitle ||
      "আমাদের আধুনিক কম্পিউটার ল্যাবের একটি ঝলক।";

    const gallery =
      Array.isArray(doc?.gallery) && doc.gallery.length > 0
        ? doc.gallery.map((p) => imgUrl(p)).filter(Boolean)
        : defaultGallery;

    return {
      heroTitle,
      heroSubtitle,
      heroImage,
      statsList,
      aboutTitle,
      aboutDescription,
      aboutImage,
      galleryTitle,
      gallerySubtitle,
      gallery,
    };
  }, [doc]);

  if (isLoading) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
        <p className="text-gray-400 text-sm">কন্টেন্ট লোড হচ্ছে…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-300 text-center max-w-md">
          {error?.message || "ডেটা লোড করা যায়নি। সার্ভার চালু আছে কিনা দেখুন।"}
        </p>
        <button type="button" className="btn btn-outline btn-sm border-cyan-400 text-cyan-400" onClick={() => refetch()}>
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    statsList,
    aboutTitle,
    aboutDescription,
    aboutImage,
    galleryTitle,
    gallerySubtitle,
    gallery,
  } = content;

  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-[280px] sm:h-[360px] md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-[#050b1e]/60 flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 mb-4 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-gray-200 max-w-2xl text-sm sm:text-base leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>

        {/* Stats — API: stats[].title, stats[].icon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {statsList.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:-translate-y-1 transition duration-300"
            >
              <div className="text-3xl text-cyan-400 mb-3 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-base md:text-lg">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="space-y-5 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">
              {aboutTitle}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {aboutDescription}
            </p>
          </div>

          <div className="order-1 md:order-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={aboutImage}
              alt={aboutTitle}
              className="w-full h-[260px] sm:h-[320px] md:h-[350px] object-cover hover:scale-105 transition duration-700"
            />
          </div>
        </div>

        {/* Gallery — API: gallery[] paths, gallerySectionTitle/Subtitle */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{galleryTitle}</h2>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
              {gallerySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                <img
                  src={src}
                  alt={`${galleryTitle} ${index + 1}`}
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Computerlabpage;
