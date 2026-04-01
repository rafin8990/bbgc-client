import { useForm } from "react-hook-form";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const SliderManagement = () => {
  const [editSlider, setEditSlider] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // edit form
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
  } = useForm();

  const axiosSecure = useAxiossecure();
  const { data: sliders, refetch } = useQuery({
    queryKey: ['slider'],
    queryFn: async () => {
      const res = await axiosSecure.get('/slider');
      return res.data;
    }
  });

  const handleSlider = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await axiosSecure.post('/slider', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      refetch();
      alert("Slider Added");
      document.getElementById("upload_slider_modal").close();
      reset();
    } catch (error) {
      alert(error.message);
    }
  };

  // Edit Slider
  const handleEditSlider = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await axiosSecure.patch(`/slider/${editSlider._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      refetch();
      alert("Slider Updated");
      document.getElementById("edit_slider_modal").close();
      setEditSlider(null);
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete Slider
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      axiosSecure.delete(`/slider/${id}`)
        .then(() => {
          refetch();
          alert("Slider Deleted");
        })
        .catch(error => {
          alert(error.message);
        });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          🖼️ Slider Management
        </h1>

        {/* Open Modal Button */}
        <button
          className="btn btn-success gap-2"
          onClick={() =>
            document.getElementById("upload_slider_modal").showModal()
          }
        >
          <FaPlus />
          Add New Slider
        </button>
      </div>

      {/* Slider List */}
      <div className="grid gap-6">
        {sliders?.map((slider) => (
          <div
            key={slider._id}
            className="card bg-base-100 shadow-md"
          >
            <div className="card-body">
              <div className="flex gap-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}${slider.image}`}
                  alt={slider.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="card-title">{slider.title}</h2>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(slider.createdAt).toLocaleDateString()}
                  </p>
                  {slider.updatedAt && (
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(slider.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-info btn-sm gap-2"
                  onClick={() => {
                    setEditSlider(slider);
                    editReset({ title: slider.title });
                    document.getElementById("edit_slider_modal").showModal();
                  }}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(slider._id)}
                  className="btn btn-error btn-sm gap-2"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <dialog
        id="upload_slider_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Add New Slider
          </h3>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleSlider)}
          >
            <input
              type="text"
              placeholder="Slider Title"
              {...register("title", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.title && (
              <p className="text-red-500">Title is required</p>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("image", { required: true })}
              className="file-input file-input-bordered w-full"
            />
            {errors.image && (
              <p className="text-red-500">Image is required</p>
            )}

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("upload_slider_modal").close()
                }
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-success">
                Add Slider
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Modal */}
      <dialog id="edit_slider_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Edit Slider
          </h3>

          <form
            className="space-y-4"
            onSubmit={handleEditSubmit(handleEditSlider)}
          >
            <input
              type="text"
              placeholder="Slider Title"
              {...editRegister("title", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              accept="image/*"
              {...editRegister("image")}
              className="file-input file-input-bordered w-full"
            />
            <p className="text-sm text-gray-500">Leave empty to keep current image</p>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  document.getElementById("edit_slider_modal").close();
                  setEditSlider(null);
                }}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-success">
                Update Slider
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default SliderManagement;