import React, { useMemo } from "react";
import { FaBook, FaUsers, FaLaptop, FaClock } from "react-icons/fa";
import CountUp from "react-countup";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

const defaultFeatures = [
  { id: 1, icon: "book", title: "বিভাগভিত্তিক বই" },
  { id: 2, icon: "users", title: "আরামদায়ক পাঠক জোন" },
  { id: 3, icon: "laptop", title: "ডিজিটাল রিসোর্স" },
  { id: 4, icon: "clock", title: "প্রশস্ত সময়সীমা" },
];

const defaultStats = [
  { id: 1, icon: "book", number: 10000, label: "বই" },
  { id: 2, icon: "laptop", number: 500, label: "ডিজিটাল রিসোর্স" },
  { id: 3, icon: "users", number: 200, label: "পাঠক আসন" },
  { id: 4, icon: "clock", number: 24, label: "সেবা ঘণ্টা" },
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581091215366-5ce476b7aa99?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092334603-61b3f022f5c2?auto=format&fit=crop&w=800&q=80",
];

const defaultHeroImage =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80";

const iconByKey = {
  book: <FaBook />,
  users: <FaUsers />,
  laptop: <FaLaptop />,
  clock: <FaClock />,
};

function normalizeDoc(payload) {
  if (payload == null || typeof payload !== "object") return null;
  if (Array.isArray(payload)) return null;
  if (payload instanceof Blob) return null;
  return payload;
}

function imgUrl(path) {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${API_BASE}/${trimmed.replace(/^\//, "")}`;
}

function queryErrorMessage(err) {
  if (!err) return "ডেটা লোড করা যায়নি।";
  const api = err.response?.data;
  if (typeof api === "string") return api;
  if (api?.message) return api.message;
  return err.message || "ডেটা লোড করা যায়নি।";
}

const Librarypage = () => {
  const axiosSecure = useAxiossecure();
  const { data: raw, isLoading, isError, error, refetch, isFetching } =
    useQuery({
      queryKey: ["library-page-public"],
      queryFn: async () => {
        const res = await axiosSecure.get("/library-page", {
          baseURL: API_BASE,
        });
        return normalizeDoc(res.data);
      },
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    });

  const doc = normalizeDoc(raw);

  const featureRows = useMemo(() => {
    const fromApi = doc?.features;
    if (!Array.isArray(fromApi) || fromApi.length === 0) return defaultFeatures;
    return fromApi.map((f, i) => ({
      id: i + 1,
      icon: String(f.icon ?? "book").toLowerCase().trim(),
      title: f.title || defaultFeatures[i]?.title || "",
    }));
  }, [doc]);

  const stats = useMemo(() => {
    const fromApi = doc?.libraryStats;
    if (!Array.isArray(fromApi) || fromApi.length === 0) return defaultStats;
    return fromApi.map((s, i) => ({
      id: i + 1,
      icon: String(s.icon ?? defaultStats[i]?.icon ?? "book")
        .toLowerCase()
        .trim(),
      number: Number(s.number) || 0,
      label: s.label || defaultStats[i]?.label || "",
    }));
  }, [doc]);

  const galleryImages = useMemo(() => {
    const g = doc?.gallery;
    if (!Array.isArray(g) || g.length === 0) return defaultGallery;
    const urls = g.map((p) => imgUrl(p)).filter(Boolean);
    return urls.length ? urls : defaultGallery;
  }, [doc]);

  const heroSrc = doc?.heroImage ? imgUrl(doc.heroImage) : defaultHeroImage;
  const heroTitle = doc?.heroTitle || "আমাদের গ্রন্থাগার";
  const heroSubtitle =
    doc?.heroSubtitle ||
    "শিক্ষার্থীদের জন্য আধুনিক সুবিধাসম্পন্ন গ্রন্থাগার। এখানে রয়েছে প্রচুর বই, ডিজিটাল রিসোর্স এবং পড়ার জন্য শান্ত ও আরামদায়ক পরিবেশ।";
  const descriptionTitle = doc?.descriptionTitle || "গ্রন্থাগারের বিবরণ";
  const descriptionParagraph =
    doc?.descriptionParagraph ||
    "আমাদের গ্রন্থাগার শিক্ষার্থীদের জ্ঞানার্জনের জন্য একটি আধুনিক এবং সম্পূর্ণ পরিবেশ প্রদান করে। এখানে বিভিন্ন বিষয়ের বই, ই-বুক, জার্নাল এবং রিসোর্স রয়েছে। শিক্ষার্থীরা সহজে পড়াশোনা করতে পারে, প্রজেক্ট ও গবেষণার জন্য প্রয়োজনীয় তথ্য পেতে পারে এবং একটি শান্ত পরিবেশে সময় কাটাতে পারে।";
  const gallerySectionTitle = doc?.gallerySectionTitle || "গ্রন্থাগার গ্যালারি";
  const gallerySectionSubtitle =
    doc?.gallerySectionSubtitle ||
    "আমাদের গ্রন্থাগারের পরিবেশ এবং সুবিধাগুলি দেখুন।";

  if (isLoading) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/20 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-28">
        {isError && (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100"
          >
            <p className="text-sm">
              সার্ভার থেকে গ্রন্থাগার ডেটা আনা যায়নি। নিচে ডিফল্ট বিষয়বস্তু দেখানো হচ্ছে।{" "}
              <span className="opacity-80">({queryErrorMessage(error)})</span>
            </p>
            <button
              type="button"
              className="btn btn-sm btn-outline border-amber-400/60 text-amber-100 hover:bg-amber-500/20 shrink-0"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "লোড হচ্ছে…" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        )}

        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
          <img
            src={heroSrc || defaultHeroImage}
            alt=""
            className="w-full h-[450px] object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b1e]/90 via-transparent to-[#050b1e]/30" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-6 drop-shadow-lg">
              {heroTitle}
            </h1>
            <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
              {heroSubtitle}
            </p>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">
            {descriptionTitle}
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
            {descriptionParagraph}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featureRows.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 hover:border-cyan-400/30 transition duration-500"
            >
              <div className="text-3xl text-cyan-400 mb-4 flex justify-center">
                {iconByKey[item.icon] || iconByKey.book}
              </div>
              <h3 className="font-semibold text-lg leading-snug">{item.title}</h3>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 hover:border-cyan-400/30 transition duration-500"
            >
              <div className="text-2xl text-cyan-400/90 mb-3 flex justify-center">
                {iconByKey[stat.icon] || iconByKey.book}
              </div>
              <div className="text-4xl font-bold text-cyan-400 mb-2 tabular-nums">
                <CountUp end={stat.number} duration={2} separator="," />
              </div>
              <p className="text-gray-300 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {gallerySectionTitle}
            </h2>
            <p className="text-gray-300">{gallerySectionSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {galleryImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="group rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <img
                  src={img}
                  alt={`${gallerySectionTitle} — ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Librarypage;
