import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaPlus, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";

const FooterManagement = () => {
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      importantLinks: [{ title: "", url: "" }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "importantLinks"
  });

  const [preview, setPreview] = useState("");

  const { data: footer, refetch, isLoading } = useQuery({
    queryKey: ["footer"],
    queryFn: async () => {
      const res = await axiosSecure.get("/footer");
      return res.data;
    },
  });

  useEffect(() => {
    if (footer) {
      const formData = {
        description: footer.about?.description || "",
        facebook: footer.about?.socialLinks?.facebook || "",
        instagram: footer.about?.socialLinks?.instagram || "",
        youtube: footer.about?.socialLinks?.youtube || "",
        location: footer.location || "",
        phone: footer.contact?.phone || "",
        email: footer.contact?.email || "",
        website: footer.contact?.website || "",
        copyright: footer.copyright || "",
        importantLinks: footer.importantLinks || [{ title: "", url: "" }]
      };
      reset(formData);
      setPreview(footer.about?.logo ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${footer.about.logo}` : "");
    }
  }, [footer, reset]);

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

    // About section
    formData.append("description", data.description || "");
    formData.append("facebook", data.facebook || "");
    formData.append("instagram", data.instagram || "");
    formData.append("youtube", data.youtube || "");

    // Important links
    formData.append("importantLinks", JSON.stringify(data.importantLinks.filter(link => link.title && link.url)));

    // Location and contact
    formData.append("location", data.location || "");
    formData.append("phone", data.phone || "");
    formData.append("email", data.email || "");
    formData.append("website", data.website || "");
    formData.append("copyright", data.copyright || "");

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    try {
      if (footer?._id) {
        // Update existing footer
        await axiosSecure.patch(`/footer/${footer._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Footer updated successfully!");
      } else {
        // Create new footer
        await axiosSecure.post("/footer", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Footer created successfully!");
      }

      refetch();
      document.getElementById("footer_modal").close();
    } catch (error) {
      console.error("Error saving footer:", error);
      alert("Failed to save footer. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!footer?._id) return;
    if (!confirm("Are you sure you want to delete the footer?")) return;

    try {
      await axiosSecure.delete(`/footer/${footer._id}`);
      reset({
        description: "",
        facebook: "",
        instagram: "",
        youtube: "",
        location: "",
        phone: "",
        email: "",
        website: "",
        copyright: "",
        importantLinks: [{ title: "", url: "" }]
      });
      setPreview("");
      refetch();
      alert("Footer deleted successfully!");
    } catch (error) {
      console.error("Error deleting footer:", error);
      alert("Failed to delete footer. Please try again.");
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
            🦶 Footer Management
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-success gap-2"
              onClick={() => document.getElementById("footer_modal").showModal()}
            >
              <FaEdit />
              {footer ? "Edit Footer" : "Create Footer"}
            </button>

            {footer && (
              <button
                className="btn btn-error gap-2"
                onClick={handleDelete}
              >
                <FaTrash />
                Delete Footer
              </button>
            )}
          </div>
        </div>

        {/* Current Footer Display */}
        {footer ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Current Footer Content</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* About Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 text-lg">About Section</h3>

                <div className="flex items-center gap-4">
                  {footer.about?.logo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${footer.about.logo}`}
                      alt="Footer Logo"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Logo</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {footer.about?.socialLinks?.facebook && (
                      <a href={footer.about.socialLinks.facebook} className="text-blue-600 hover:text-blue-800">
                        <FaFacebook size={20} />
                      </a>
                    )}
                    {footer.about?.socialLinks?.instagram && (
                      <a href={footer.about.socialLinks.instagram} className="text-pink-600 hover:text-pink-800">
                        <FaInstagram size={20} />
                      </a>
                    )}
                    {footer.about?.socialLinks?.youtube && (
                      <a href={footer.about.socialLinks.youtube} className="text-red-600 hover:text-red-800">
                        <FaYoutube size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {footer.about?.description || "No description set"}
                  </div>
                </div>
              </div>

              {/* Other Sections */}
              <div className="space-y-6">
                {/* Important Links */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Important Links</h3>
                  <div className="space-y-2">
                    {footer.importantLinks?.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-blue-600 hover:text-blue-800 underline text-sm">
                          {link.title}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-600 text-sm break-all">{link.url}</span>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No links added</p>}
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                      {footer.location || "Not set"}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Copyright</h3>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                      {footer.copyright || "Not set"}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    {footer.contact?.phone && <p><strong>Phone:</strong> {footer.contact.phone}</p>}
                    {footer.contact?.email && <p><strong>Email:</strong> {footer.contact.email}</p>}
                    {footer.contact?.website && <p><strong>Website:</strong> {footer.contact.website}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <FaEdit className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Footer Content</h2>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Create your footer content to get started.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("footer_modal").showModal()}
            >
              Create Footer
            </button>
          </div>
        )}

        {/* Modal */}
        <dialog id="footer_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-6">
              {footer ? "Edit Footer" : "Create Footer"}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* About Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">About Section</h4>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      placeholder="Enter footer description"
                      {...register("description")}
                      className="textarea textarea-bordered w-full h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Logo Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("file")}
                      className="file-input file-input-bordered w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200px
                    </p>
                  </div>

                  {preview && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview</label>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Social Links</h5>
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      {...register("facebook")}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      {...register("instagram")}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      {...register("youtube")}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {/* Other Sections */}
                <div className="space-y-4">
                  {/* Important Links */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Important Links</h4>
                      <button
                        type="button"
                        onClick={() => append({ title: "", url: "" })}
                        className="btn btn-sm btn-outline"
                      >
                        <FaPlus /> Add Link
                      </button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <input
                              placeholder="Link Title"
                              {...register(`importantLinks.${index}.title`)}
                              className="input input-bordered w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="url"
                              placeholder="URL"
                              {...register(`importantLinks.${index}.url`)}
                              className="input input-bordered w-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="btn btn-sm btn-error"
                            disabled={fields.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      {...register("location")}
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Contact Information</h4>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phone")}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email")}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="url"
                      placeholder="Website URL"
                      {...register("website")}
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Copyright */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Copyright Text</label>
                    <input
                      type="text"
                      placeholder="Enter copyright text"
                      {...register("copyright")}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-action flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("footer_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {footer ? "Update Footer" : "Create Footer"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default FooterManagement;