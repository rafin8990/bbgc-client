import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { FaMapLocationDot, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa6";
import useAxiossecure from "../Hooks/useAxiossecure";

const ContactManagement = () => {
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, reset, watch } = useForm();

  const { data: contact, refetch, isLoading } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contact");
      return res.data;
    },
  });

  useEffect(() => {
    if (contact) {
      reset(contact);
    }
  }, [contact, reset]);

  const onSubmit = async (data) => {
    try {
      if (contact?._id) {
        // Update existing contact
        await axiosSecure.patch(`/contact/${contact._id}`, data);
        alert("Contact information updated successfully!");
      } else {
        // Create new contact
        await axiosSecure.post("/contact", data);
        alert("Contact information created successfully!");
      }

      refetch();
      document.getElementById("contact_modal").close();
    } catch (error) {
      console.error("Error saving contact:", error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save contact information. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    if (!contact?._id) return;
    if (!confirm("Are you sure you want to delete the contact information?")) return;

    try {
      await axiosSecure.delete(`/contact/${contact._id}`);
      reset({});
      refetch();
      alert("Contact information deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete contact information. Please try again."
      );
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
            📞 Contact Management
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-success gap-2"
              onClick={() => document.getElementById("contact_modal").showModal()}
            >
              <FaEdit />
              {contact ? "Edit Contact" : "Create Contact"}
            </button>

            {contact && (
              <button
                className="btn btn-error gap-2"
                onClick={handleDelete}
              >
                <FaEdit />
                Delete Contact
              </button>
            )}
          </div>
        </div>

        {/* Current Contact Display */}
        {contact ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Current Contact Information</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Title</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.title || "No title set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Subtitle</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.subtitle || "No subtitle set"}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaMapLocationDot className="text-blue-500" />
                    Address
                  </h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words whitespace-pre-wrap">
                    {contact.address || "No address set"}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaGlobe className="text-green-500" />
                    Website
                  </h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.web ? (
                      <a
                        href={contact.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.web}
                      </a>
                    ) : (
                      "No website set"
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-red-500" />
                    Email
                  </h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.email}
                      </a>
                    ) : (
                      "No email set"
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-purple-500" />
                    Phone
                  </h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      "No phone set"
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Map URL</h3>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {contact.mapUrl ? (
                      <a
                        href={contact.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Map
                      </a>
                    ) : (
                      "No map URL set"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <FaMapLocationDot className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Contact Information</h2>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Create contact information to get started.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("contact_modal").showModal()}
            >
              Create Contact Info
            </button>
          </div>
        )}

        {/* Modal */}
        <dialog id="contact_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-6">
              {contact ? "Edit Contact Information" : "Create Contact Information"}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-1 gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Contact page title"
                      {...register("title")}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <input
                      type="text"
                      placeholder="Contact page subtitle"
                      {...register("subtitle")}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    placeholder="Full address (multiple lines allowed)"
                    {...register("address")}
                    className="textarea textarea-bordered w-full h-24"
                    rows="3"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://www.example.com"
                      {...register("web")}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      {...register("email")}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+880 123 456 7890"
                      {...register("phone")}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Map URL</label>
                    <input
                      type="url"
                      placeholder="Google Maps embed URL"
                      {...register("mapUrl")}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-action flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("contact_modal").close()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {contact ? "Update Contact" : "Create Contact"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default ContactManagement;