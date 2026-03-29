import React, { useEffect, useState } from 'react';
import useAxiossecure from '../Hooks/useAxiossecure';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const NewsEvents = () => {
    const axiosSecure=useAxiossecure()
    const [editingItem, setEditingItem] = useState(null);

    const [activeCategory, setActiveCategory] = useState("news");

    const modalRef=useRef()
    const modalRefedited=useRef()
  
    const { register, handleSubmit } = useForm();
  const { register: registerEdited, handleSubmit: handleSubmitedited, reset } = useForm();
  
useEffect(() => {
  if (editingItem) {
    reset({
      title: editingItem.title,
      description: editingItem.description,
      category: editingItem.category,
      image: editingItem.image
    });
  }
}, [editingItem, reset]);

const {
  data: newsData = [],isLoading,refetch} = useQuery({
  queryKey: ["news", activeCategory],
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/news?category=${activeCategory}`
    );
    return res.data;
  }
});

const handleAddNews = (data) => {
  const formData=new FormData()
   formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("file", data.file[0]);


  axiosSecure.post('/news', formData)
    .then(res => {
      alert('News Added');
      refetch();          
      modalRef.current.close();
    })
    .catch(err => {
      console.log(err);
      alert(err.message);
    });
};


const handleEdit = (item) => {
  setEditingItem(item);           
  modalRefedited.current.showModal(); 
};




    const handleUpdateNews = (data) => {
  if (!editingItem) return;
const formData = new FormData();

  
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);

  
  if (data.editedFile && data.editedFile[0]) {
    formData.append("file", data.editedFile[0]); 
  }
  axiosSecure.patch(`/news/${editingItem._id}`, formData)
    .then(res => {
      alert("News Updated");
      refetch();                     
      modalRefedited.current.close();
      setEditingItem(null);          
    })
    .catch(error => {
      console.log(error);
      alert(error.message);
    });
};


    const handleDelete=(id)=>{
        axiosSecure.delete(`/news/${id}`)
        .then(res=>{
            refetch()
            console.log(res);
            alert("News Deleted")
            
        })
        .catch(error=>{
            console.log(error);
            alert(error.message)
            
        })
    }


    
    return (
        <div>
          
            <div className="flex gap-3 p-5 shadow-2xl items-center">
  <h1 className="font-bold text-lg flex-1">News & Events({newsData.length})</h1>

  <button
    className={`btn ${activeCategory === "news" ? "btn-primary" : "btn-outline"}`}
    onClick={() => setActiveCategory("news")}
  >
    News
  </button>

  <button
    className={`btn ${activeCategory === "events" ? "btn-primary" : "btn-outline"}`}
    onClick={() => setActiveCategory("events")}
  >
    Events
  </button>

  <button
    className="btn btn-primary"
    onClick={() => modalRef.current.showModal()}
  >
    <FaPlus /> Add
  </button>
</div>
         {/* //body content */}
     
                 {/* Body content */}
<div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
  {isLoading && <p>Loading...</p>}

  {newsData.map(item => (
    <div key={item._id} className="card bg-base-100 shadow-md">
      
      {/* Image */}
      <figure className="h-48 overflow-hidden">
        <img
  src={`${import.meta.env.VITE_API_URL}${item.image}`}
  alt={item.title}
  className="w-full h-full object-cover"
/>

      </figure>

      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p className="text-sm text-justify text-gray-600">
         {item.description.slice(0, 200)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <span className="badge badge-outline">
            {item.category}
          </span>

          <div className="flex gap-2">
            {/* Edit */}
            <button
              className="btn btn-sm btn-outline btn-info"
              onClick={() => handleEdit(item)}
              title="Edit"
            >
              <FaEdit />
            </button>

            {/* Delete */}
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => handleDelete(item._id)}
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


                



                {/* ======== Modal ======== */}
<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-2xl">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-xl">নতুন নিউজ/ইভেন্ট যোগ করুন</h3>
      <button
        type="button"
        className="btn btn-sm btn-circle"
        onClick={() => modalRef.current.close()}
      >
        ✕
      </button>
    </div>

    <form
      onSubmit={handleSubmit(handleAddNews)}
      className="space-y-4"
    >
      {/* Title */}
      <div>
        <label className="label">
          <span className="label-text font-medium">শিরোনাম</span>
        </label>
        <input
          {...register("title", { required: true })}
          placeholder="শিরোনাম লিখুন"
          className="input input-bordered w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">
          <span className="label-text font-medium">বিবরণ</span>
        </label>
        <textarea
          {...register("description", { required: true })}
          placeholder="বিস্তারিত লিখুন"
          className="textarea textarea-bordered w-full h-32"
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">
          <span className="label-text font-medium">ক্যাটাগরি</span>
        </label>
        <select {...register("category", { required: true })}>
  <option value="news">নিউজ</option>
  <option value="events">ইভেন্ট</option>
 
</select>

      </div>

      {/* Image Upload */}
<div>
  <label className="label">
    <span className="label-text font-medium">ছবি আপলোড করুন *</span>
  </label>

  <input
    type="file"
    accept="image/*"
    {...register("file", { required: true })}
    className="file-input file-input-bordered w-full"
  />
</div>


      {/* Submit Button */}
      <button
        type="submit"
        className="btn w-full bg-black text-white hover:bg-gray-800"
      >
        যোগ করুন
      </button>
    </form>
  </div>
</dialog>
             
                {/* ======== Modal edited news ======== */}

<dialog ref={modalRefedited} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-2xl">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-xl">নতুন নিউজ/ইভেন্ট যোগ করুন</h3>
      <button
        type="button"
        className="btn btn-sm btn-circle"
        onClick={() => modalRefedited.current.close()}
      >
        ✕
      </button>
    </div>

    <form
     onSubmit={handleSubmitedited(handleUpdateNews)}
      className="space-y-4"
    >
      {/* Title */}
      <div>
        <label className="label">
          <span className="label-text font-medium">শিরোনাম</span>
        </label>
        <input
          {...registerEdited("title", { required: true })}
          placeholder="শিরোনাম লিখুন"
          className="input input-bordered w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">
          <span className="label-text font-medium">বিবরণ</span>
        </label>
        <textarea
          {...registerEdited("description", { required: true })}
          placeholder="বিস্তারিত লিখুন"
          className="textarea textarea-bordered w-full h-32"
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">
          <span className="label-text font-medium">ক্যাটাগরি</span>
        </label>
        <select {...registerEdited("category", { required: true })}>
  <option value="news">নিউজ</option>
  <option value="events">ইভেন্ট</option>
 
</select>

      </div>

      {/* Image Upload */}
<div>
  <label className="label">
    <span className="label-text font-medium">ছবি আপলোড করুন (Optional)</span>
  </label>

  <input
    type="file"
    accept="image/*"
    {...registerEdited("editedFile")} 
    className="file-input file-input-bordered w-full"
  />
</div>


      {/* Submit Button */}
      <button
        type="submit"
        className="btn w-full bg-black text-white hover:bg-gray-800"
      >
        যোগ করুন
      </button>
    </form>
  </div>
</dialog>


        </div>
    );
};

export default NewsEvents;