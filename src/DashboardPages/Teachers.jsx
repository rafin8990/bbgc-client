import React, { useEffect, useRef, useState } from "react";
import useAxiossecure from "../Hooks/useAxiossecure";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";

const Teachers = () => {
  const [editingTeacher, setEditingTeacher] = useState(null);

  const axiosSecure = useAxiossecure();
  const{register,handleSubmit}=useForm()
  const { register: registerEdited, handleSubmit: handleSubmitedited, reset } = useForm();
  const modalRef = useRef(null);
  const modalRefedited = useRef(null);

  const {data:teachers,isLoading,refetch}=useQuery({
    queryKey:["teachers"],
    queryFn: async()=>{
        const res= await axiosSecure.get('/teacher')
        return res.data
    }
  })

  useEffect(() => {
  if (editingTeacher) {
    reset({
      editedName: editingTeacher.name,
      editedDesignation: editingTeacher.designation,
      editedDepartment: editingTeacher.department,
      editedSubject: editingTeacher.subject,
      editedEmail: editingTeacher.email,
      editedPhone: editingTeacher.phone,
      editedExperience: editingTeacher.experience,
      editedEducation: editingTeacher.education,
      editedImage: editingTeacher.image,
      editedAddress: editingTeacher.address,
    });
  }
}, [editingTeacher, reset]);

  const handleAddteacher=(data)=>{
    console.log(data);
     const formData = new FormData();

  formData.append("name", data.name);
  formData.append("designation", data.designation);
  formData.append("department", data.department);
  formData.append("subject", data.subject || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("experience", data.experience || "");
  formData.append("education", data.education || "");
  formData.append("address", data.address || "");

  if (data.file && data.file[0]) {
    formData.append("file", data.file[0]);
  }
    axiosSecure.post('/teacher',formData)
    .then((res)=>{
        refetch()
        modalRef.current.close()
        console.log(res);
        alert("New Teacher Added")
        
    })
    .catch(error=>{
        console.log(error);
        alert(error.message)
        
    })
    
  }


  const handleDeleteteacher=(id)=>{
      
      axiosSecure.delete(`/teacher/${id}`)
      .then(res=>{
        refetch()
        console.log(res);
        alert("Teacher Deleted Successfully")
        
      })
      .catch(error=>{
        console.log(error);
        alert(error.message)
        
      })
  }


  const handleUpdateteacher = (data) => {
  if (!editingTeacher) return;

 const formData = new FormData();
  formData.append("name", data.editedName);
  formData.append("designation", data.editedDesignation);
  formData.append("department", data.editedDepartment);
  formData.append("subject", data.editedSubject || "");
  formData.append("email", data.editedEmail || "");
  formData.append("phone", data.editedPhone || "");
  formData.append("experience", data.editedExperience || "");
  formData.append("education", data.editedEducation || "");
  formData.append("address", data.editedAddress || "");

 
  if (data.editedFile && data.editedFile[0]) {
    formData.append("file", data.editedFile[0]); 
  }

  axiosSecure
    .patch(`/teacher/${editingTeacher._id}`,formData)
    .then((res) => {
      refetch();
      modalRefedited.current.close();
      alert("Teacher Updated Successfully");
      setEditingTeacher(null); // clear selection
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
};

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center shadow-2xl p-5">
        <h1 className="font-bold text-lg">All Teachers({teachers?.length})</h1>

        {/* OPEN MODAL BUTTON */}
        <button
          className="btn btn-primary"
          onClick={() => modalRef.current.showModal()}
        >
          <FaPlus /> Add Teacher
        </button>
      </div>



{/* =======Teacher Dekanor table======== */}
<div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Image</th>
        <th>Name</th>
        <th>Designation</th>
        <th>Depertment</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Subject</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        teachers?.map((teacher,i)=><tr key={teacher._id}>
        <th>{i+1}</th>
        <td>
  <img
  src={teacher.image ? `${import.meta.env.VITE_API_URL}${teacher.image}` : "/placeholder.png"}
  className="w-16 h-16 object-cover rounded"
  alt={teacher.name}
/>



</td>

        <td>{teacher.name}</td>
        <td>{teacher.designation}</td>
        <td>{teacher.department}</td>
        <td>{teacher.email}</td>
        <td>{teacher.phone}</td>
        <td>{teacher.subject}</td>
        <td className="flex flex-col">
            <button onClick={()=>handleDeleteteacher(teacher._id)} className="btn-warning btn btn-sm">
                <FaTrash/>
                </button>
           <button
  onClick={() => {
    setEditingTeacher(teacher);   // store current teacher
    modalRefedited.current.showModal();
  }}
  className="btn-primary btn btn-sm  mt-2"
>
  <FaEdit />
</button>

        </td>
       
      </tr>)
      }
     
     
    </tbody>
  </table>
</div>



      {/* ======== Modal ======== */}
<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-3xl">
    <h3 className="font-bold text-xl mb-4">Add Teacher</h3>

    <form
     onSubmit={handleSubmit(handleAddteacher)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Name */}
      <input
        {...register("name", { required: true })}
        placeholder="Name"
        className="input input-bordered w-full"
      />

      {/* Designation */}
      <input
        {...register("designation", { required: true })}
        placeholder="Designation"
        className="input input-bordered w-full"
      />

      {/* Department */}
      <select
        {...register("department", { required: true })}
        className="select select-bordered w-full"
      >
        <option value="">Select Department</option>
        <option value="Science">Science</option>
        <option value="Arts">Arts</option>
        <option value="Commerce">Commerce</option>
        <option value="General">General</option>
      </select>

      {/* Subject */}
      <input
        {...register("subject")}
        placeholder="Subject"
        className="input input-bordered w-full"
      />

      {/* Email */}
      <input
        {...register("email")}
        placeholder="Email"
        type="email"
        className="input input-bordered w-full"
      />

      {/* Phone */}
      <input
        {...register("phone")}
        placeholder="Phone"
        className="input input-bordered w-full"
      />

      {/* Experience */}
      <input
        {...register("experience")}
        placeholder="Experience (e.g. 5 years)"
        className="input input-bordered w-full"
      />

      {/* Education */}
      <input
        {...register("education")}
        placeholder="Education"
        className="input input-bordered w-full"
      />

      {/* Image Upload */}
<input
  type="file"
  accept="image/*"
  {...register("file")}
  className="file-input file-input-bordered w-full md:col-span-2"
/>


      {/* Address */}
      <textarea
        {...register("address")}
        placeholder="Address"
        className="textarea textarea-bordered w-full md:col-span-2"
      />

      {/* Buttons */}
      <div className="modal-action md:col-span-2">
        <button
          type="button"
          className="btn"
          onClick={() => modalRef.current.close()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Teacher
        </button>
      </div>
    </form>
  </div>
</dialog>


  {/* ====Modal for Edit Teacher===== */}
  <dialog ref={modalRefedited} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-3xl">
    <h3 className="font-bold text-xl mb-4">Save Change</h3>

    <form
    onSubmit={handleSubmitedited(handleUpdateteacher)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Name */}
      <input
        {...registerEdited("editedName", { required: true })}
        placeholder="Name"
        className="input input-bordered w-full"
      />

      {/* Designation */}
      <input
        {...registerEdited("editedDesignation", { required: true })}
        placeholder="Designation"
        className="input input-bordered w-full"
      />

      {/* Department */}
      <select
        {...registerEdited("editedDepartment", { required: true })}
        className="select select-bordered w-full"
      >
        <option value="">Select Department</option>
        <option value="Science">Science</option>
        <option value="Arts">Arts</option>
        <option value="Commerce">Commerce</option>
        <option value="General">General</option>
      </select>

      {/* Subject */}
      <input
        {...registerEdited("editedSubject")}
        placeholder="Subject"
        className="input input-bordered w-full"
      />

      {/* Email */}
      <input
        {...registerEdited("editedEmail")}
        placeholder="Email"
        type="email"
        className="input input-bordered w-full"
      />

      {/* Phone */}
      <input
        {...registerEdited("editedPhone")}
        placeholder="Phone"
        className="input input-bordered w-full"
      />

      {/* Experience */}
      <input
        {...registerEdited("editedExperience")}
        placeholder="Experience (e.g. 5 years)"
        className="input input-bordered w-full"
      />

      {/* Education */}
      <input
        {...registerEdited("editedEducation")}
        placeholder="Education"
        className="input input-bordered w-full"
      />

     {/* Image Upload */}
<input
  type="file"
  accept="image/*"
  {...registerEdited("editedFile")}
  className="file-input file-input-bordered w-full md:col-span-2"
/>


      {/* Address */}
      <textarea
        {...registerEdited("editedAddress")}
        placeholder="Address"
        className="textarea textarea-bordered w-full md:col-span-2"
      />

      {/* Buttons */}
      <div className="modal-action md:col-span-2">
        <button
          type="button"
          className="btn"
          onClick={() => modalRefedited.current.close()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Teacher
        </button>
      </div>
    </form>
  </div>
</dialog>
    </div>
  );
};

export default Teachers;
