import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaBullseye,
  FaEye,
} from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const MissionVision = () => {
  const axiosSecure = useAxiossecure();

  const modalRef = useRef();
  const modalRefedited = useRef();

  const [editingMission, setEditingmission] = useState(null);

  const { register, handleSubmit, setValue, reset } = useForm();
  const {
    register: registerEdited,
    handleSubmit: handleSubmitEdited,
    setValue: setValueEdited,
  } = useForm();

  // ================= FETCH =================
  const { data: missionData = [], refetch } = useQuery({
    queryKey: ["mission"],
    queryFn: async () => {
      const res = await axiosSecure.get("/mission");
      return res.data;
    },
  });

  // ================= ONLY ONE PER CATEGORY =================
  const missionItem = missionData.find((m) => m.category === "mission");
  const visionItem = missionData.find((m) => m.category === "vision");

  // ================= OPEN ADD =================
  const openAddModal = (category) => {
    setValue("category", category);
    modalRef.current.showModal();
  };

  // ================= ADD =================
  const handleAddmission = async (data) => {
    await axiosSecure.post("/mission", data);
    refetch();
    reset();
    modalRef.current.close();
  };

  // ================= EDIT =================
  const handleEditmission = async (data) => {
    const updatedMission = {
      category: data.editedCategory,
      title: data.editedTitle,
      description: data.editedDescription,
    };

    await axiosSecure.patch(`/mission/${editingMission._id}`, updatedMission);

    refetch();
    modalRefedited.current.close();
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await axiosSecure.delete(`/mission/${id}`);
    refetch();
  };

  const Card = ({ item }) => {
    const isMission = item.category === "mission";

    return (
      <div
        className={`
          relative overflow-hidden rounded-3xl p-8 shadow-2xl
          bg-gradient-to-br 
          ${isMission
            ? "from-blue-500/10 to-blue-200/30"
            : "from-purple-500/10 to-pink-200/30"}
          backdrop-blur-lg border border-white/40
          hover:scale-[1.02] transition-all duration-300
        `}
      >
        {/* Icon */}
        <div
          className={`
            w-14 h-14 flex items-center justify-center rounded-2xl mb-4 text-white text-xl
            ${isMission ? "bg-blue-600" : "bg-purple-600"}
          `}
        >
          {isMission ? <FaBullseye /> : <FaEye />}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold capitalize mb-2">
          {item.category}
        </h2>

        <h3 className="text-lg font-semibold">{item.title}</h3>

        <p className="mt-3 text-sm opacity-80 leading-relaxed">
          {item.description.slice(0,300)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 justify-end mt-6">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => {
              setEditingmission(item);
              modalRefedited.current.showModal();

              setValueEdited("editedCategory", item.category);
              setValueEdited("editedTitle", item.title);
              setValueEdited("editedDescription", item.description);
            }}
          >
            <FaEdit />
          </button>

          <button
            className="btn btn-error btn-sm"
            onClick={() => handleDelete(item._id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-100 to-blue-50 space-y-10">
      {/* ================= HEADER ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 shadow-2xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mission & Vision</h1>
          <p className="text-sm opacity-90">
            Manage your organization goals beautifully
          </p>
        </div>

        <div className="flex gap-3">
          {!missionItem && (
            <button
              onClick={() => openAddModal("mission")}
              className="btn bg-white text-indigo-700 hover:bg-gray-100"
            >
              <FaPlus /> Mission
            </button>
          )}

          {!visionItem && (
            <button
              onClick={() => openAddModal("vision")}
              className="btn bg-white text-purple-700 hover:bg-gray-100"
            >
              <FaPlus /> Vision
            </button>
          )}
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {!missionItem && !visionItem && (
        <div className="text-center py-20 opacity-60">
          <h2 className="text-xl font-semibold">
            No Mission or Vision added yet
          </h2>
          <p>Add one using the buttons above</p>
        </div>
      )}

      {/* ================= GRID ================= */}
      <div className="grid md:grid-cols-2 gap-8">
        {[missionItem, visionItem].filter(Boolean).map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>

      {/* ================= ADD MODAL ================= */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box rounded-3xl p-8 space-y-5">
          <h3 className="text-xl font-bold">Add Mission / Vision</h3>

          <form
            onSubmit={handleSubmit(handleAddmission)}
            className="space-y-4"
          >
            <select
              {...register("category")}
              className="select select-bordered w-full"
            >
              <option value="mission">Mission</option>
              <option value="vision">Vision</option>
            </select>

            <input
              {...register("title")}
              placeholder="Title"
              className="input input-bordered w-full"
            />

            <textarea
              {...register("description")}
              placeholder="Description"
              className="textarea textarea-bordered w-full h-32"
            />

            <button className="btn btn-primary w-full">Save</button>
          </form>
        </div>
      </dialog>

      {/* ================= EDIT MODAL ================= */}
      <dialog ref={modalRefedited} className="modal">
        <div className="modal-box rounded-3xl p-8 space-y-5">
          <h3 className="text-xl font-bold">Edit</h3>

          <form
            onSubmit={handleSubmitEdited(handleEditmission)}
            className="space-y-4"
          >
            <select
              {...registerEdited("editedCategory")}
              className="select select-bordered w-full"
            >
              <option value="mission">Mission</option>
              <option value="vision">Vision</option>
            </select>

            <input
              {...registerEdited("editedTitle")}
              className="input input-bordered w-full"
            />

            <textarea
              {...registerEdited("editedDescription")}
              className="textarea textarea-bordered w-full h-32"
            />

            <button className="btn btn-primary w-full">Update</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default MissionVision;
