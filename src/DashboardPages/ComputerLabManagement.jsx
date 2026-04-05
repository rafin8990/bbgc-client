import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://bbgc.academichelperbd.xyz";

const ICON_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "wifi", label: "Wifi" },
  { value: "users", label: "Users" },
  { value: "microchip", label: "Microchip" },
];

const defaultStats = () =>
  ICON_OPTIONS.map((o) => ({ title: "", icon: o.value }));

const emptyForm = () => ({
  heroTitle: "",
  heroSubtitle: "",
  aboutTitle: "",
  aboutDescription: "",
  gallerySectionTitle: "",
  gallerySectionSubtitle: "",
  stats: defaultStats(),
  gallery: [],
});

function imageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path.replace(/^\//, "")}`;
}

const ComputerLabManagement = () => {
  const axiosSecure = useAxiossecure();
  const [form, setForm] = useState(emptyForm());
  const [heroFile, setHeroFile] = useState(null);
  const [aboutFile, setAboutFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState(null);
  const [aboutPreviewUrl, setAboutPreviewUrl] = useState(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState([]);

  useEffect(() => {
    if (!heroFile) {
      setHeroPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(heroFile);
    setHeroPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [heroFile]);

  useEffect(() => {
    if (!aboutFile) {
      setAboutPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(aboutFile);
    setAboutPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [aboutFile]);

  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviewUrls([]);
      return;
    }
    const urls = galleryFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [galleryFiles]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["computer-lab-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/computer-lab");
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
      aboutTitle: data.aboutTitle || "",
      aboutDescription: data.aboutDescription || "",
      gallerySectionTitle: data.gallerySectionTitle || "",
      gallerySectionSubtitle: data.gallerySectionSubtitle || "",
      stats:
        Array.isArray(data.stats) && data.stats.length
          ? data.stats.map((s, i) => ({
              title: s.title || "",
              icon: s.icon || ICON_OPTIONS[i % ICON_OPTIONS.length].value,
            }))
          : defaultStats(),
      gallery: Array.isArray(data.gallery) ? [...data.gallery] : [],
    });
    setHeroFile(null);
    setAboutFile(null);
    setGalleryFiles([]);
  }, [data]);

  const buildCommonFormData = () => {
    const fd = new FormData();
    fd.append("heroTitle", form.heroTitle);
    fd.append("heroSubtitle", form.heroSubtitle);
    fd.append("aboutTitle", form.aboutTitle);
    fd.append("aboutDescription", form.aboutDescription);
    fd.append("gallerySectionTitle", form.gallerySectionTitle);
    fd.append("gallerySectionSubtitle", form.gallerySectionSubtitle);
    fd.append("stats", JSON.stringify(form.stats));
    return fd;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = buildCommonFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      if (aboutFile) fd.append("aboutImage", aboutFile);
      galleryFiles.forEach((f) => fd.append("gallery", f));

      await axiosSecure.post("/computer-lab", fd);
      alert("Computer lab page created");
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
      setAboutFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(msg);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!docId) return;
    try {
      const fd = buildCommonFormData();
      if (heroFile) fd.append("heroImage", heroFile);
      if (aboutFile) fd.append("aboutImage", aboutFile);

      if (galleryFiles.length > 0) {
        fd.append("galleryExisting", JSON.stringify(form.gallery));
        galleryFiles.forEach((f) => fd.append("gallery", f));
      } else {
        fd.append("galleryUrls", JSON.stringify(form.gallery));
      }

      await axiosSecure.patch(`/computer-lab/${docId}`, fd);
      alert("Computer lab updated");
      refetch();
      setGalleryFiles([]);
      setHeroFile(null);
      setAboutFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(msg);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    if (!window.confirm("Delete all computer lab content? This cannot be undone."))
      return;
    try {
      await axiosSecure.delete(`/computer-lab/${docId}`);
      alert("Deleted");
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

  const updateStat = (index, field, value) => {
    setForm((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
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
        <h1 className="font-bold text-xl">Computer Lab Management</h1>
        <div className="flex flex-wrap gap-2">
          {docId && (
            <>
              <button type="button" className="btn btn-error btn-outline" onClick={handleDelete}>
                <FaTrash /> Delete all
              </button>
            </>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Hero title</span></label>
                <input
                  className="input input-bordered w-full"
                  value={form.heroTitle}
                  onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Hero subtitle</span></label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[80px]"
                  value={form.heroSubtitle}
                  onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Hero image</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full max-w-md"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                />
                {(heroPreviewUrl || (data?.heroImage && !heroFile)) && (
                  <div className="mt-3">
                    <p className="text-xs text-base-content/60 mb-1">
                      {heroPreviewUrl ? "নতুন ছবির প্রিভিউ" : "বর্তমান ছবি"}
                    </p>
                    <img
                      src={heroPreviewUrl || imageSrc(data.heroImage)}
                      alt="Hero preview"
                      className="rounded-lg max-h-48 w-full max-w-md object-cover border border-base-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Stats (4 cards)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {form.stats.map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 items-stretch">
                  <input
                    className="input input-bordered flex-1"
                    placeholder="Title"
                    value={s.title}
                    onChange={(e) => updateStat(i, "title", e.target.value)}
                  />
                  <select
                    className="select select-bordered w-full sm:w-40"
                    value={s.icon}
                    onChange={(e) => updateStat(i, "icon", e.target.value)}
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">About</h2>
            <div className="grid gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">About title</span></label>
                <input
                  className="input input-bordered"
                  value={form.aboutTitle}
                  onChange={(e) => setForm((p) => ({ ...p, aboutTitle: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">About description</span></label>
                <textarea
                  className="textarea textarea-bordered min-h-[120px]"
                  value={form.aboutDescription}
                  onChange={(e) => setForm((p) => ({ ...p, aboutDescription: e.target.value }))}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">About image</span></label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full max-w-md"
                  onChange={(e) => setAboutFile(e.target.files?.[0] || null)}
                />
                {(aboutPreviewUrl || (data?.aboutImage && !aboutFile)) && (
                  <div className="mt-3">
                    <p className="text-xs text-base-content/60 mb-1">
                      {aboutPreviewUrl ? "নতুন ছবির প্রিভিউ" : "বর্তমান ছবি"}
                    </p>
                    <img
                      src={aboutPreviewUrl || imageSrc(data.aboutImage)}
                      alt="About preview"
                      className="rounded-lg max-h-48 w-full max-w-md object-cover border border-base-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Gallery section</h2>
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

            <p className="text-sm text-base-content/70 mb-2">Current images (remove before save to update list)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {form.gallery.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={imageSrc(src)} alt="" className="w-full h-28 object-cover rounded-lg border" />
                  <button
                    type="button"
                    className="btn btn-xs btn-error absolute top-1 right-1 opacity-90"
                    onClick={() => removeGalleryAt(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Add gallery images</span></label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="file-input file-input-bordered w-full max-w-md"
                onChange={(e) =>
                  setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])
                }
              />
              {galleryFiles.length > 0 && (
                <p className="text-sm mt-1">{galleryFiles.length} file(s) will be appended on save</p>
              )}
              {galleryPreviewUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-base-content/60 mb-2">নতুন গ্যালারি ছবির প্রিভিউ</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryPreviewUrls.map((url, i) => (
                      <img
                        key={`${url}-${i}`}
                        src={url}
                        alt=""
                        className="w-full h-28 object-cover rounded-lg border border-base-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="submit" className={`btn ${docId ? "btn-warning" : "btn-primary"}`}>
              {docId ? (
                <>
                  <FaEdit /> Save changes
                </>
              ) : (
                <>
                  <FaPlus /> Create computer lab content
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComputerLabManagement;
