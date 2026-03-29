import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useAxiossecure from "../../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";

const Syllabus = () => {
  const modalRef = useRef();
  const modalRefedited=useRef()
  const axiosSecure = useAxiossecure();
  const { register, handleSubmit, reset } = useForm();
  const { register:registerEdited, handleSubmit:handleSubmitedited ,setValue} = useForm();
  const[isEditing,setIsediting]=useState(null)

  const {data:syllabusData,refetch}=useQuery({
    queryKey:["syllabus"],
    queryFn: async()=>{
      const res= await axiosSecure.get('/syllabus')
      return res.data
    }
  })
  // ✅ submit handler
  const handleSyllabus = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("file", data.file[0]); // VERY IMPORTANT

    try {
      const res = await axiosSecure.post("/syllabus", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.insertedId) {
        refetch()
        alert("PDF uploaded successfully");
        modalRef.current.close();
        reset();
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };


  const handleDelete=(id)=>{
    axiosSecure.delete(`/syllabus/${id}`)
    .then(res=>{
      refetch()
      alert("File Deleted")
    })
    .catch(error=>{
      alert(error.message)
    })
  }

  const handleEdit=(data)=>{
    const formData= new FormData()
    formData.append('title',data.editedTitle)
    formData.append("file",data.editedFile[0])
    axiosSecure.patch(`/syllabus/${isEditing._id}`,formData)
    .then(res=>{
         refetch()
        alert("Data Edited")
      modalRefedited.current.close()
    })
    .catch(error=>{
      alert(error.message)
    })
  }
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Syllabus Management
        </h1>

        <button
          className="btn btn-success gap-2"
          onClick={() => modalRef.current.showModal()}
        >
          <FaPlus />
          Upload New Syllabus
        </button>
      </div>



<div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Title</th>
        <th>PDF</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
     {
      syllabusData?.map((syllabus,i)=> <tr key={syllabus._id}>
        <th>{i+1}</th>
        <td>{syllabus.title}</td>
        <td>
  <a
  href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${syllabus.file}`}

  target="_blank"
>
  View PDF
</a>

</td>

        <td>
          <button onClick={()=>{
            setIsediting(syllabus)
            setValue("editedTitle", syllabus.title);
            modalRefedited.current.showModal()
          }} className="btn-primary btn btn-sm mx-2"><FaEdit/></button>
          <button onClick={()=>handleDelete(syllabus._id)} className="btn-warning btn btn-sm"><FaTrash/></button>
        </td>
      </tr>)
     }
      
     
    </tbody>
  </table>
</div>





      {/* Modal for add syllabus */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Upload New Syllabus
          </h3>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleSyllabus)}
          >
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              accept="application/pdf"
              {...register("file", { required: true })}
              className="file-input file-input-bordered w-full"
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => modalRef.current.close()}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-success">
                Publish Syllabus
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal for edit syllabus */}
      <dialog ref={modalRefedited} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Edit Syllabus
          </h3>

          <form
            className="space-y-4"
            onSubmit={handleSubmitedited(handleEdit)}
          >
            <input
              type="text"
              placeholder="Title"
              {...registerEdited("editedTitle", { required: true })}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              accept="application/pdf"
              {...registerEdited("editedFile", { required: true })}
              className="file-input file-input-bordered w-full"
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => modalRefedited.current.close()}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-success">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Syllabus;
