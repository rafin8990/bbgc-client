import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaEdit, FaExternalLinkAlt, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

const FEATURE_ICONS = [
  { value: "book", label: "Book" },
  { value: "users", label: "Users" },
  { value: "laptop", label: "Laptop" },
  { value: "clock", label: "Clock" },
];

const defaultFeatures = () =>
  FEATURE_ICONS.map((o) => ({ title: "", icon: o.value }));

const defaultStats = () => [
  { number: 10000, label: "বই", icon: "book" },
  { number: 500, label: "ডিজিটাল রিসোর্স", icon: "laptop" },
  { number: 200, label: "পাঠক আসন", icon: "users" },
  { number: 24, label: "সেবা ঘণ্টা", icon: "clock" },
];

const emptyForm = () => ({
  heroTitle: "",
  heroSubtitle: "",
  descriptionTitle: "",
  descriptionParagraph: "",
  features: defaultFeatures(),
  libraryStats: defaultStats(),
  gallerySectionTitle: "",
  gallerySectionSubtitle: "",
  gallery: [],
});

function imageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path.replace(/^\//, "")}`;
}

const LibraryManagement = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm());
  const [heroFile, setHeroFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["library-page-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/library-page");
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
      heroTitle: data.heroTitle || "",
      heroSubtitle: data.heroSubtitle || "",
      descriptionTitle: data.descriptionTitle || "",
      descriptionParagraph: data.descriptionParagraph || "",
      features:
        Array.isArray(data.features) && data.features.length
          ? data.features.map((f, i) => ({
              title: f.title || "",
              icon: f.icon || FEATURE_ICONS[i % FEATURE_ICONS.length].value,
            }))
          : defaultFeatures(),
      libraryStats:
        Array.isArray(data.libraryStats) && data.libraryStats.length
          ? data.libraryStats.map((s, i) => ({
              number: Number(s.number) || 0,
              label: s.label || "",
              icon: s.icon || FEATURE_ICONS[i % FEATURE_ICONS.length].value,
            }))
          : defaultStats(),
      gallerySectionTitle: data.gallerySectionTitle || "",
      gallerySectionSubtitle: data.gallerySectionSubtitle || "",
      gallery: Array.isArray(data.gallery) ? [...data.gallery] : [],
    });
    setHeroFile(null);
    setGalleryFiles([]);
  }, [data]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("heroTitle", form.heroTitle);
    fd.append("heroSubtitle", form.heroSubtitle);
    fd.append("descriptionTitle", form.descriptionTitle);
    fd.append("descriptionParagraph", form.descriptionParagraph);
    fd.append("features", JSON.stringify(form.features));
    fd.append("libraryStats", JSON.stringify(form.libraryStats));
    fd.append("gallerySectionTitle", form.gallerySectionTitle);
    fd.append("gallerySectionSubtitle", form.gallerySectionSubtitle);
    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = buildFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      galleryFiles.forEach((f) => fd.append("gallery", f));
      await axiosSecure.post("/library-page", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await queryClient.invalidateQueries({ queryKey: ["library-page-public"] });
      await queryClient.invalidateQueries({ queryKey: ["library-page-admin"] });
      alert("Library page created");
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!docId) return;
    try {
      const fd = buildFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      if (galleryFiles.length > 0) {
        fd.append("galleryExisting", JSON.stringify(form.gallery));
        galleryFiles.forEach((f) => fd.append("gallery", f));
      } else {
        fd.append("galleryUrls", JSON.stringify(form.gallery));
      }
      await axiosSecure.patch(`/library-page/${docId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await queryClient.invalidateQueries({ queryKey: ["library-page-public"] });
      await queryClient.invalidateQueries({ queryKey: ["library-page-admin"] });
      alert("Library page updated");
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    if (!window.confirm("Delete all library page content?")) return;
    try {
      await axiosSecure.delete(`/library-page/${docId}`);
      await queryClient.invalidateQueries({ queryKey: ["library-page-public"] });
      await queryClient.invalidateQueries({ queryKey: ["library-page-admin"] });
      alert("Deleted");
      refetch();
      setForm(emptyForm());
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateFeature = (i, field, val) => {
    setForm((p) => {
      const features = [...p.features];
      features[i] = { ...features[i], [field]: val };
      return { ...p, features };
    });
  };

  const updateStat = (i, field, val) => {
    setForm((p) => {
      const libraryStats = [...p.libraryStats];
      libraryStats[i] = {
        ...libraryStats[i],
        [field]: field === "number" ? (val === "" ? 0 : Number(val)) : val,
      };
      return { ...p, libraryStats };
    });
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
        <h1 className="font-bold text-xl">Library Management</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/library" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            <FaExternalLinkAlt /> View public page
          </Link>
          {docId && (
            <button type="button" className="btn btn-error btn-outline btn-sm" onClick={handleDelete}>
              <FaTrash /> Delete all
            </button>
          )}
        </div>
      </div>

      <form onSubmit={docId ? handleUpdate : handleCreate} className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body space-y-8">
          {!docId && (
            <div role="status" className="alert alert-info">
              <span>
                No library page in the database yet. Fill the form and click{" "}
                <strong>Create</strong>. After that, use <strong>Save</strong> to edit and{" "}
                <strong>Delete all</strong> to remove and start over.
              </span>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Hero</h2>
            <div className="grid gap-4">
              <input
                className="input input-bordered"
                placeholder="Title"
                value={form.heroTitle}
                onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
              />
              <textarea
                className="textarea textarea-bordered"
                placeholder="Subtitle"
                value={form.heroSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
              />
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered max-w-md"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              />
              {data?.heroImage && !heroFile && (
                <img src={imageSrc(data.heroImage)} alt="" className="max-h-40 rounded-lg object-cover" />
              )}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Description block</h2>
            <input
              className="input input-bordered w-full mb-2"
              placeholder="Section title"
              value={form.descriptionTitle}
              onChange={(e) => setForm((p) => ({ ...p, descriptionTitle: e.target.value }))}
            />
            <textarea
              className="textarea textarea-bordered w-full min-h-[100px]"
              placeholder="Paragraph"
              value={form.descriptionParagraph}
              onChange={(e) =>
                setForm((p) => ({ ...p, descriptionParagraph: e.target.value }))
              }
            />
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Features (4)</h2>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex flex-wrap gap-2">
                  <input
                    className="input input-bordered flex-1 min-w-[200px]"
                    value={f.title}
                    onChange={(e) => updateFeature(i, "title", e.target.value)}
                  />
                  <select
                    className="select select-bordered w-full sm:w-40"
                    value={f.icon}
                    onChange={(e) => updateFeature(i, "icon", e.target.value)}
                  >
                    {FEATURE_ICONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Animated stats (4)</h2>
            <div className="space-y-3">
              {form.libraryStats.map((s, i) => (
                <div key={i} className="flex flex-wrap gap-2 items-center">
                  <input
                    type="number"
                    className="input input-bordered w-32"
                    value={s.number}
                    onChange={(e) => updateStat(i, "number", e.target.value)}
                  />
                  <input
                    className="input input-bordered flex-1 min-w-[160px]"
                    placeholder="Label"
                    value={s.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                  />
                  <select
                    className="select select-bordered w-full sm:w-36"
                    value={s.icon}
                    onChange={(e) => updateStat(i, "icon", e.target.value)}
                  >
                    {FEATURE_ICONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Gallery</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                className="input input-bordered"
                placeholder="Gallery section title"
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
                  setForm((p) => ({ ...p, gallerySectionSubtitle: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {form.gallery.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={imageSrc(src)} alt="" className="h-24 w-full object-cover rounded border" />
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
                setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" className={`btn ${docId ? "btn-warning" : "btn-primary"}`}>
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

export default LibraryManagement;
