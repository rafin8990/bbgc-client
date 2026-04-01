import React, { useMemo } from "react";
import { FaUsers, FaFan } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

/**
 * Public classroom page — loads GET /classroom-page (one document or null).
 * Fields: pageTitle, pageSubtitle, rooms[{ title, description, students, facilities[], image }],
 * gallerySectionTitle, gallerySectionSubtitle, gallery[] (paths or absolute URLs).
 */

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

const defaultRooms = [
  {
    id: 1,
    title: "সিনিয়র ক্লাসরুম",
    description:
      "আমাদের সিনিয়র ক্লাসরুমগুলো আধুনিক বসার ব্যবস্থা, ডিজিটাল বোর্ড এবং পর্যাপ্ত আলোসহ শিক্ষার্থীদের একটি মনোযোগী ও আরামদায়ক শেখার পরিবেশ প্রদান করে।",
    students: "৭০ শিক্ষার্থীর ক্ষমতা",
    facilities: ["ডিজিটাল বোর্ড", "প্রজেক্টর", "সিলিং ফ্যান", "সাউন্ড সিস্টেম"],
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350",
  },
  {
    id: 2,
    title: "জুনিয়র ক্লাসরুম",
    description:
      "প্রাকৃতিকভাবে ভালভাবে বাতানукূলিত জুনিয়র ক্লাসরুম যা শিক্ষার্থীদের জন্য স্বাস্থ্যকর এবং আকর্ষণীয় পরিবেশ তৈরি করে।",
    students: "৬০ শিক্ষার্থীর ক্ষমতา",
    facilities: ["হোয়াইটবোর্ড", "প্রাকৃতিক আলো", "আরামদায়ক বেঞ্চ", "ফ্যান"],
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754",
  },
  {
    id: 3,
    title: "স্মার্ট ক্লাসরুম",
    description:
      "প্রযুক্তি-সক্ষম স্মার্ট ক্লাসরুম, মাল্টিমিডিয়া প্রজেক্টর এবং ইন্টারেক্টিভ বোর্ড দ্বারা শিক্ষার্থীদের ডিজিটাল শেখার অভিজ্ঞতা বৃদ্ধি করে।",
    students: "৬৫ শিক্ষার্থীর ক্ষমতা",
    facilities: [
      "ইন্টারেক্টিভ বোর্ড",
      "মাল্টিমিডিয়া প্রজেক্টর",
      "WiFi",
      "অডিও সিস্টেম",
    ],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  },
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1588072432836-e10032774350",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  "https://images.unsplash.com/photo-1562774053-701939374585",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
];

function imgUrl(path) {
  if (!path || typeof path !== "string") return "";
  const t = path.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `${API_BASE}/${t.replace(/^\//, "")}`;
}

function normalizeDoc(payload) {
  if (payload == null || typeof payload !== "object") return null;
  if (Array.isArray(payload)) return null;
  if (payload instanceof Blob) return null;
  return payload;
}

function queryErrorMessage(err) {
  if (!err) return "ডেটা লোড করা যায়নি।";
  const api = err.response?.data;
  if (typeof api === "string") return api;
  if (api?.message) return api.message;
  return err.message || "ডেটা লোড করা যায়নি।";
}

const Classroompage = () => {
  const axiosSecure = useAxiossecure();
  const { data: raw, isLoading, isError, error, refetch, isFetching } = useQuery(
    {
      queryKey: ["classroom-page-public"],
      queryFn: async () => {
        const res = await axiosSecure.get("/classroom-page", {
          baseURL: API_BASE,
        });
        return normalizeDoc(res.data);
      },
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    }
  );

  const doc = normalizeDoc(raw);

  const pageTitle = doc?.pageTitle || "আমাদের ক্লাসরুম";
  const pageSubtitle =
    doc?.pageSubtitle ||
    "আমাদের ক্লাসরুমগুলো আধুনিক, প্রশস্ত এবং সুষ্ঠুভাবে সজ্জিত, যা শিক্ষার্থীদের আরামদায়ক এবং অনুপ্রাণিত শেখার পরিবেশ প্রদান করে।";

  const classroomData = useMemo(() => {
    const rooms = doc?.rooms;
    if (!Array.isArray(rooms) || rooms.length === 0) return defaultRooms;
    return rooms.map((room, i) => ({
      id: i + 1,
      title: room.title || defaultRooms[i]?.title || "",
      description: room.description || defaultRooms[i]?.description || "",
      students: room.students || defaultRooms[i]?.students || "",
      facilities:
        Array.isArray(room.facilities) && room.facilities.length > 0
          ? room.facilities
          : defaultRooms[i]?.facilities || [],
      image: (() => {
        const fromApi = room.image ? imgUrl(room.image) : "";
        return fromApi || defaultRooms[i]?.image || defaultRooms[0].image;
      })(),
    }));
  }, [doc]);

  const gallerySectionTitle = doc?.gallerySectionTitle || "ক্লাসরুম গ্যালারি";
  const gallerySectionSubtitle =
    doc?.gallerySectionSubtitle ||
    "আমাদের সুসজ্জিত এবং শিক্ষার্থী-বান্ধব ক্লাসরুমের একটি ঝলক।";

  const galleryImages = useMemo(() => {
    const g = doc?.gallery;
    if (!Array.isArray(g) || g.length === 0) return defaultGallery;
    const urls = g.map((p) => imgUrl(p)).filter(Boolean);
    return urls.length ? urls : defaultGallery;
  }, [doc]);

  if (isLoading) {
    return (
      <div className="relative bg-[#050b1e] text-white min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#050b1e] text-white overflow-hidden min-h-screen">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-28">
        {isError && (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100"
          >
            <p className="text-sm">
              ক্লাসরুম ডেটা লোড হয়নি। নিচে ডিফল্ট বিষয়বস্তু দেখানো হচ্ছে। (
              {queryErrorMessage(error)})
            </p>
            <button
              type="button"
              className="btn btn-sm btn-outline border-amber-400/60 text-amber-100 hover:bg-amber-500/20 shrink-0"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "লোড হচ্ছে…" : "আবার চেষ্টা"}
            </button>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
            {pageTitle}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {classroomData.map((room, index) => (
          <div
            key={`classroom-block-${index}-${room.title?.slice(0, 24) || "room"}`}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div
              className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-black/20 ${
                index % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-[350px] object-cover hover:scale-105 transition duration-700"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div
              className={`space-y-6 ${index % 2 === 1 ? "md:order-1" : ""}`}
            >
              <h2 className="text-3xl font-bold text-cyan-400">{room.title}</h2>

              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {room.description}
              </p>

              <div className="flex items-center gap-3 text-cyan-400">
                <FaUsers />
                <span>{room.students}</span>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">সুবিধাসমূহ:</h4>
                <div className="grid grid-cols-2 gap-3 text-gray-300">
                  {room.facilities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FaFan className="text-cyan-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-400">
              {gallerySectionTitle}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {gallerySectionSubtitle}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={img}
                    alt={`${gallerySectionTitle} ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroompage;
