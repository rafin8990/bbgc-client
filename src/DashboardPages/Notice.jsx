import { useForm } from "react-hook-form";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// const notices = [
//   {
//     id: 1,
//     title: "আলিম পরীক্ষার ফলাফল ২০২৫",
//     date: "বুধবার, ২৯ অক্টোবর, ২০২৫",
//     status: "Published",
//   },
//   {
//     id: 2,
//     title: "Welcome to the website of Jannatul Ummah Girls Dakhil Madrasa",
//     date: "মঙ্গলবার, ২৮ অক্টোবর, ২০২৫",
//     status: "Published",
//   },
// ];

const Notice = () => {
  const [editNotice, setEditNotice] = useState(null);

    const {register,handleSubmit,reset,formState:{errors}}=useForm()
     
    // edit form
    const {
  register: editRegister,
  handleSubmit: handleEditSubmit,
  reset: editReset,

} = useForm();


     const axiosSecure=useAxiossecure()
     const {data:notices,refetch}=useQuery({
      queryKey:['notice'],
      queryFn:async()=>{
        const res= await axiosSecure.get('/notice')
        return res.data
      }
     })
    const handleNotice= async(data)=>{

          console.log(data);
          const formData = new FormData();
          formData.append('noticeTitle', data.noticeTitle);
          formData.append('noticeDescription', data.noticeDescription);
          formData.append('noticeStatus', data.noticeStatus || 'Published');
          if (data.file && data.file[0]) {
            formData.append('file', data.file[0]);
          }
          
          await axiosSecure.post('/notice', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(()=>{
                      refetch()
            reset()
            alert("Notice Added")
            document.getElementById("upload_notice_modal").close(); 
          })
          .catch(error=>{
            alert(error.message)
          })
          // setNoticeData(data)
    }

   //delete Notice
   const handleDelete=(id)=>{
    axiosSecure.delete(`/notice/${id}`)
    .then((res)=>{
      refetch()
      console.log(res);
      alert("Notice Deleted")
      
    })
    .catch(error=>{
      console.log(error);
      alert(error.message)
      
    })
   }



  return (
    <div className="p-6 min-h-screen bg-slate-100">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          📢 Notice Management
        </h1>

        {/* Open Modal Button */}
        <button
          className="btn btn-success gap-2"
          onClick={() =>
            document.getElementById("upload_notice_modal").showModal()
          }
        >
          <FaPlus />
          Upload New Notice
        </button>
      </div>

      {/* Notice List */}
      <div className="grid gap-6">
        {notices?.map((notice) => (
          <div
            key={notice._id}
            className="card bg-base-100 shadow-md"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">{notice.noticeTitle}</h2>
                {notice.file && (
                  <span className="badge badge-info badge-sm">📎 File</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                প্রকাশের তারিখ: {notice.createdAt}
              </p>
              {notice.file && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📎</span>
                    <span className="text-blue-700 text-sm font-medium">Attachment:</span>
                    <a
                      href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${notice.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      {notice.file.split('/').pop()}
                    </a>
                  </div>
                </div>
              )}

              <div className="card-actions justify-end mt-4">
               <button
  className="btn btn-info btn-sm gap-2"
  onClick={() => {
    setEditNotice(notice);
    editReset(notice)
    document.getElementById("edit_notice_modal").showModal();
  }}>
  <FaEdit />
  Edit
</button>

                <button onClick={()=>handleDelete(notice._id)} className="btn btn-error btn-sm gap-2">
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DaisyUI Modal ================= */}
      <dialog
  id="upload_notice_modal"
  className="modal modal-bottom sm:modal-middle"
>
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-4">
      Upload New Notice
    </h3>

    {/* Modal Form */}
    <form
      className="space-y-4"
      onSubmit={handleSubmit(handleNotice)}
    >
      <input
        type="text"
        placeholder="Notice Title"
        {...register("noticeTitle", { required: true })}
        className="input input-bordered w-full"
      />
      {errors.noticeTitle && (
        <p className="text-red-500">Set a notice title</p>
      )}

      <textarea
        placeholder="Notice Description"
        {...register("noticeDescription", { required: true })}
        className="textarea textarea-bordered w-full h-28"
      />
      {errors.noticeDescription && (
        <p className="text-red-500">
          Write the notice description
        </p>
      )}

      <input
        type="file"
        {...register("file")}
        className="file-input file-input-bordered w-full"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      <select
        {...register("noticeStatus")}
        className="select select-bordered w-full"
        defaultValue="Published"
      >
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>
      {errors.noticeStatus && (
        <p className="text-red-500">Set notice status</p>
      )}

      <div className="modal-action">
        {/* Cancel Button */}
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

        {/* Submit Button */}
        <button type="submit" className="btn btn-success">
          Publish Notice
        </button>
      </div>
    </form>
  </div>
</dialog>

{/* Edit Modal */}
<dialog id="edit_notice_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg mb-4">
      Edit Notice
    </h3>

    <form
      className="space-y-4"
      onSubmit={handleEditSubmit(async (data) => {
        const formData = new FormData();
        formData.append('noticeTitle', data.noticeTitle);
        formData.append('noticeDescription', data.noticeDescription);
        formData.append('noticeStatus', data.noticeStatus || 'Published');
        if (data.file && data.file[0]) {
          formData.append('file', data.file[0]);
        }

        await axiosSecure.patch(
          `/notice/${editNotice?._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        refetch()
        alert("Notice Updated");
        document.getElementById("edit_notice_modal").close();
      })}
    >
      <input
        type="text"
        defaultValue={editNotice?.noticeTitle}
        {...editRegister("noticeTitle")}
        className="input input-bordered w-full"
      />

      <textarea
        defaultValue={editNotice?.noticeDescription}
        {...editRegister("noticeDescription")}
        className="textarea textarea-bordered w-full h-28"
      />

      <input
        type="file"
        {...editRegister("file")}
        className="file-input file-input-bordered w-full"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      <select
        {...editRegister("noticeStatus")}
        className="select select-bordered w-full"
        defaultValue={editNotice?.noticeStatus || "Published"}
      >
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>

      <div className="modal-action">
        <button
          type="button"
          className="btn"
          onClick={() =>
            document.getElementById("edit_notice_modal").close()
          }
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-info">
          Update
        </button>
      </div>
    </form>
  </div>
</dialog>

    </div>
  );
};

export default Notice;
