import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Achievements = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [editingAchievement, setEditingAchievement] = useState(null);

  const modalRef = useRef(null);
  const modalRefedited = useRef(null);
   const axiosSecure=useAxiossecure()
  const { register, handleSubmit, reset } = useForm();
  const { register:registerEdited, handleSubmit:handleSubmitedited,} = useForm();
   
  const { data: achievementsData = [], isLoading, refetch } = useQuery({
  queryKey: ["achievements", activeCategory],
  queryFn: async () => {
    const url =
      activeCategory === "all"
        ? "/achievements"
        : `/achievements?category=${activeCategory}`;
    const res = await axiosSecure.get(url);
    return res.data;
  },
});




  const handleAddAchievement = (data) => {
    const formData= new FormData()
    formData.append("title",data.title)
    formData.append("description",data.description)
    formData.append("category",data.category)
    formData.append("year", data.year)
    formData.append("file",data.file[0])
    axiosSecure.post('/achievements',formData)
    .then((res)=>{
        refetch()
        if(res.data.insertedId){
            console.log(res);
            alert("New Achievement Added")
            
        }
    })

    .catch(error=>{
        console.log(error);
        alert(error.message)
        
    })
    reset();
    modalRef.current.close();
  };
  
  const handleDelete=(id)=>{
    axiosSecure.delete(`/achievements/${id}`)
    .then(res=>{
        refetch()
        console.log(res);
        alert("Deleted")
        
    })
    .catch(error=>{
        console.log(error);
        alert(error.message)
        
    })
  }


  const handleEditAchievement = (data) => {
  if (!editingAchievement) return;

  
const formData= new FormData()
formData.append("title",data.editedTitle)
formData.append("description",data.editedDescription)
formData.append("year",data.editedYear)
formData.append("category",data.editedCategory)
if (data.editedFile && data.editedFile[0]) {
  formData.append("file", data.editedFile[0])
}


  axiosSecure
    .patch(`/achievements/${editingAchievement._id}`, formData)
    .then((res) => {
      refetch();
      modalRefedited.current.close();
      alert("Achievement Updated Successfully");
      setEditingAchievement(null);
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
};

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="flex gap-3 p-5 shadow-2xl items-center">
        <h1 className="font-bold text-lg flex-1">Achievements({achievementsData.length})</h1>

        <button
          className={`btn ${activeCategory === "all" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>

        <button
          className={`btn ${activeCategory === "academic" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveCategory("academic")}
        >
          Academic
        </button>

        <button
          className={`btn ${activeCategory === "sports" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveCategory("sports")}
        >
          Sports
        </button>

        <button
          className={`btn ${activeCategory === "curricular" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveCategory("curricular")}
        >
          Co-curricular
        </button>

        <button
          className="btn btn-primary"
          onClick={() => modalRef.current.showModal()}
        >
          <FaPlus /> Add
        </button>
      </div>

      {/* ===== Modal ===== */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">নতুন অর্জন যোগ করুন</h3>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => modalRef.current.close()}
            >
              ✕
            </button>
          </div>

          {/* ===== Form ===== */}
          <form
            onSubmit={handleSubmit(handleAddAchievement)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* শিরোনাম */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">শিরোনাম *</span>
              </label>
              <input
                {...register("title", { required: true })}
                placeholder="শিরোনাম লিখুন"
                className="input input-bordered w-full"
              />
            </div>

            {/* বিবরণ */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">বিবরণ *</span>
              </label>
              <textarea
                {...register("description", { required: true })}
                placeholder="বিস্তারিত লিখুন"
                className="textarea textarea-bordered w-full h-32"
              />
            </div>

            {/* বছর */}
            <div>
              <label className="label">
                <span className="label-text font-medium">বছর *</span>
              </label>
              <select
                {...register("year", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* ক্যাটাগরি */}
            <div>
              <label className="label">
                <span className="label-text font-medium">ক্যাটাগরি *</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="academic">একাডেমিক</option>
                <option value="sports">স্পোর্টস</option>
                <option value="curricular">কো-কারিকুলার</option>
              </select>
            </div>

            {/* ছবি (Image URL) */}
<div className="md:col-span-2">
  <label className="label">
    <span className="label-text font-medium">ছবি</span>
  </label>

  <input
              type="file"
             accept="image/*"

              {...register("file", { required: true })}
              className="file-input file-input-bordered w-full"/>
</div>


            {/* Submit */}
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary w-full">
                যোগ করুন
              </button>
            </div>
          </form>
        </div>
      </dialog>



      {/* ===== Edit Achievement Modal ===== */}
      <dialog ref={modalRefedited} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">নতুন অর্জন যোগ করুন</h3>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => modalRefedited.current.close()}
            >
              ✕
            </button>
          </div>

          {/* ===== Form ===== */}
          <form
            onSubmit={handleSubmitedited(handleEditAchievement)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* শিরোনাম */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">শিরোনাম *</span>
              </label>
              <input
                {...registerEdited("editedTitle", { required: true })}
                placeholder="শিরোনাম লিখুন"
                className="input input-bordered w-full"
              />
            </div>

            {/* বিবরণ */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">বিবরণ *</span>
              </label>
              <textarea
                {...registerEdited("editedDescription", { required: true })}
                placeholder="বিস্তারিত লিখুন"
                className="textarea textarea-bordered w-full h-32"
              />
            </div>

            {/* বছর */}
            <div>
              <label className="label">
                <span className="label-text font-medium">বছর *</span>
              </label>
              <select
                {...registerEdited("editedYear", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* ক্যাটাগরি */}
            <div>
              <label className="label">
                <span className="label-text font-medium">ক্যাটাগরি *</span>
              </label>
              <select
                {...registerEdited("editedCategory", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="academic">একাডেমিক</option>
                <option value="sports">স্পোর্টস</option>
                <option value="curricular">কো-কারিকুলার</option>
              </select>
            </div>

            {/* ছবি (Image URL) */}
<div className="md:col-span-2">
  <label className="label">
    <span className="label-text font-medium">ছবি *</span>
  </label>
  <input
              type="file"
             accept="image/*"

              {...registerEdited("editedFile", { required: true })}
              className="file-input file-input-bordered w-full"/>
</div>


            {/* Submit */}
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary w-full">
                যোগ করুন
              </button>
            </div>
          </form>
        </div>
      </dialog>






     {/* ===== Achievements List ===== */}
<div className="p-6">
  {isLoading && (
    <p className="text-center text-gray-500">Loading achievements...</p>
  )}

  {!isLoading && achievementsData.length === 0 && (
    <p className="text-center text-gray-500">No achievements found</p>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {achievementsData.map((item) => (
      <div
        key={item._id}
        className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
         <img
  src={`${import.meta.env.VITE_API_URL}${item.image}`}
  alt={item.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>


          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category badge */}
          <span className="absolute top-4 left-4 badge badge-primary badge-outline bg-white/90">
            {item.category}
          </span>

          {/* Year */}
          <span className="absolute top-4 right-4 badge bg-black/70 text-white">
            {item.year}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {item.title}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-3">
            {item.description}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-5 opacity-0 group-hover:opacity-100 transition">
            <button
  onClick={() => {
    setEditingAchievement(item);

    // form auto fill
    setTimeout(() => {
      document.querySelector('[name="editedTitle"]').value = item.title;
      document.querySelector('[name="editedDescription"]').value = item.description;
      document.querySelector('[name="editedYear"]').value = item.year;
      document.querySelector('[name="editedCategory"]').value = item.category;
      document.querySelector('[name="editedImage"]').value = item.image;
    }, 0);

    modalRefedited.current.showModal();
  }}
  className="btn btn-sm btn-circle btn-outline"
>
  <FaEdit />
</button>

            <button
              onClick={() => handleDelete(item._id)}
              className="btn btn-sm btn-circle btn-error text-white"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  );
};

export default Achievements;
