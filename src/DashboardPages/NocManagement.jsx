import React, { useRef, useState } from "react";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaFilePdf, FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

const ADMIN_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "suspended", label: "Suspended" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...ADMIN_STATUS_OPTIONS,
];

function normalizeNocStatus(s) {
  if (s === "rejected") return "declined";
  if (!s) return "pending";
  return s;
}

function statusLabel(status) {
  const s = normalizeNocStatus(status);
  return (
    ADMIN_STATUS_OPTIONS.find((o) => o.value === s)?.label ||
    s ||
    "Pending"
  );
}

const NocManagement = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const [statusFilter, setStatusFilter] = useState("");
  const detailModalRef = useRef(null);
  const [detailRow, setDetailRow] = useState(null);

  const { data: list, isLoading } = useQuery({
    queryKey: ["noc-list", statusFilter],
    queryFn: async () => {
      const url = statusFilter
        ? `/noc-list?status=${encodeURIComponent(statusFilter)}`
        : "/noc-list";
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/noc/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noc-list"] });
    },
  });

  const deleteNoc = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/noc/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noc-list"] });
    },
  });

  const openDetail = (row) => {
    setDetailRow(row);
    detailModalRef.current?.showModal();
  };

  const pushStatus = (row, status, selectEl) => {
    const prev = normalizeNocStatus(row.status);
    if (prev === status) return;
    if (
      !window.confirm(
        `Set status to "${statusLabel(status)}" for ${row.name || "this request"}?`
      )
    ) {
      if (selectEl) selectEl.value = prev;
      return;
    }
    updateStatus.mutate(
      { id: row._id, status },
      {
        onError: (err) => {
          if (selectEl) selectEl.value = prev;
          alert(
            err.response?.data?.message ||
              err.message ||
              "Failed to update status"
          );
        },
        onSuccess: () => {
          detailModalRef.current?.close();
          setDetailRow(null);
        },
      }
    );
  };

  const handleRowStatusSelect = (row, e) => {
    const status = e.target.value;
    pushStatus(row, status, e.target);
  };

  const handleDelete = (row) => {
    if (!window.confirm(`Delete NOC request from ${row.name || "this user"}?`))
      return;
    deleteNoc.mutate(row._id, {
      onError: (err) => {
        alert(err.response?.data?.message || err.message || "Delete failed");
      },
      onSuccess: () => {
        detailModalRef.current?.close();
        setDetailRow(null);
      },
    });
  };

  const pdfUrl = (path) =>
    path && apiBase ? `${apiBase}${path}` : path || "#";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center shadow-2xl p-5">
        <h1 className="font-bold text-lg">
          NOC Management ({list?.length ?? 0}
          {statusFilter ? ` · filtered` : ""})
        </h1>
        <label className="form-control w-full max-w-xs">
          <span className="label-text text-xs font-medium">Filter by status</span>
          <select
            className="select select-bordered select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>Joining</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list?.length ? (
                list.map((row, i) => {
                  const st = normalizeNocStatus(row.status);
                  return (
                    <tr key={row._id}>
                      <th>{i + 1}</th>
                      <td className="font-medium">{row.name}</td>
                      <td className="capitalize">{row.memberType}</td>
                      <td>{row.department}</td>
                      <td>{row.joiningDate}</td>
                      <td
                        className="max-w-[200px] truncate"
                        title={row.purpose}
                      >
                        {row.purpose}
                      </td>
                      <td>
                        <select
                          className="select select-bordered select-xs max-w-[10rem]"
                          value={st}
                          disabled={updateStatus.isPending}
                          onChange={(e) => handleRowStatusSelect(row, e)}
                        >
                          {ADMIN_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap text-xs">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td>
                        {row.file ? (
                          <a
                            href={pdfUrl(row.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary inline-flex items-center gap-1"
                          >
                            <FaFilePdf /> Open
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => openDetail(row)}
                            title="Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-base-content/60"
                  >
                    No NOC requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <dialog ref={detailModalRef} className="modal">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg">NOC request</h3>
          {detailRow && (
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="opacity-70">Name:</span> {detailRow.name}
              </p>
              <p>
                <span className="opacity-70">Type:</span>{" "}
                <span className="capitalize">{detailRow.memberType}</span>
              </p>
              <p>
                <span className="opacity-70">Department:</span>{" "}
                {detailRow.department}
              </p>
              <p>
                <span className="opacity-70">Joining date:</span>{" "}
                {detailRow.joiningDate}
              </p>
              <p>
                <span className="opacity-70">Purpose:</span>
              </p>
              <p className="bg-base-200 rounded-lg p-3 whitespace-pre-wrap">
                {detailRow.purpose}
              </p>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full max-w-xs"
                  value={normalizeNocStatus(detailRow.status)}
                  disabled={updateStatus.isPending}
                  onChange={(e) =>
                    pushStatus(detailRow, e.target.value, e.target)
                  }
                >
                  {ADMIN_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {detailRow.file && (
                <p>
                  <a
                    href={pdfUrl(detailRow.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary inline-flex items-center gap-1"
                  >
                    <FaFilePdf /> View PDF
                  </a>
                </p>
              )}
              <div className="divider" />
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm gap-2"
                disabled={deleteNoc.isPending}
                onClick={() => handleDelete(detailRow)}
              >
                <FaTrash /> Delete request
              </button>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button type="submit" className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NocManagement;
