import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiossecure from '../Hooks/useAxiossecure';
import { FaTimes } from 'react-icons/fa';

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

const API = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const Videos = () => {
  const axiosSecure = useAxiossecure();

  const addModalRef = useRef();
  const editModalRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    reset: resetEdit,
  } = useForm();

  const [editingVideo, setEditingVideo] = useState(null);

  /* ================= FETCH ================= */
  const { data: videoData = [], refetch, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await axiosSecure.get('/videos');
      return res.data;
    },
  });

  /* ================= ADD ================= */
  const handleAddvideo = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('link', data.link);
    formData.append('file', data.file[0]);

    await axiosSecure.post('/videos', formData);

    reset();
    addModalRef.current.close();
    refetch();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;

    await axiosSecure.delete(`/videos/${id}`);
    refetch();
  };

  /* ================= OPEN EDIT ================= */
  const openEditModal = (video) => {
    setEditingVideo(video);

    setValue('title', video.title);
    setValue('link', video.link);

    editModalRef.current.showModal();
  };

  /* ================= UPDATE ================= */
  const handleEdit = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('link', data.link);

    if (data.file?.[0]) {
      formData.append('file', data.file[0]);
    }

    await axiosSecure.patch(`/videos/${editingVideo._id}`, formData);

    resetEdit();
    editModalRef.current.close();
    refetch();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-base-200 to-base-300 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">🎬 Video Gallery</h1>

        <button
          onClick={() => addModalRef.current.showModal()}
          className="btn btn-success gap-2 shadow-lg"
        >
          <FaPlus /> Add Video
        </button>
      </div>

      {/* GRID */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {videoData.map((video) => (
            <div
              key={video._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition rounded-2xl overflow-hidden"
            >
              {/* VIDEO (FIXED) */}
              {video.file && (
                <video
                  src={`${API}${video.file}`}
                  controls
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="card-body space-y-3">

                <h2 className="font-semibold truncate">{video.title}</h2>

                <div className="flex gap-2">

                  {video.link && (
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm flex-1 gap-2"
                    >
                      <FaExternalLinkAlt /> Watch
                    </a>
                  )}

                  <button
                    onClick={() => openEditModal(video)}
                    className="btn btn-warning btn-sm flex-1 gap-2"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(video._id)}
                    className="btn btn-error btn-sm flex-1 gap-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

     {/* ADD MODAL */}
<dialog ref={addModalRef} className="modal">
  <div className="modal-box relative space-y-4">

    {/* ❌ close button */}
    <button
      type="button"
      onClick={() => addModalRef.current.close()}
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    >
      <FaTimes />
    </button>

    <h3 className="font-bold text-lg">Add Video</h3>

    <form onSubmit={handleSubmit(handleAddvideo)}>
      <input
        {...register('title')}
        placeholder="Title"
        className="input input-bordered w-full mb-3"
      />

      <input
        {...register('link')}
        placeholder="Link"
        className="input input-bordered w-full mb-3"
      />

      <input
        type="file"
        accept="video/*"
        {...register('file')}
        className="file-input file-input-bordered w-full mb-4"
      />

      <button className="btn btn-success w-full">Save</button>
    </form>
  </div>
</dialog>


     {/* EDIT MODAL */}
<dialog ref={editModalRef} className="modal">
  <div className="modal-box relative space-y-4">

    {/* ❌ close button */}
    <button
      type="button"
      onClick={() => editModalRef.current.close()}
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    >
      <FaTimes />
    </button>

    <h3 className="font-bold text-lg">Edit Video</h3>

    <form onSubmit={handleSubmitEdit(handleEdit)}>
      <input
        {...registerEdit('title')}
        className="input input-bordered w-full mb-3"
      />

      <input
        {...registerEdit('link')}
        className="input input-bordered w-full mb-3"
      />

      <input
        type="file"
        accept="video/*"
        {...registerEdit('file')}
        className="file-input file-input-bordered w-full mb-4"
      />

      <button className="btn btn-warning w-full">Update</button>
    </form>
  </div>
</dialog>

    </div>
  );
};

export default Videos;
