import React, { useMemo } from "react";
import { FaFlask, FaMicroscope, FaAtom, FaShieldAlt } from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

/**
 * Public Science Lab — loads GET /science-lab (one MongoDB doc or null).
 * Maps API fields: heroTitle, heroSubtitle, heroImage,
 * features[{ title, desc, icon: flask|microscope|atom|shield }],
 * overviewTitle, overviewDescription, overviewImage, overviewBullets[],
 * gallerySectionTitle, gallerySectionSubtitle, gallery[] (paths or URLs).
 */

const defaultFeatures = [
  { id: 1, icon: "flask", title: "রসায়ন পরীক্ষা", desc: "সম্পূর্ণ রসায়ন যন্ত্রপাতি এবং পরীক্ষার উপকরণ।" },
  { id: 2, icon: "microscope", title: "জীববিজ্ঞান গবেষণা", desc: "উন্নত মাইক্রোস্কোপ এবং নমুনা পর্যবেক্ষণ সরঞ্জাম।" },
  { id: 3, icon: "atom", title: "ভৌত বিজ্ঞান যন্ত্রপাতি", desc: "পরিমাপ যন্ত্র এবং বৈদ্যুতিক পরীক্ষা কিট।" },
  { id: 4, icon: "shield", title: "নিরাপত্তা ব্যবস্থা", desc: "উপযুক্ত ল্যাব নিরাপত্তা নির্দেশিকা এবং সুরক্ষা সরঞ্জাম।" },
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581091012184-5c7c5b89a6e3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1602052577122-f73b9710adba?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
];

const iconByKey = {
  flask: <FaFlask />,
  microscope: <FaMicroscope />,
  atom: <FaAtom />,
  shield: <FaShieldAlt />,
};

function resolveIcon(icon) {
  const key = String(icon ?? "flask").toLowerCase().trim();
  return iconByKey[key] || iconByKey.flask;
}

function imgUrl(path) {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";
  return `${base}/${trimmed.replace(/^\//, "")}`;
}

function queryErrorMessage(err) {
  if (!err) return "ডেটা লোড করা যায়নি।";
  const api = err.response?.data;
  if (typeof api === "string") return api;
  if (api?.message) return api.message;
  return err.message || "ডেটা লোড করা যায়নি।";
}

const Sciencelabpage = () => {
  const axiosSecure = useAxiossecure();
  const { data: raw, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["science-lab-public"],
    queryFn: async () => {
      const res = await axiosSecure.get("/science-lab");
      const payload = res.data;
      if (payload != null && typeof payload !== "object") return null;
      return payload ?? null;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const doc =
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    !(raw instanceof Blob)
      ? raw
      : null;

  const content = useMemo(() => {
    const heroTitle = doc?.heroTitle || "বিজ্ঞান ল্যাবরেটরি";
    const heroSubtitle =
      doc?.heroSubtitle ||
      "আমাদের বিজ্ঞান ল্যাবরেটরি শিক্ষার্থীদের পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানে হাতে-কলমে শেখার সুযোগ প্রদান করে। শিক্ষার্থীরা আধুনিক যন্ত্রপাতি ব্যবহার করে সুরক্ষিত পরিবেশে বাস্তব পরীক্ষা সম্পাদন করে।";
    const heroFallback =
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80";
    const heroImage =
      doc?.heroImage && imgUrl(doc.heroImage) ? imgUrl(doc.heroImage) : heroFallback;

    const features =
      Array.isArray(doc?.features) && doc.features.length > 0
        ? doc.features.map((f, i) => ({
            id: i,
            icon: resolveIcon(f.icon),
            title: f.title ?? "",
            desc: f.desc ?? "",
          }))
        : defaultFeatures.map((f) => ({
            id: f.id,
            icon: resolveIcon(f.icon),
            title: f.title,
            desc: f.desc,
          }));

    const overviewTitle = doc?.overviewTitle || "বাস্তব শেখার পরিবেশ";
    const overviewDescription =
      doc?.overviewDescription ||
      "শিক্ষার্থীরা তত্ত্বীয় শিক্ষা থেকে বের হয়ে বাস্তব পরীক্ষা পরিচালনা করে যা তাদের বিশ্লেষণাত্মক চিন্তা এবং বৈজ্ঞানিক ধারণা উন্নত করে। আমাদের ল্যাব পাঠ্যক্রম-ভিত্তিক ক্লাস এবং উন্নত পরীক্ষা সেশন সমর্থন করে।";
    const overviewFallback =
      "https://images.unsplash.com/photo-1602052577122-f73b9710adba?auto=format&fit=crop&w=1200&q=80";
    const overviewImage =
      doc?.overviewImage && imgUrl(doc.overviewImage)
        ? imgUrl(doc.overviewImage)
        : overviewFallback;

    const bullets =
      Array.isArray(doc?.overviewBullets) && doc.overviewBullets.length > 0
        ? doc.overviewBullets.filter(Boolean)
        : [
            "✔ আধুনিক ল্যাব বেঞ্চ",
            "✔ পর্যাপ্ত রাসায়নিক সংরক্ষণ ব্যবস্থা",
            "✔ বৈদ্যুতিক ও পদার্থবিজ্ঞান যন্ত্রপাতি",
            "✔ পরিষ্কার এবং ভালো বায়ুচলাচলযুক্ত কর্মস্থল",
          ];

    const galleryTitle = doc?.gallerySectionTitle || "ল্যাবরেটরি গ্যালারি";
    const gallerySubtitle =
      doc?.gallerySectionSubtitle ||
      "আমাদের বিজ্ঞান ল্যাবের পরিবেশ এবং সুবিধাসমূহ দেখুন।";

    const gallery =
      Array.isArray(doc?.gallery) && doc.gallery.length > 0
        ? doc.gallery.map((p) => imgUrl(p)).filter(Boolean)
        : defaultGallery;

    return {
      heroTitle,
      heroSubtitle,
      heroImage,
      features,
      overviewTitle,
      overviewDescription,
      overviewImage,
      bullets,
      galleryTitle,
      gallerySubtitle,
      gallery,
    };
  }, [doc]);

  if (isLoading) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
        <p className="text-gray-400 text-sm">লোড হচ্ছে…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-300 text-center max-w-md">{queryErrorMessage(error)}</p>
        <button
          type="button"
          className="btn btn-outline btn-sm border-cyan-400 text-cyan-400"
          onClick={() => refetch()}
        >
          আবার চেষ্টা
        </button>
      </div>
    );
  }

  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    features,
    overviewTitle,
    overviewDescription,
    overviewImage,
    bullets,
    galleryTitle,
    gallerySubtitle,
    gallery,
  } = content;

  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[150px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/20 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14 space-y-12 md:space-y-20">
        <div className="relative border border-white/10 overflow-hidden rounded-2xl shadow-xl">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-[300px] sm:h-[380px] md:h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-[#050b1e]/55 flex flex-col justify-center px-6 sm:px-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 mb-4 md:mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-gray-200 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {heroSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:-translate-y-1 transition duration-300"
            >
              <div className="text-3xl text-cyan-400 mb-3 md:mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden rounded-2xl order-2 md:order-1">
            <img
              src={overviewImage}
              alt={overviewTitle}
              className="w-full h-[300px] md:h-[400px] object-cover hover:scale-105 transition duration-700"
            />
          </div>

          <div className="space-y-5 md:space-y-6 order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">{overviewTitle}</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{overviewDescription}</p>
            <ul className="space-y-2 text-gray-300 text-sm md:text-base">
              {bullets.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{galleryTitle}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">{gallerySubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <img
                  src={src}
                  alt={`${galleryTitle} ${index + 1}`}
                  className="w-full h-60 md:h-64 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sciencelabpage;
