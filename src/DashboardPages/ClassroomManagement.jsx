import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaEdit, FaExternalLinkAlt, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

const defaultRooms = () => [
  {
    title: "সিনিয়র ক্লাসরুম",
    description:
      "আমাদের সিনিয়র ক্লাসরুমগুলো আধুনিক বসার ব্যবস্থা, ডিজিটাল বোর্ড এবং পর্যাপ্ত আলোসহ শিক্ষার্থীদের একটি মনোযোগী ও আরামদায়ক শেখার পরিবেশ প্রদান করে।",
    students: "৭০ শিক্ষার্থীর ক্ষমতা",
    facilitiesText: "ডিজিটাল বোর্ড\nপ্রজেক্টর\nসিলিং ফ্যান\nসাউন্ড সিস্টেম",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350",
  },
  {
    title: "জুনিয়র ক্লাসরুম",
    description:
      "প্রাকৃতিকভাবে ভালভাবে বাতানুকূলিত জুনিয়র ক্লাসরুম যা শিক্ষার্থীদের জন্য স্বাস্থ্যকর এবং আকর্ষণীয় পরিবেশ তৈরি করে।",
    students: "৬০ শিক্ষার্থীর ক্ষমতা",
    facilitiesText: "হোয়াইটবোর্ড\nপ্রাকৃতিক আলো\nআরামদায়ক বেঞ্চ\nফ্যান",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754",
  },
  {
    title: "স্মার্ট ক্লাসরুম",
    description:
      "প্রযুক্তি-সক্ষম স্মার্ট ক্লাসরুম, মাল্টিমিডিয়া প্রজেক্টর এবং ইন্টারেক্টিভ বোর্ড দ্বারা শিক্ষার্থীদের ডিজিটাল শেখার অভিজ্ঞতা বৃদ্ধি করে।",
    students: "৬৫ শিক্ষার্থীর ক্ষমতা",
    facilitiesText:
      "ইন্টারেক্টিভ বোর্ড\nমাল্টিমিডিয়া প্রজেক্টর\nWiFi\nঅডিও সিস্টেম",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  },
];

const defaultGallery = () => [
  "https://images.unsplash.com/photo-1588072432836-e10032774350",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  "https://images.unsplash.com/photo-1562774053-701939374585",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
];

const emptyForm = () => ({
  pageTitle: "আমাদের ক্লাসরুম",
  pageSubtitle:
    "আমাদের ক্লাসরুমগুলো আধুনিক, প্রশস্ত এবং সুষ্ঠুভাবে সজ্জিত, যা শিক্ষার্থীদের আরামদায়ক এবং অনুপ্রাণিত শেখার পরিবেশ প্রদান করে।",
  rooms: defaultRooms(),
  gallerySectionTitle: "ক্লাসরুম গ্যালারি",
  gallerySectionSubtitle:
    "আমাদের সুসজ্জিত এবং শিক্ষার্থী-বান্ধব ক্লাসরুমের একটি ঝলক।",
  gallery: defaultGallery(),
});

function imageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path.replace(/^\//, "")}`;
}

function roomsToPayload(rooms) {
  return rooms.map((r) => ({
    title: r.title || "",
    description: r.description || "",
    students: r.students || "",
    facilities: (r.facilitiesText || "")
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    image: r.image || "",
  }));
}

function appendRoomImageFields(fd, pendingByIndex) {
  const indices = Object.keys(pendingByIndex)
    .map(Number)
    .filter((i) => pendingByIndex[i] instanceof File)
    .sort((a, b) => a - b);
  indices.forEach((i) => fd.append("roomImage", pendingByIndex[i]));
  fd.append("roomImageIndices", JSON.stringify(indices));
}

const ClassroomManagement = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm());
  const [pendingRoomImages, setPendingRoomImages] = useState({});
  const [galleryFiles, setGalleryFiles] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["classroom-page-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/classroom-page", {
        baseURL: API_ORIGIN,
      });
      return res.data;
    },
  });

  const docId = data?._id;

  useEffect(() => {
    if (!data) {
      setForm(emptyForm());
      return;
    }
    setForm({
      pageTitle: data.pageTitle || "",
      pageSubtitle: data.pageSubtitle || "",
      rooms:
        Array.isArray(data.rooms) && data.rooms.length
          ? data.rooms.map((room) => ({
              title: room.title || "",
              description: room.description || "",
              students: room.students || "",
              facilitiesText: Array.isArray(room.facilities)
                ? room.facilities.join("\n")
                : "",
              image: room.image || "",
            }))
          : defaultRooms(),
      gallerySectionTitle: data.gallerySectionTitle || "",
      gallerySectionSubtitle: data.gallerySectionSubtitle || "",
      gallery: Array.isArray(data.gallery) ? [...data.gallery] : defaultGallery(),
    });
    setPendingRoomImages({});
    setGalleryFiles([]);
  }, [data]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("pageTitle", form.pageTitle);
    fd.append("pageSubtitle", form.pageSubtitle);
    fd.append("rooms", JSON.stringify(roomsToPayload(form.rooms)));
    fd.append("gallerySectionTitle", form.gallerySectionTitle);
    fd.append("gallerySectionSubtitle", form.gallerySectionSubtitle);
    return fd;
  };

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["classroom-page-public"] });
    await queryClient.invalidateQueries({ queryKey: ["classroom-page-admin"] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = buildFormData();
      if (Object.keys(pendingRoomImages).length > 0) {
        appendRoomImageFields(fd, pendingRoomImages);
      } else {
        fd.append("roomImageIndices", "[]");
      }
      galleryFiles.forEach((f) => fd.append("gallery", f));
      await axiosSecure.post("/classroom-page", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        baseURL: API_ORIGIN,
      });
      await invalidate();
      alert("Classroom page created");
      refetch();
      setPendingRoomImages({});
      setGalleryFiles([]);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!docId) return;
    try {
      const fd = buildFormData();
      if (Object.keys(pendingRoomImages).length > 0) {
        appendRoomImageFields(fd, pendingRoomImages);
      }
      if (galleryFiles.length > 0) {
        fd.append("galleryExisting", JSON.stringify(form.gallery));
        galleryFiles.forEach((f) => fd.append("gallery", f));
      } else {
        fd.append("galleryUrls", JSON.stringify(form.gallery));
      }
      await axiosSecure.patch(`/classroom-page/${docId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        baseURL: API_ORIGIN,
      });
      await invalidate();
      alert("Classroom page updated");
      refetch();
      setPendingRoomImages({});
      setGalleryFiles([]);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    if (!window.confirm("Delete classroom page content?")) return;
    try {
      await axiosSecure.delete(`/classroom-page/${docId}`, {
        baseURL: API_ORIGIN,
      });
      await invalidate();
      alert("Deleted");
      refetch();
      setForm(emptyForm());
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateRoom = (index, field, value) => {
    setForm((p) => {
      const rooms = [...p.rooms];
      rooms[index] = { ...rooms[index], [field]: value };
      return { ...p, rooms };
    });
  };

  const addRoom = () => {
    setForm((p) => ({
      ...p,
      rooms: [
        ...p.rooms,
        {
          title: "",
          description: "",
          students: "",
          facilitiesText: "",
          image: "",
        },
      ],
    }));
  };

  const removeRoom = (index) => {
    setPendingRoomImages((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        const i = Number(k);
        if (i === index) return;
        const newIdx = i > index ? i - 1 : i;
        next[newIdx] = prev[i];
      });
      return next;
    });
    setForm((p) => ({
      ...p,
      rooms: p.rooms.filter((_, i) => i !== index),
    }));
  };

  const removeGalleryAt = (idx) => {
    setForm((p) => ({ ...p, gallery: p.gallery.filter((_, j) => j !== idx) }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 shadow-xl rounded-xl p-5 bg-base-100">
        <h1 className="font-bold text-xl">Classroom Management</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/classrooms"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <FaExternalLinkAlt /> View public page
          </Link>
          {docId && (
            <button
              type="button"
              className="btn btn-error btn-outline btn-sm"
              onClick={handleDelete}
            >
              <FaTrash /> Delete all
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={docId ? handleUpdate : handleCreate}
        className="card bg-base-100 shadow-xl border border-base-200"
      >
        <div className="card-body space-y-8">
          {!docId && (
            <div role="status" className="alert alert-info">
              <span>
                No classroom page in the database yet. Fill in the sections and
                click <strong>Create</strong>. Afterwards use <strong>Save</strong>{" "}
                to update; optional image uploads replace that room or add gallery
                photos.
              </span>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Page header</h2>
            <input
              className="input input-bordered w-full mb-2"
              placeholder="Title"
              value={form.pageTitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, pageTitle: e.target.value }))
              }
            />
            <textarea
              className="textarea textarea-bordered w-full min-h-[80px]"
              placeholder="Subtitle"
              value={form.pageSubtitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, pageSubtitle: e.target.value }))
              }
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b pb-2">
              <h2 className="font-semibold text-lg">Classrooms</h2>
              <button type="button" className="btn btn-sm btn-outline" onClick={addRoom}>
                <FaPlus /> Add room
              </button>
            </div>
            <div className="space-y-10">
              {form.rooms.map((room, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-base-300 bg-base-200/30 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm opacity-70">
                      Room {index + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-xs btn-error btn-outline"
                      onClick={() => removeRoom(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Title"
                    value={room.title}
                    onChange={(e) => updateRoom(index, "title", e.target.value)}
                  />
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Description"
                    value={room.description}
                    onChange={(e) =>
                      updateRoom(index, "description", e.target.value)
                    }
                  />
                  <input
                    className="input input-bordered w-full"
                    placeholder='Capacity e.g. "৭০ শিক্ষার্থীর ক্ষমতা"'
                    value={room.students}
                    onChange={(e) =>
                      updateRoom(index, "students", e.target.value)
                    }
                  />
                  <textarea
                    className="textarea textarea-bordered w-full font-mono text-sm"
                    placeholder="Facilities (one per line)"
                    value={room.facilitiesText}
                    onChange={(e) =>
                      updateRoom(index, "facilitiesText", e.target.value)
                    }
                  />
                  <div className="text-sm text-base-content/70">
                    Main image (file replaces stored path on save)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm max-w-md"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setPendingRoomImages((prev) => {
                        const next = { ...prev };
                        if (f) next[index] = f;
                        else delete next[index];
                        return next;
                      });
                    }}
                  />
                  {(room.image || pendingRoomImages[index]) && (
                    <img
                      src={
                        pendingRoomImages[index]
                          ? URL.createObjectURL(pendingRoomImages[index])
                          : imageSrc(room.image)
                      }
                      alt=""
                      className="max-h-36 rounded-lg object-cover border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Gallery</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                className="input input-bordered"
                placeholder="Gallery title"
                value={form.gallerySectionTitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gallerySectionTitle: e.target.value }))
                }
              />
              <input
                className="input input-bordered"
                placeholder="Gallery subtitle"
                value={form.gallerySectionSubtitle}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gallerySectionSubtitle: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {form.gallery.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={imageSrc(src)}
                    alt=""
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-error absolute top-0 right-0"
                    onClick={() => removeGalleryAt(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-input file-input-bordered max-w-md"
              onChange={(e) =>
                setGalleryFiles(
                  e.target.files ? Array.from(e.target.files) : []
                )
              }
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className={`btn ${docId ? "btn-warning" : "btn-primary"}`}
            >
              {docId ? (
                <>
                  <FaEdit /> Save
                </>
              ) : (
                <>
                  <FaPlus /> Create
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClassroomManagement;
