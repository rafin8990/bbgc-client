import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import useAxiossecure from '../Hooks/useAxiossecure';
import { useQuery } from '@tanstack/react-query';

const Photos = () => {
    const modalRef=useRef()
    const {register,handleSubmit}=useForm()
    const axiosSecure=useAxiossecure()
    
   const {data:photoData,refetch}=useQuery({
    queryKey:["photos"],
    queryFn: async()=>{
        const res= await axiosSecure.get('/photos')
        return res.data
    }
   })

    const handleAddphoto=(data)=>{
        const formData=new FormData()
        formData.append("title",data.title)
        formData.append("file",data.file[0])
        axiosSecure.post('/photos',formData,{
            headers:{
           'Content-Type': "multipart/form-data"
        }
        })
        .then(res=>{
            if(res.data.insertedId){
                refetch()
                modalRef.current.close()
                alert("New Photo Added")
            }
        })
        .catch(error=>{
            alert(error.message)
        })

    }


    const handleDelete=(id)=>{
        axiosSecure.delete(`/photos/${id}`)
        .then(res=>{
            refetch()
            alert("Photo Deleted")
        })
        .catch(error=>{
            alert(error.message)
        })
    }
    return (
        <div>
          {/* ================= HEADER ================= */}
               <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold">Photo Gallery</h1>
         
                 <button
                   onClick={() => modalRef.current.showModal()}
                   className="btn btn-success gap-2"
                 >
                   <FaPlus /> Add new photo
                 </button>
               </div>   

         {/* ================= PHOTO GRID ================= */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {photoData?.map((photo) => (
    <div
      key={photo._id}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
    >
      {/* Image */}
     <img
  src={`${import.meta.env.VITE_API_URL}${photo.file}`}
  alt={photo.title}
  className="w-full h-56 object-cover group-hover:scale-110 transition duration-300"
/>


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
        <h2 className="text-white font-semibold truncate">
          {photo.title}
        </h2>

        <button
          onClick={() => handleDelete(photo._id)}
          className="btn btn-error btn-xs mt-2 w-fit"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


               {/* ================= ADD MODAL ================= */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Circular</h3>

          <form 
          onSubmit={handleSubmit(handleAddphoto)} 
          className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
             accept="image/*"

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
        </div>
    );
};

export default Photos;