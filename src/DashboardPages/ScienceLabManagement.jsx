import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaEdit, FaExternalLinkAlt, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

const ICON_OPTIONS = [
  { value: "flask", label: "Flask" },
  { value: "microscope", label: "Microscope" },
  { value: "atom", label: "Atom" },
  { value: "shield", label: "Shield" },
];

const defaultFeatures = () =>
  ICON_OPTIONS.map((o) => ({ title: "", desc: "", icon: o.value }));

const defaultBullets = () => [
  "✔ আধুনিক ল্যাব বেঞ্চ",
  "✔ পর্যাপ্ত রাসায়নিক সংরক্ষণ ব্যবস্থা",
  "✔ বৈদ্যুতিক ও পদার্থবিজ্ঞান যন্ত্রপাতি",
  "✔ পরিষ্কার এবং ভালো বায়ুচলাচলযুক্ত কর্মস্থল",
];

const emptyForm = () => ({
  heroTitle: "",
  heroSubtitle: "",
  features: defaultFeatures(),
  overviewTitle: "",
  overviewDescription: "",
  overviewBullets: defaultBullets(),
  gallerySectionTitle: "",
  gallerySectionSubtitle: "",
  gallery: [],
});

function imageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path.replace(/^\//, "")}`;
}

const ScienceLabManagement = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm());
  const [heroFile, setHeroFile] = useState(null);
  const [overviewFile, setOverviewFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["science-lab-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/science-lab");
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
      features:
        Array.isArray(data.features) && data.features.length
          ? data.features.map((f, i) => ({
              title: f.title || "",
              desc: f.desc || "",
              icon: f.icon || ICON_OPTIONS[i % ICON_OPTIONS.length].value,
            }))
          : defaultFeatures(),
      overviewTitle: data.overviewTitle || "",
      overviewDescription: data.overviewDescription || "",
      overviewBullets:
        Array.isArray(data.overviewBullets) && data.overviewBullets.length
          ? [...data.overviewBullets]
          : defaultBullets(),
      gallerySectionTitle: data.gallerySectionTitle || "",
      gallerySectionSubtitle: data.gallerySectionSubtitle || "",
      gallery: Array.isArray(data.gallery) ? [...data.gallery] : [],
    });
    setHeroFile(null);
    setOverviewFile(null);
    setGalleryFiles([]);
  }, [data]);

  const buildCommonFormData = () => {
    const fd = new FormData();
    fd.append("heroTitle", form.heroTitle);
    fd.append("heroSubtitle", form.heroSubtitle);
    fd.append("features", JSON.stringify(form.features));
    fd.append("overviewTitle", form.overviewTitle);
    fd.append("overviewDescription", form.overviewDescription);
    fd.append("overviewBullets", JSON.stringify(form.overviewBullets));
    fd.append("gallerySectionTitle", form.gallerySectionTitle);
    fd.append("gallerySectionSubtitle", form.gallerySectionSubtitle);
    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = buildCommonFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      if (overviewFile) fd.append("overviewImage", overviewFile);
      galleryFiles.forEach((f) => fd.append("gallery", f));

      await axiosSecure.post("/science-lab", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Science lab page created");
      await queryClient.invalidateQueries({ queryKey: ["science-lab-public"] });
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
      setOverviewFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!docId) return;
    try {
      const fd = buildCommonFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      if (overviewFile) fd.append("overviewImage", overviewFile);

      if (galleryFiles.length > 0) {
        fd.append("galleryExisting", JSON.stringify(form.gallery));
        galleryFiles.forEach((f) => fd.append("gallery", f));
      } else {
        fd.append("galleryUrls", JSON.stringify(form.gallery));
      }

      await axiosSecure.patch(`/science-lab/${docId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Science lab updated");
      await queryClient.invalidateQueries({ queryKey: ["science-lab-public"] });
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
      setOverviewFile(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    if (!window.confirm("Delete all science lab content? This cannot be undone."))
      return;
    try {
      await axiosSecure.delete(`/science-lab/${docId}`);
      alert("Deleted");
      await queryClient.invalidateQueries({ queryKey: ["science-lab-public"] });
      refetch();
      setForm(emptyForm());
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const removeGalleryAt = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index, field, value) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const updateBullet = (index, value) => {
    setForm((prev) => {
      const overviewBullets = [...prev.overviewBullets];
      overviewBullets[index] = value;
      return { ...prev, overviewBullets };
    });
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
        <h1 className="font-bold text-xl">Science Lab Management</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/science-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <FaExternalLinkAlt /> View public page
          </Link>
          {docId && (
            <button type="button" className="btn btn-error btn-outline btn-sm" onClick={handleDelete}>
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
          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Hero</h2>
            <div className="grid gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Hero title</span></label>
                <input
                  className="input input-bordered"
                  value={form.heroTitle}
                  onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Hero subtitle (paragraph)</span></label>
                <textarea
                  className="textarea textarea-bordered min-h-[100px]"
                  value={form.heroSubtitle}
                  onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Hero image</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered max-w-md"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                />
                {data?.heroImage && !heroFile && (
                  <img src={imageSrc(data.heroImage)} alt="" className="mt-2 rounded-lg max-h-40 object-cover" />
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Feature cards (4)</h2>
            <div className="space-y-4">
              {form.features.map((f, i) => (
                <div key={i} className="p-4 border rounded-xl space-y-2 bg-base-200/30">
                  <div className="flex flex-wrap gap-2">
                    <input
                      className="input input-bordered flex-1 min-w-[200px]"
                      placeholder="Title"
                      value={f.title}
                      onChange={(e) => updateFeature(i, "title", e.target.value)}
                    />
                    <select
                      className="select select-bordered w-full sm:w-40"
                      value={f.icon}
                      onChange={(e) => updateFeature(i, "icon", e.target.value)}
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full text-sm"
                    placeholder="Short description"
                    value={f.desc}
                    onChange={(e) => updateFeature(i, "desc", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Overview (image + text + bullets)</h2>
            <div className="grid gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Overview title</span></label>
                <input
                  className="input input-bordered"
                  value={form.overviewTitle}
                  onChange={(e) => setForm((p) => ({ ...p, overviewTitle: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Overview description</span></label>
                <textarea
                  className="textarea textarea-bordered min-h-[120px]"
                  value={form.overviewDescription}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, overviewDescription: e.target.value }))
                  }
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Bullet points (one field each)</span></label>
                <div className="space-y-2">
                  {form.overviewBullets.map((line, i) => (
                    <input
                      key={i}
                      className="input input-bordered w-full"
                      value={line}
                      onChange={(e) => updateBullet(i, e.target.value)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost mt-2"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      overviewBullets: [...p.overviewBullets, ""],
                    }))
                  }
                >
                  + Add bullet
                </button>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Overview image</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered max-w-md"
                  onChange={(e) => setOverviewFile(e.target.files?.[0] || null)}
                />
                {data?.overviewImage && !overviewFile && (
                  <img src={imageSrc(data.overviewImage)} alt="" className="mt-2 rounded-lg max-h-40 object-cover" />
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Gallery</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Section title</span></label>
                <input
                  className="input input-bordered"
                  value={form.gallerySectionTitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gallerySectionTitle: e.target.value }))
                  }
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Section subtitle</span></label>
                <input
                  className="input input-bordered"
                  value={form.gallerySectionSubtitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, gallerySectionSubtitle: e.target.value }))
                  }
                />
              </div>
            </div>
            <p className="text-sm opacity-70 mb-2">Current images</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {form.gallery.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={imageSrc(src)} alt="" className="w-full h-28 object-cover rounded-lg border" />
                  <button
                    type="button"
                    className="btn btn-xs btn-error absolute top-1 right-1"
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
            {galleryFiles.length > 0 && (
              <p className="text-sm mt-1">{galleryFiles.length} new file(s) on save</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" className={`btn ${docId ? "btn-warning" : "btn-primary"}`}>
              {docId ? (
                <>
                  <FaEdit /> Save changes
                </>
              ) : (
                <>
                  <FaPlus /> Create science lab content
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScienceLabManagement;
