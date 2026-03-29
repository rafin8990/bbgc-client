import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaRegNewspaper, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const ExamRoutine = () => {
  const [editingRoutine, setEditingRoutine] = useState(null);
  const modalRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue
  } = useForm();

  const axiosSecure = useAxiossecure();

  /* ================= GET EXAM ROUTINE ================= */
  const { data: routineData = [], refetch } = useQuery({
    queryKey: ["examRoutine"],
    queryFn: async () => {
      const res = await axiosSecure.get("/exam-routine");
      return res.data;
    }
  });

  /* ================= ADD ================= */
  const handleAddRoutine = (data) => {
    axiosSecure.post("/exam-routine", data).then(() => {
      refetch();
      alert("Exam Routine Added");
      document.getElementById("upload_exam_modal").close();
      reset();
    });
  };

  /* ================= DELETE ================= */
  const handleDeleteRoutine = (id) => {
    axiosSecure.delete(`/exam-routine/${id}`).then(() => {
      refetch();
      alert("Exam Routine Deleted");
    });
  };

  /* ================= EDIT ================= */
  const handleEditRoutine = (data) => {
   const updatedData = {
    examName: data.editedExamName,
    className: data.editedClassName,
    subject: data.editedSubject,
    date: data.editedDate,
    startTime: data.editedStartTime,
    endTime: data.editedEndTime,
    venue: data.editedVenue
  };

    axiosSecure
      .patch(`/exam-routine/${editingRoutine._id}`, updatedData)
      .then(() => {
        refetch();
        alert("Exam Routine Updated");
        modalRef.current.close();
      });
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl flex items-center font-bold text-slate-800">
          <FaRegNewspaper className="mx-2 text-blue-400" />
          Manage Exam Routine
        </h1>

        <button
          className="btn btn-success gap-2"
          onClick={() =>
            document.getElementById("upload_exam_modal").showModal()
          }
        >
          <FaPlus />
          Add Exam Routine
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Exam Name</th>
              <th>Class</th>
              <th>Day</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Invigilator</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {routineData.map((routine, i) => (
              <tr key={routine._id}>
                <th>{i + 1}</th>
                <td>{routine.examName}</td>
                <td>{routine.className}</td>
                <td>{routine.date}</td>
                <td>
                  {routine.startTime} - {routine.endTime}
                </td>
                <td>{routine.subject}</td>
                <td>{routine.venue}</td>
                <td className="flex gap-2">
                  <button
  className="btn btn-primary btn-sm"
  onClick={() => {
    setEditingRoutine(routine);
    modalRef.current.showModal();

    setValue("editedExamName", routine.examName);
    setValue("editedClassName", routine.className);
    setValue("editedSubject", routine.subject);
    setValue("editedDate", routine.date);
    setValue("editedStartTime", routine.startTime);
    setValue("editedEndTime", routine.endTime);
    setValue("editedVenue", routine.venue);
  }}
>
  <FaEdit />
</button>


                  <button
                    onClick={() =>
                      handleDeleteRoutine(routine._id)
                    }
                    className="btn btn-warning btn-sm"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
<dialog id="upload_exam_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-6">
      Add New Exam Routine
    </h3>

    <form
      onSubmit={handleSubmit(handleAddRoutine)}
      className="space-y-4"
    >
      {/* Exam Name */}
      <div>
        <label className="label font-semibold">Exam Name</label>
        <input
          {...register("examName", { required: true })}
          className="input input-bordered w-full"
          placeholder="e.g. Final Exam"
        />
      </div>

      {/* Class Name */}
      <div>
        <label className="label font-semibold">Class Name</label>
        <input
          {...register("className", { required: true })}
          className="input input-bordered w-full"
          placeholder="e.g. Class 8"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="label font-semibold">Subject</label>
        <input
          {...register("subject", { required: true })}
          className="input input-bordered w-full"
          placeholder="e.g. Mathematics"
        />
      </div>

      {/* Date */}
      <div>
        <label className="label font-semibold">Date</label>
        <input
          type="date"
          {...register("date", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Start Time */}
      <div>
        <label className="label font-semibold">Start Time</label>
        <input
          type="time"
          {...register("startTime", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* End Time */}
      <div>
        <label className="label font-semibold">End Time</label>
        <input
          type="time"
          {...register("endTime", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Venue */}
      <div>
        <label className="label font-semibold">Venue</label>
        <input
          {...register("venue", { required: true })}
          className="input input-bordered w-full"
          placeholder="e.g. Room 204"
        />
      </div>

      {/* Buttons */}
      <div className="modal-action">
        <button
          type="button"
          className="btn"
          onClick={() =>
            document.getElementById("upload_exam_modal").close()
          }
        >
          Cancel
        </button>
        <button className="btn btn-success">
          Add Routine
        </button>
      </div>
    </form>
  </div>
</dialog>

{/* ================= EDIT MODAL ================= */}
<dialog ref={modalRef} className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-6">
      Edit Exam Routine
    </h3>

    <form
      onSubmit={handleSubmitEdit(handleEditRoutine)}
      className="space-y-4"
    >
      {/* Exam Name */}
      <div>
        <label className="label font-semibold">Exam Name</label>
        <input
          {...registerEdit("editedExamName")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Class Name */}
      <div>
        <label className="label font-semibold">Class Name</label>
        <input
          {...registerEdit("editedClassName")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="label font-semibold">Subject</label>
        <input
          {...registerEdit("editedSubject")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Date */}
      <div>
        <label className="label font-semibold">Date</label>
        <input
          type="date"
          {...registerEdit("editedDate")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Start Time */}
      <div>
        <label className="label font-semibold">Start Time</label>
        <input
          type="time"
          {...registerEdit("editedStartTime")}
          className="input input-bordered w-full"
        />
      </div>

      {/* End Time */}
      <div>
        <label className="label font-semibold">End Time</label>
        <input
          type="time"
          {...registerEdit("editedEndTime")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Venue */}
      <div>
        <label className="label font-semibold">Venue</label>
        <input
          {...registerEdit("editedVenue")}
          className="input input-bordered w-full"
        />
      </div>

      {/* Buttons */}
      <div className="modal-action">
        <button
          type="button"
          className="btn"
          onClick={() => modalRef.current.close()}
        >
          Cancel
        </button>
        <button className="btn btn-success">
          Update Routine
        </button>
      </div>
    </form>
  </div>
</dialog>


    </div>
  );
};

export default ExamRoutine;
