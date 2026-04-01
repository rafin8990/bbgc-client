import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";

const AboutManagement = () => {
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, reset, watch } = useForm();
  const [preview, setPreview] = useState("");
  const [stats, setStats] = useState([{ label: "", value: "", icon: "" }]);

  const { data: about, refetch, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const res = await axiosSecure.get("/about");
      return res.data;
    },
  });

  useEffect(() => {
    if (about) {
      const { _id, image, stats: aboutStats, ...rest } = about;
      reset(rest);
      setPreview(image ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${image}` : "");
      setStats(aboutStats && aboutStats.length > 0 ? aboutStats : [{ label: "", value: "", icon: "" }]);
    }
  }, [about, reset]);

  const watchedFile = watch("file");

  useEffect(() => {
    if (watchedFile && watchedFile[0]) {
      const file = watchedFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedFile]);

  const addStat = () => {
    setStats([...stats, { label: "", value: "", icon: "" }]);
  };

  const removeStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("aboutTitle", data.aboutTitle);
    formData.append("aboutSubtitle", data.aboutSubtitle);
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("stats", JSON.stringify(stats.filter(stat => stat.label && stat.value)));

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    try {
      if (about?._id) {
        // Update existing about
        await axiosSecure.patch(`/about/${about._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("About content updated successfully!");
      } else {
        // Create new about
        await axiosSecure.post("/about", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("About content created successfully!");
      }

      refetch();
      document.getElementById("about_modal").close();
    } catch (error) {
      console.error("Error saving about:", error);
      alert("Failed to save about content. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!about?._id) return;
    if (!confirm("Are you sure you want to delete the about content?")) return;

    try {
      await axiosSecure.delete(`/about/${about._id}`);
      reset({});
      setPreview("");
      setStats([{ label: "", value: "", icon: "" }]);
      refetch();
      alert("About content deleted successfully!");
    } catch (error) {
      console.error("Error deleting about:", error);
      alert("Failed to delete about content. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            📖 About Management
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-success gap-2"
              onClick={() => document.getElementById("about_modal").showModal()}
            >
              <FaEdit />
              {about ? "Edit About" : "Create About"}
            </button>

            {about && (
              <button
                className="btn btn-error gap-2"
                onClick={handleDelete}
              >
                <FaTrash />
                Delete About
              </button>
            )}
          </div>
        </div>

        {/* Current About Display */}
        {about ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current About Content</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">About Image</h3>
                {about.image ? (
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${about.image}`}
                      alt="About"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      Current Image
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg border flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FaImage className="mx-auto text-3xl mb-2" />
                      <p>No image uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">About Title</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {about.aboutTitle || "No title set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">About Subtitle</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {about.aboutSubtitle || "No subtitle set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Section Title</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {about.title || "No section title set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Content</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-relaxed break-words whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {about.content || "No content set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Statistics</h3>
                  <div className="space-y-2">
                    {about.stats && about.stats.length > 0 ? (
                      about.stats.map((stat, index) => (
                        <div key={index} className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                          <strong>{stat.label}:</strong> {stat.value} {stat.icon}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 bg-gray-50 p-3 rounded-lg">
                        No statistics set
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <FaImage className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No About Content</h2>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Create your first about content to get started.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("about_modal").showModal()}
            >
              Create About Content
            </button>
          </div>
        )}

        {/* Modal */}
        <dialog id="about_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-6">
              {about ? "Edit About Content" : "Create About Content"}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">About Title</label>
                  <input
                    type="text"
                    placeholder="Enter about title"
                    {...register("aboutTitle", { required: "About title is required" })}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">About Subtitle</label>
                  <input
                    type="text"
                    placeholder="Enter about subtitle"
                    {...register("aboutSubtitle")}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  placeholder="Enter section title"
                  {...register("title", { required: "Section title is required" })}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  placeholder="Enter about content"
                  {...register("content", { required: "Content is required" })}
                  className="textarea textarea-bordered w-full h-32 resize-vertical"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">About Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("file")}
                  className="file-input file-input-bordered w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Recommended size: 800x600px
                </p>
              </div>

              {/* Image Preview */}
              {preview && (
                <div>
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-lg border"
                  />
                </div>
              )}

              {/* Statistics Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Statistics</label>
                  <button
                    type="button"
                    onClick={addStat}
                    className="btn btn-sm btn-outline"
                  >
                    <FaPlus /> Add Stat
                  </button>
                </div>

                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 border rounded-lg">
                      <input
                        type="text"
                        placeholder="Label (e.g., Students)"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="input input-bordered input-sm"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., 5000)"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="input input-bordered input-sm"
                      />
                      <input
                        type="text"
                        placeholder="Icon/Suffix (e.g., +)"
                        value={stat.icon}
                        onChange={(e) => updateStat(index, 'icon', e.target.value)}
                        className="input input-bordered input-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="btn btn-sm btn-error"
                        disabled={stats.length === 1}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-action flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("about_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {about ? "Update About" : "Create About"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AboutManagement;