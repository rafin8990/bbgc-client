import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaPlus } from 'react-icons/fa';
import useAxiossecure from '../Hooks/useAxiossecure';
import { useQuery } from '@tanstack/react-query';

const History = () => {
   const [editingHistory, setEditingHistory] = useState(null);
    const modalRef = useRef(null);
    const{register,handleSubmit,}=useForm()
    const axiosSecure=useAxiossecure()


const { register: registerEdited, handleSubmit: handleSubmitedited, reset, watch } = useForm();
  const modalRefedited = useRef(null);
    
  
  const {data:historyData, refetch}=useQuery({
        queryKey:['history'],
        queryFn: async()=>{
            const res= await axiosSecure.get('/history')
            return res.data
        }
    })

    const handleAddhistory=(data)=>{
        console.log(data);
        const formData= new FormData()
        formData.append("title",data.title)
        formData.append("content",data.content)
        formData.append("file",data.file[0])
        axiosSecure.post('/history',formData)
        .then((res)=>{
            if(res.data.insertedId){
                refetch();   
               
                 alert("History Added")  
                  modalRef.current.close()
            }
        })
        .catch(error=>{
            console.log(error);
            alert(error.message)
            
        })
        
    }

    const handleUpdateHistory=(data)=>{
        console.log(data);
       
        if (!editingHistory) return;

  const updatedData = {
    title: data.editedTitle,
    content: data.editedContent,
    image: data.editedImage,
    
  };
const formData= new FormData()
formData.append("title", data.editedTitle)
formData.append("content", data.editedContent)

if (data.editedFile && data.editedFile[0]) {
  formData.append("file", data.editedFile[0])
}

  axiosSecure
    .patch(`/history/${editingHistory._id}`, formData)
    .then((res) => {
      refetch();
      modalRefedited.current.close();
      alert("Teacher Updated Successfully");
      setEditingHistory(null); 
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
    }

     useEffect(() => {
      if (editingHistory) {
        reset({
          editedTitle: editingHistory.title,
          editedContent: editingHistory.content,
          editedImage: editingHistory.image,
          
        });
      }
    }, [editingHistory, reset]);


    return (
        <div>
          {/* Header */}
              <div className="flex justify-between items-center shadow-2xl p-5">
                <h1 className="font-bold text-lg">History</h1>
        
                {/* OPEN MODAL BUTTON */}
               {
                historyData ?<button
  onClick={() => {
    setEditingHistory(historyData);   
    modalRefedited.current.showModal();
  }}
  className="btn btn-warning"
>
  <FaEdit />
</button>
:
                 <button
                  className="btn btn-primary"
                  onClick={() => modalRef.current.showModal()}
                 
                >
                  <FaPlus /> Add History
                </button>
               }
              </div>   

            {/* ===== History Display ===== */}
{historyData && (
  <div className="max-w-4xl mx-auto mt-10 p-6 shadow-xl rounded-lg">
    <h2 className="text-2xl font-bold mb-4">
      {historyData.title}
    </h2>

    <p className="text-gray-600 mb-6">
      {historyData.content}
    </p>

    {historyData.image && (
      <img
        src={`${import.meta.env.VITE_API_URL}${historyData.image}`}
        alt="History"
        className="w-full max-h-96 object-cover rounded-lg"
      />
    )}
  </div>
)}


               {/* ======== Modal ======== */}
<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-3xl p-0 overflow-hidden">

    {/* Header */}
    <div className="px-6 py-4 border-b">
      <h3 className="font-bold text-xl">Add History</h3>
      <p className="text-sm text-gray-500">Fill in the history information below</p>
    </div>

    {/* Body */}
    <form
      onSubmit={handleSubmit(handleAddhistory)}
      className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Title */}
      <div>
        <label className="label font-medium">Title</label>
        <input
          {...register("title", { required: true })}
          placeholder="Enter title"
          className="input input-bordered w-full"
        />
      </div>

      {/* Content */}
      <div className="md:col-span-2">
        <label className="label font-medium">Content</label>
        <textarea
          {...register("content", { required: true })}
          placeholder="Write history content"
          className="textarea textarea-bordered w-full min-h-[120px]"
        />
      </div>

     {/* Image Upload */}
<div className="md:col-span-2">
  <label className="label font-medium">Upload Image *</label>

  <input
    type="file"
    accept="image/*"
    {...register("file", { required: true })}
    className="file-input file-input-bordered w-full"
  />
</div>


      {/* Footer Buttons */}
      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => modalRef.current.close()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save History
        </button>
      </div>
    </form>
  </div>
</dialog>

           {/* ====Modal for Edit History===== */}
 <dialog ref={modalRefedited} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-3xl p-0 max-h-[90vh] flex flex-col">

    {/* Header (fixed) */}
    <div className="px-6 py-4 border-b shrink-0">
      <h3 className="font-bold text-xl">Edit History</h3>
      <p className="text-sm text-gray-500">
        Update your existing history details
      </p>
    </div>

    {/* Body (scrollable) */}
    <form
      onSubmit={handleSubmitedited(handleUpdateHistory)}
      className="flex-1 overflow-y-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Title */}
      <div>
        <label className="label font-medium">Title</label>
        <input
          {...registerEdited("editedTitle", { required: true })}
          className="input input-bordered w-[700px]"
        />
      </div>

      {/* Content */}
      <div className="md:col-span-2">
        <label className="label font-medium">Content</label>
        <textarea
          {...registerEdited("editedContent", { required: true })}
          className="textarea textarea-bordered w-full min-h-[120px]"
        />
      </div>

     {/* Image Upload */}
<div className="md:col-span-2">
  <label className="label font-medium">Upload New Image (optional)</label>

  <input
    type="file"
    accept="image/*"
    {...registerEdited("editedFile")}
    className="file-input file-input-bordered w-full"
  />
</div>


      {/* Image Preview */}
{watch("editedFile")?.[0] && (
  <div className="md:col-span-2">
    <p className="label font-medium mb-2">Image Preview</p>

    <div className="w-full max-h-64 overflow-hidden rounded-lg border">
      <img
        src={URL.createObjectURL(watch("editedFile")[0])}
        alt="Preview"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
)}


      {/* Footer (fixed inside scroll area end) */}
      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => modalRefedited.current.close()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Update History
        </button>
      </div>
    </form>
  </div>
</dialog>





        </div>
    );
};

export default History;