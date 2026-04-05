import React, { useEffect, useRef, useState } from "react";
import useAxiossecure from "../Hooks/useAxiossecure";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";

const StaffManagement = () => {
  const [editingStaff, setEditingStaff] = useState(null);
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit } = useForm();
  const {
    register: registerEdited,
    handleSubmit: handleSubmitEdited,
    reset,
  } = useForm();
  const modalRef = useRef(null);
  const modalEditRef = useRef(null);

  const {
    data: staffList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staff");
      return res.data;
    },
  });

  useEffect(() => {
    if (editingStaff) {
      reset({
        editedName: editingStaff.name || "",
        editedJoiningDate: editingStaff.joiningDate || "",
        editedDateOfBirth: editingStaff.dateOfBirth || "",
        editedPosition: editingStaff.position || "",
        editedPhone: editingStaff.phone || "",
        editedEmail: editingStaff.email || "",
        editedAge:
          editingStaff.age === null || editingStaff.age === undefined
            ? ""
            : String(editingStaff.age),
      });
    }
  }, [editingStaff, reset]);

  const apiBase = import.meta.env.VITE_API_URL || "";

  const staffPayload = (data) => ({
    name: data.name,
    joiningDate: data.joiningDate || "",
    dateOfBirth: data.dateOfBirth || "",
    position: data.position || "",
    phone: data.phone || "",
    email: data.email || "",
    age:
      data.age === "" || data.age === undefined || data.age === null
        ? ""
        : data.age,
  });

  const handleAddStaff = (data) => {
    const file = data.file?.[0];
    const request = file
      ? (() => {
          const formData = new FormData();
          Object.entries(staffPayload(data)).forEach(([k, v]) => {
            formData.append(k, v === null || v === undefined ? "" : String(v));
          });
          formData.append("file", file);
          return axiosSecure.post("/staff", formData);
        })()
      : axiosSecure.post("/staff", staffPayload(data));

    request
      .then(() => {
        refetch();
        modalRef.current?.close();
        alert("Staff added successfully");
      })
      .catch((err) => {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Network error — check API URL (VITE_API_URL) and that the server is running."
            : err.message);
        alert(msg);
      });
  };

  const handleUpdateStaff = (data) => {
    if (!editingStaff) return;
    const file = data.editedFile?.[0];
    const body = {
      name: data.editedName,
      joiningDate: data.editedJoiningDate || "",
      dateOfBirth: data.editedDateOfBirth || "",
      position: data.editedPosition || "",
      phone: data.editedPhone || "",
      email: data.editedEmail || "",
      age:
        data.editedAge === "" ||
        data.editedAge === undefined ||
        data.editedAge === null
          ? ""
          : data.editedAge,
    };

    const request = file
      ? (() => {
          const formData = new FormData();
          Object.entries(body).forEach(([k, v]) => {
            formData.append(k, v === null || v === undefined ? "" : String(v));
          });
          formData.append("file", file);
          return axiosSecure.patch(`/staff/${editingStaff._id}`, formData);
        })()
      : axiosSecure.patch(`/staff/${editingStaff._id}`, body);

    request
      .then(() => {
        refetch();
        modalEditRef.current?.close();
        setEditingStaff(null);
        alert("Staff updated successfully");
      })
      .catch((err) => {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Network error — check VITE_API_URL and that the server is running."
            : err.message);
        alert(msg);
      });
  };

  const handleDeleteStaff = (id) => {
    axiosSecure
      .delete(`/staff/${id}`)
      .then(() => {
        refetch();
        alert("Staff deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || err.message);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center shadow-2xl p-5">
        <h1 className="font-bold text-lg">
          Staff Management ({staffList?.length ?? 0})
        </h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => modalRef.current?.showModal()}
        >
          <FaPlus /> Add Staff
        </button>
      </div>

      {isLoading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Photo</th>
                <th>Name</th>
                <th>Position</th>
                <th>Joining date</th>
                <th>Date of birth</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList?.map((row, i) => (
                <tr key={row._id}>
                  <th>{i + 1}</th>
                  <td>
                    <img
                      src={
                        row.image
                          ? `${apiBase}${row.image}`
                          : "/placeholder.png"
                      }
                      className="w-16 h-16 object-cover rounded"
                      alt={row.name}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>{row.position}</td>
                  <td>{row.joiningDate || "—"}</td>
                  <td>{row.dateOfBirth || "—"}</td>
                  <td>
                    {row.age !== null && row.age !== undefined ? row.age : "—"}
                  </td>
                  <td>{row.phone || "—"}</td>
                  <td>{row.email || "—"}</td>
                  <td className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(row._id)}
                      className="btn btn-warning btn-sm"
                    >
                      <FaTrash />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStaff(row);
                        modalEditRef.current?.showModal();
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-xl mb-4">Add staff</h3>
          <form
            onSubmit={handleSubmit(handleAddStaff)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              {...register("name", { required: true })}
              placeholder="Name"
              className="input input-bordered w-full"
            />
            <input
              {...register("position", { required: true })}
              placeholder="Position"
              className="input input-bordered w-full"
            />
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text">Joining date</span>
              </label>
              <input
                type="date"
                {...register("joiningDate")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text">Date of birth</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="input input-bordered w-full"
              />
            </div>
            <input
              {...register("age")}
              placeholder="Age (optional)"
              type="number"
              min={0}
              className="input input-bordered w-full"
            />
            <input
              {...register("phone")}
              placeholder="Phone"
              className="input input-bordered w-full"
            />
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="input input-bordered w-full md:col-span-2"
            />
            <input
              type="file"
              accept="image/*"
              {...register("file")}
              className="file-input file-input-bordered w-full md:col-span-2"
            />
            <div className="modal-action md:col-span-2">
              <button
                type="button"
                className="btn"
                onClick={() => modalRef.current?.close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog
        ref={modalEditRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-xl mb-4">Edit staff</h3>
          <form
            onSubmit={handleSubmitEdited(handleUpdateStaff)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              {...registerEdited("editedName", { required: true })}
              placeholder="Name"
              className="input input-bordered w-full"
            />
            <input
              {...registerEdited("editedPosition", { required: true })}
              placeholder="Position"
              className="input input-bordered w-full"
            />
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text">Joining date</span>
              </label>
              <input
                type="date"
                {...registerEdited("editedJoiningDate")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text">Date of birth</span>
              </label>
              <input
                type="date"
                {...registerEdited("editedDateOfBirth")}
                className="input input-bordered w-full"
              />
            </div>
            <input
              {...registerEdited("editedAge")}
              placeholder="Age (optional)"
              type="number"
              min={0}
              className="input input-bordered w-full"
            />
            <input
              {...registerEdited("editedPhone")}
              placeholder="Phone"
              className="input input-bordered w-full"
            />
            <input
              {...registerEdited("editedEmail")}
              placeholder="Email"
              type="email"
              className="input input-bordered w-full md:col-span-2"
            />
            <input
              type="file"
              accept="image/*"
              {...registerEdited("editedFile")}
              className="file-input file-input-bordered w-full md:col-span-2"
            />
            <div className="modal-action md:col-span-2">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  modalEditRef.current?.close();
                  setEditingStaff(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default StaffManagement;
