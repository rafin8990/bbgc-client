import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaPlus, FaRegNewspaper, FaTrash } from 'react-icons/fa';
import useAxiossecure from '../Hooks/useAxiossecure';
import { useQuery } from '@tanstack/react-query';

const Classroutine = () => {
    const [editingRoutine, setEditingRoutine] = useState(null);

    const modalRef=useRef()
    const {register,handleSubmit,formState:{errors},reset}=useForm()
    const {register:registeredit,handleSubmit:handleSubmitedited,setValue}=useForm()
    const axiosSecure=useAxiossecure()
    const {data:routineData,refetch}=useQuery({
        queryKey:['routine'],
        queryFn : async ()=>{
            const res= await axiosSecure.get('/routine')
            return res.data
        }
    })

    const handleAddroutine=(data)=>{
        axiosSecure.post('/routine',data)
        .then((res)=>{
            refetch()
            console.log(res);
            alert("Routine Added")
           
      document.getElementById("upload_notice_modal").close();
      
      
      reset();
        })
        .catch(error=>{
            console.log(error);
            alert(error.message)
            
        })
    }


    const handleDeleteroutine=(id)=>{
        axiosSecure.delete(`/routine/${id}`)
        .then(res=>{
            refetch()
            console.log(res.data);
            alert("Routine Deleted")
            
        })
        .catch(error=>{
            console.log(error);
            alert(error.message)
            
        })
    }


    const handleEditroutine=(data)=>{
        const updatedData={
            className: data.editedClassName,
            section : data.editedSection,
            day: data.editedDay,
            startTime: data.editedStartTime,
            endTime: data.editedEndTime,
            subject:data.editedSubject,
            teacherName: data.editedTeacherName
        }

        axiosSecure.patch(`/routine/${editingRoutine._id}`,updatedData)
        .then(res=>{
            refetch()
            console.log(res);
            alert("data updated")
            modalRef.current.close()
        })
        .catch(error=>{
            console.log(error);
            alert(error.message)
            
        })
    }
    return (
        <div>
        {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl flex items-center font-bold text-slate-800">
                  <FaRegNewspaper className='mx-2 text-blue-400'/> Manage Class Routine
                </h1>
        
                {/* Open Modal Button */}
                <button
                  className="btn btn-success gap-2"
                  onClick={() =>
                    document.getElementById("upload_notice_modal").showModal()
                  }
                >
                  <FaPlus />
                  Add Class Routine
                </button>
              </div>

                <div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th>#</th>
        <th>class Name</th>
        <th>Section</th>
        <th>Day</th>
        <th>Time</th>
        <th>Subject</th>
        <th>Teacher</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        routineData?.map((routine,i)=>
        <tr key={routine._id}>
        <th>{i+1}</th>
        <td>{routine.className}</td>
        <td>{routine.section}</td>
        <td>{routine.day}</td>
        <td>{routine.startTime} - {routine.endTime}</td>
        <td>{routine.subject}</td>
        <td>{routine.teacherName}</td>
        <td>
            <button
  onClick={() => {
    setEditingRoutine(routine);
    modalRef.current.showModal();
    setValue("editedClassName", routine.className);
  setValue("editedSection", routine.section);
  setValue("editedDay", routine.day);
  setValue("editedStartTime", routine.startTime);
  setValue("editedEndTime", routine.endTime);
  setValue("editedSubject", routine.subject);
  setValue("editedTeacherName", routine.teacherName);
    
  }}
  className='btn btn-primary btn-sm mx-2'
>
  <FaEdit/>
</button>

            <button onClick={()=>handleDeleteroutine(routine._id)} className='btn btn-warning btn-sm'><FaTrash/></button>
        </td>
      </tr>)
      }
      
      
    </tbody>
  </table>
</div>

                {/* ================= DaisyUI Modal ================= */}
     <dialog
  id="upload_notice_modal"
  className="modal modal-bottom sm:modal-middle"
>
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-4">
      Add Class Routine
    </h3>

    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit(handleAddroutine)}
    >
      {/* Class Name */}
      <div>
        <label className="label">
          <span className="label-text">Class Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Class 7"
          {...register("className", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.className && (
          <p className="text-red-500 text-sm">Class name is required</p>
        )}
      </div>

      {/* Section */}
      <div>
        <label className="label">
          <span className="label-text">Section</span>
        </label>
        <input
          type="text"
          placeholder="e.g. A"
          {...register("section", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.section && (
          <p className="text-red-500 text-sm">Section is required</p>
        )}
      </div>

      {/* Day */}
      <div>
        <label className="label">
          <span className="label-text">Day</span>
        </label>
        <select
          {...register("day", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Day</option>
          <option>Saturday</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>
        {errors.day && (
          <p className="text-red-500 text-sm">Day is required</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="label">
          <span className="label-text">Subject</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          {...register("subject", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">Subject is required</p>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label className="label">
          <span className="label-text">Start Time</span>
        </label>
        <input
          type="time"
          {...register("startTime", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm">Start time is required</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="label">
          <span className="label-text">End Time</span>
        </label>
        <input
          type="time"
          {...register("endTime", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.endTime && (
          <p className="text-red-500 text-sm">End time is required</p>
        )}
      </div>

      {/* Teacher Name */}
      <div className="md:col-span-2">
        <label className="label">
          <span className="label-text">Teacher Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Md. Rahman"
          {...register("teacherName", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.teacherName && (
          <p className="text-red-500 text-sm">
            Teacher name is required
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="modal-action md:col-span-2">
        <button
          type="button"
          className="btn"
          onClick={() =>
            document
              .getElementById("upload_notice_modal")
              .close()
          }
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-success">
          Save Routine
        </button>
      </div>
    </form>
  </div>
</dialog>

                {/* ================= DaisyUI Modal for edit routine ================= */}
     <dialog
      ref={modalRef}

  className="modal modal-bottom sm:modal-middle"
>
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-4">
      Add Class Routine
    </h3>

    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
     onSubmit={handleSubmitedited(handleEditroutine)}
    >
      {/* Class Name */}
      <div>
        <label className="label">
          <span className="label-text">Class Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Class 7"
          {...registeredit("editedClassName", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.className && (
          <p className="text-red-500 text-sm">Class name is required</p>
        )}
      </div>

      {/* Section */}
      <div>
        <label className="label">
          <span className="label-text">Section</span>
        </label>
        <input
          type="text"
          placeholder="e.g. A"
          {...registeredit("editedSection", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.section && (
          <p className="text-red-500 text-sm">Section is required</p>
        )}
      </div>

      {/* Day */}
      <div>
        <label className="label">
          <span className="label-text">Day</span>
        </label>
        <select
          {...registeredit("editedDay", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Day</option>
          <option>Saturday</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>
        {errors.day && (
          <p className="text-red-500 text-sm">Day is required</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="label">
          <span className="label-text">Subject</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          {...registeredit("editedSubject", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">Subject is required</p>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label className="label">
          <span className="label-text">Start Time</span>
        </label>
        <input
          type="time"
          {...registeredit("editedStartTime", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm">Start time is required</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="label">
          <span className="label-text">End Time</span>
        </label>
        <input
          type="time"
          {...registeredit("editedEndTime", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.endTime && (
          <p className="text-red-500 text-sm">End time is required</p>
        )}
      </div>

      {/* Teacher Name */}
      <div className="md:col-span-2">
        <label className="label">
          <span className="label-text">Teacher Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Md. Rahman"
          {...registeredit("editedTeacherName", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.teacherName && (
          <p className="text-red-500 text-sm">
            Teacher name is required
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="modal-action md:col-span-2">
        <button
          type="button"
          className="btn"
          onClick={()=>modalRef.current.close()
          }
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-success">
          Save Routine
        </button>
      </div>
    </form>
  </div>
</dialog>


        </div>
    );
};

export default Classroutine;