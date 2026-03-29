// ChairmenMessage er name change kore Vice principal koray ekane vice principal er data gulu chairmenMessage Component e dekano hoyeche

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaPlus, FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";

const ChairmenMessage = () => {
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, reset, watch } = useForm();
  const [preview, setPreview] = useState("");

  const { data: chairman, refetch } = useQuery({
    queryKey: ["chairman"],
    queryFn: async () => {
      const res = await axiosSecure.get("/chairmen");
      return res.data?.[0];
    },
  });

  useEffect(() => {
    if (chairman) {
      const { _id, image, ...rest } = chairman;
      reset(rest);
      setPreview(image ? `${import.meta.env.VITE_API_URL}${image}` : "");
    }
  }, [chairman, reset]);

  const watchedFile = watch("file");

  useEffect(() => {
  if (chairman) {
    const { _id, image, ...rest } = chairman;
    reset(rest);
    if (image) setPreview(`${import.meta.env.VITE_API_URL}${image}`);
  }
}, [chairman, reset]);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("message", data.message);
    formData.append("facebook", data.facebook || "");
    formData.append("instagram", data.instagram || "");
    formData.append("youtube", data.youtube || "");
    formData.append("twitter", data.twitter || "");

    if (data.file && data.file[0]) formData.append("file", data.file[0]);

    if (chairman?._id) {
      await axiosSecure.patch(`/chairmen/${chairman._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axiosSecure.post("/chairmen", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    refetch();
    document.getElementById("chairman_modal").close();
  };

  const handleDelete = async () => {
    if (!chairman?._id) return;
    if (!confirm("Delete chairman message?")) return;
    await axiosSecure.delete(`/chairmen/${chairman._id}`);
    reset({});
    setPreview("");
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Message of the Vice Principal</h2>
        <div className="flex gap-2">
          {!chairman && (
            <button className="btn btn-primary btn-sm" onClick={() => document.getElementById("chairman_modal").showModal()}>
              <FaPlus /> Add
            </button>
          )}
          {chairman && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => document.getElementById("chairman_modal").showModal()}>
                <FaEdit />
              </button>
              <button className="btn btn-outline btn-sm text-red-500" onClick={handleDelete}>
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>

      {chairman ? (
        <div className="grid md:grid-cols-3 gap-6 bg-base-100 p-6 rounded-xl shadow">
          <div className="flex justify-center">
            <img src={`${import.meta.env.VITE_API_URL}${chairman.image}`} alt="" className="w-48 h-48 object-cover rounded-xl border" />
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-semibold">{chairman.name}</h3>
            <p className="text-sm text-gray-500">{chairman.designation}</p>
            <p className="leading-relaxed">{chairman.message}</p>
            <div className="flex gap-4 text-sm">
              {chairman.facebook && <a href={chairman.facebook}><FaFacebook /></a>}
              {chairman.instagram && <a href={chairman.instagram}><FaInstagram /></a>}
              {chairman.youtube && <a href={chairman.youtube}><FaYoutube /></a>}
              {chairman.twitter && <a href={chairman.twitter}><FaTwitter /></a>}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No chairman message added yet.</p>
      )}

      <dialog id="chairman_modal" className="modal modal-bottom sm:modal-middle">
        <form onSubmit={handleSubmit(onSubmit)} className="modal-box space-y-4">
          <h3 className="font-bold text-lg">Chairman Message</h3>
          <input {...register("name")} placeholder="Name" className="input input-bordered w-full" />
          <input {...register("designation")} placeholder="Designation" className="input input-bordered w-full" />
          <textarea {...register("message")} placeholder="Message" className="textarea input-bordered w-full" />
          <input type="file" accept="image/*" {...register("file")} className="file-input file-input-bordered w-full" />
          {preview && <img src={preview} className="w-32 h-32 object-cover rounded" />}
          <input {...register("facebook")} placeholder="Facebook URL" className="input input-bordered w-full" />
          <input {...register("instagram")} placeholder="Instagram URL" className="input input-bordered w-full" />
          <input {...register("youtube")} placeholder="YouTube URL" className="input input-bordered w-full" />
          <input {...register("twitter")} placeholder="Twitter URL" className="input input-bordered w-full" />
          <div className="modal-action">
            <button className="btn btn-primary" type="submit">Save</button>
            <button type="button" className="btn" onClick={() => document.getElementById("chairman_modal").close()}>Cancel</button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default ChairmenMessage;
