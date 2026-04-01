import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaImage } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";

const HeaderManagement = () => {
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, reset, watch } = useForm();
  const [preview, setPreview] = useState("");

  const { data: header, refetch, isLoading } = useQuery({
    queryKey: ["header"],
    queryFn: async () => {
      const res = await axiosSecure.get("/header");
      return res.data;
    },
  });

  useEffect(() => {
    if (header) {
      const { _id, image, ...rest } = header;
      reset(rest);
      setPreview(image ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${image}` : "");
    }
  }, [header, reset]);

  const watchedFile = watch("file");

  useEffect(() => {
    if (watchedFile && watchedFile[0]) {
      const file = watchedFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedFile]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("einNumber", data.einNumber || "");
    formData.append("establishmentDate", data.establishmentDate || "");
    formData.append("location", data.location || "");

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    try {
      if (header?._id) {
        // Update existing header
        await axiosSecure.patch(`/header/${header._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Header updated successfully!");
      } else {
        // Create new header
        await axiosSecure.post("/header", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Header created successfully!");
      }

      refetch();
      document.getElementById("header_modal").close();
    } catch (error) {
      console.error("Error saving header:", error);
      alert("Failed to save header. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!header?._id) return;
    if (!confirm("Are you sure you want to delete the header?")) return;

    try {
      await axiosSecure.delete(`/header/${header._id}`);
      reset({});
      setPreview("");
      refetch();
      alert("Header deleted successfully!");
    } catch (error) {
      console.error("Error deleting header:", error);
      alert("Failed to delete header. Please try again.");
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
            🎨 Header Management
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-success gap-2"
              onClick={() => document.getElementById("header_modal").showModal()}
            >
              <FaEdit />
              {header ? "Edit Header" : "Create Header"}
            </button>

            {header && (
              <button
                className="btn btn-error gap-2"
                onClick={handleDelete}
              >
                <FaEdit />
                Delete Header
              </button>
            )}
          </div>
        </div>

      {/* Current Header Display */}
      {header ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Header Content</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Header Image</h3>
              {header.image ? (
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${header.image}`}
                    alt="Header"
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
                <h3 className="font-medium text-gray-700 mb-2">Title</h3>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                  {header.title || "No title set"}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-relaxed break-words whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {header.description || "No description set"}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">EIN Number</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {header.einNumber || "Not set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Establishment Date</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {header.establishmentDate || "Not set"}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">College Location</h3>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                  {header.location || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
          <FaImage className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Header Content</h2>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Create your first header content to get started.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("header_modal").showModal()}
          >
            Create Header
          </button>
        </div>
      )}

      {/* Modal */}
      <dialog id="header_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">
            {header ? "Edit Header" : "Create Header"}
          </h3>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter header title"
                  {...register("title", { required: "Title is required" })}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Enter header description"
                  {...register("description", { required: "Description is required" })}
                  className="textarea textarea-bordered w-full h-32 resize-vertical"
                  rows="4"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">EIN Number</label>
                  <input
                    type="text"
                    placeholder="Enter EIN number (e.g., 130172)"
                    {...register("einNumber")}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">School Establishment Date</label>
                  <input
                    type="text"
                    placeholder="Enter establishment date (e.g., 1709)"
                    {...register("establishmentDate")}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">College Location</label>
                <input
                  type="text"
                  placeholder="Enter college location (e.g., Beanibazar, Sylhet, Bangladesh)"
                  {...register("location")}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Header Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("file")}
                  className="file-input file-input-bordered w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Recommended size: 1200x400px
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
            </div>

            <div className="modal-action flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("header_modal").close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {header ? "Update Header" : "Create Header"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      </div>
    </div>
  );
};

export default HeaderManagement;