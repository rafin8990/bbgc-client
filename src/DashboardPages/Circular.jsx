import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiossecure from "../Hooks/useAxiossecure";

const Circular = () => {
  const modalRef = useRef();
  const modalRefedited = useRef();

  const axiosSecure = useAxiossecure();

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerEdited,
    handleSubmit: handleSubmitEdited,
    setValue,
  } = useForm();

  const [isEditing, setIsEditing] = useState(null);

  /* ================= FETCH DATA ================= */
  const { data: circularData = [], refetch, isLoading } = useQuery({
    queryKey: ["circular"],
    queryFn: async () => {
      const res = await axiosSecure.get("/circular");
      return res.data;
    },
  });

  /* ================= ADD ================= */
  const handleCircular = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("file", data.file[0]);

    try {
      const res = await axiosSecure.post("/circular", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.insertedId) {
        refetch();
        reset();
        modalRef.current.close();
        alert("Circular uploaded successfully");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/circular/${id}`);
      refetch();
      alert("Deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.editedTitle);

    if (data.editedFile?.[0]) {
      formData.append("file", data.editedFile[0]);
    }

    try {
      await axiosSecure.patch(`/circular/${isEditing._id}`, formData);
      refetch();
      modalRefedited.current.close();
      alert("Updated successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Circular Management</h1>

        <button
          onClick={() => modalRef.current.showModal()}
          className="btn btn-success gap-2"
        >
          <FaPlus /> Add Circular
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-center">View</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : circularData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No circular found
                </td>
              </tr>
            ) : (
              circularData.map((item, i) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>

                  <td className="px-4 py-3 font-medium">{item.title}</td>

                  {/* VIEW */}
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL || "http://localhost:3000"
                      }${item.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-xs btn-info gap-1"
                    >
                      <FaEye /> View
                    </a>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => {
                        setIsEditing(item);
                        setValue("editedTitle", item.title);
                        modalRefedited.current.showModal();
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-xs btn-warning"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Circular</h3>

          <form onSubmit={handleSubmit(handleCircular)} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              accept="application/pdf"
              {...register("file", { required: true })}
              className="file-input file-input-bordered w-full"
            />

            <div className="modal-action">
              <button type="button" onClick={() => modalRef.current.close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* ================= EDIT MODAL ================= */}
      <dialog ref={modalRefedited} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Circular</h3>

          <form onSubmit={handleSubmitEdited(handleEdit)} className="space-y-4">
            <input
              type="text"
              {...registerEdited("editedTitle", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              accept="application/pdf"
              {...registerEdited("editedFile")}
              className="file-input file-input-bordered w-full"
            />

            <div className="modal-action">
              <button type="button" onClick={() => modalRefedited.current.close()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Circular;
