import React, { useRef, useState } from 'react';
import useAxiossecure from '../Hooks/useAxiossecure';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

const Atglance = () => {
  const axiosSecure = useAxiossecure();
  const [editingGlance, setEditingGlance] = useState(null);
  const [preview, setPreview] = useState(null); // preview for add/edit
  const modalRef = useRef();
  const modalRefEdited = useRef();

  const { register, handleSubmit, reset } = useForm();
  const { register: registerEdited, handleSubmit: handleSubmitedited, setValue } = useForm();

  const backendURL = "http://localhost:3000"; // replace with your backend URL

  // Fetch glance data
  const { data: glanceData, refetch } = useQuery({
    queryKey: ["glance"],
    queryFn: async () => {
      const res = await axiosSecure.get('/glance');
      return res.data;
    }
  });

  // ---------------- Add Glance ----------------
  const handleAddglance = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const res = await axiosSecure.post("/glance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.insertedId) {
        refetch();
        modalRef.current.close();
        setPreview(null);
        reset();
        alert("Glance Added");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ---------------- Delete Glance ----------------
  const handleDeleteglance = (id) => {
    axiosSecure.delete(`/glance/${id}`)
      .then(res => {
        refetch();
        alert("Glance Deleted");
      })
      .catch(error => {
        console.error(error);
        alert(error.message);
      });
  };

  // ---------------- Edit Glance ----------------
  const handleEditglance = async (data) => {
    const formData = new FormData();
    formData.append("editedTitle", data.editedTitle);
    formData.append("editedDescription", data.editedDescription);

    if (data.editedImage && data.editedImage[0]) {
      formData.append("image", data.editedImage[0]);
    }

    try {
      const res = await axiosSecure.patch(`/glance/${editingGlance._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      refetch();
      modalRefEdited.current.close();
      setPreview(null);
      alert("Glance Edited");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">At a Glance</h1>

        {glanceData?.length === 0 && (
          <button
            className="btn btn-success gap-2"
            onClick={() => {
              setPreview(null);
              modalRef.current.showModal();
            }}
          >
            <FaPlus /> Add Glance
          </button>
        )}
      </div>

      {/* Glance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {glanceData?.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden border">
            {/* Image */}
            <img
              src={item.image ? `${backendURL}${item.image}` : '/placeholder.png'}
              alt={item.title}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-slate-800">{item.title}</h2>
              <p className="text-sm text-slate-600 line-clamp-3">{item.description}</p>

              {/* Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setEditingGlance(item);
                    setValue("editedTitle", item.title);
                    setValue("editedDescription", item.description);
                    setPreview(item.image ? `${backendURL}${item.image}` : null);
                    modalRefEdited.current.showModal();
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDeleteglance(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Add Glance Modal ===== */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-xl mb-4">Add Glance</h3>

          <form onSubmit={handleSubmit(handleAddglance)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("title")} placeholder="Title" className="input input-bordered w-full" />

            <input
              type="file"
              {...register("image")}
              onChange={(e) => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))}
              className="file-input file-input-bordered w-full md:col-span-2"
            />

            {preview && <img src={preview} className="w-32 h-32 object-cover mt-2" />}

            <textarea {...register("description")} placeholder="Description" className="textarea textarea-bordered w-full md:col-span-2" />

            <div className="modal-action md:col-span-2">
              <button type="button" className="btn" onClick={() => modalRef.current.close()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Glance</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* ===== Edit Glance Modal ===== */}
      <dialog ref={modalRefEdited} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-xl mb-4">Edit Glance</h3>

          <form onSubmit={handleSubmitedited(handleEditglance)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...registerEdited("editedTitle")} placeholder="Title" className="input input-bordered w-full" />

            <input
              type="file"
              {...registerEdited("editedImage")}
              onChange={(e) => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))}
              className="file-input file-input-bordered w-full md:col-span-2"
            />

            {preview && <img src={preview} className="w-32 h-32 object-cover mt-2" />}

            <textarea {...registerEdited("editedDescription")} placeholder="Description" className="textarea textarea-bordered w-full md:col-span-2" />

            <div className="modal-action md:col-span-2">
              <button type="button" className="btn" onClick={() => modalRefEdited.current.close()}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Atglance;
