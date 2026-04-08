import React, { useMemo, useState } from "react";
import useAxiossecure from "../Hooks/useAxiossecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaFilePdf, FaFileSignature } from "react-icons/fa";

function parseApplicantValue(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const NocManagement = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const [applicantKey, setApplicantKey] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { data: applicants, isLoading, isError, error } = useQuery({
    queryKey: ["noc-applicants"],
    queryFn: async () => {
      const res = await axiosSecure.get("/noc/applicants");
      return res.data;
    },
  });

  const { data: recentNocs, isLoading: recentLoading } = useQuery({
    queryKey: ["noc-list", "recent-admin-issued"],
    queryFn: async () => {
      const res = await axiosSecure.get("/noc-list");
      return res.data;
    },
  });

  const allOptions = useMemo(() => {
    const teachers = applicants?.teachers ?? [];
    const staff = applicants?.staff ?? [];
    return [
      ...teachers.map((p) => ({
        ...p,
        label: `${p.name} (Teacher)`,
      })),
      ...staff.map((p) => ({
        ...p,
        label: `${p.name} (Staff)`,
      })),
    ];
  }, [applicants]);

  const onApplicantChange = (e) => {
    const raw = e.target.value;
    setApplicantKey(raw);
    setMessage({ type: "", text: "" });

    const parsed = parseApplicantValue(raw);
    if (!parsed) {
      setDepartment("");
      setJoiningDate("");
      return;
    }

    const person = allOptions.find(
      (o) =>
        o.memberType === parsed.memberType && o.memberId === parsed.memberId
    );

    if (!person) {
      setDepartment("");
      setJoiningDate("");
      return;
    }

    setDepartment(person.department || "");
    setJoiningDate(person.joiningDate || "");
  };

  const pdfUrl = (path) =>
    path && apiBase ? `${apiBase}${path}` : path || "#";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const parsed = parseApplicantValue(applicantKey);
    if (!parsed?.memberType || !parsed?.memberId) {
      setMessage({ type: "error", text: "Please select a teacher or staff." });
      return;
    }
    if (!department.trim() || !joiningDate.trim() || !purpose.trim()) {
      setMessage({
        type: "error",
        text: "Department, joining date, and note/purpose are required.",
      });
      return;
    }
    if (!pdfFile) {
      setMessage({ type: "error", text: "Please attach a PDF file." });
      return;
    }

    const formData = new FormData();
    formData.append("memberType", parsed.memberType);
    formData.append("memberId", parsed.memberId);
    formData.append("department", department.trim());
    formData.append("joiningDate", joiningDate.trim());
    formData.append("purpose", purpose.trim());
    formData.append("file", pdfFile);

    setSubmitting(true);
    try {
      await axiosSecure.post("/noc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: "NOC PDF has been issued and saved successfully.",
      });
      setPurpose("");
      setPdfFile(null);
      const fileInput = document.getElementById("admin-noc-pdf-input");
      if (fileInput) fileInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["noc-list"] });
      queryClient.invalidateQueries({ queryKey: ["noc-my"] });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to submit NOC.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow">
        <h1 className="mb-1 text-xl font-bold">Issue NOC PDF</h1>
        <p className="text-sm opacity-70">
          Select a teacher/staff, upload the signed NOC PDF, and submit.
        </p>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow">
        {isLoading && <p>Loading teacher/staff list...</p>}

        {isError && (
          <div className="alert alert-error text-sm">
            {error?.response?.data?.message ||
              error?.message ||
              "Could not load applicants."}
          </div>
        )}

        {!isLoading && !isError && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text">Teacher/Staff *</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={applicantKey}
                onChange={onApplicantChange}
                required
              >
                <option value="">Select teacher or staff...</option>
                {(applicants?.teachers?.length ?? 0) > 0 && (
                  <optgroup label="Teachers">
                    {applicants.teachers.map((p) => (
                      <option
                        key={`t-${p.memberId}`}
                        value={JSON.stringify({
                          memberType: p.memberType,
                          memberId: p.memberId,
                        })}
                      >
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {(applicants?.staff?.length ?? 0) > 0 && (
                  <optgroup label="Staff">
                    {applicants.staff.map((p) => (
                      <option
                        key={`s-${p.memberId}`}
                        value={JSON.stringify({
                          memberType: p.memberType,
                          memberId: p.memberId,
                        })}
                      >
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text">Department</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text">Joining Date</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text">Note / Purpose *</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[120px]"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Example: Official NOC issued by admin for bank process."
                required
              />
            </div>

            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text inline-flex items-center gap-2">
                  PDF Attachment * <FaFilePdf />
                </span>
              </label>
              <input
                id="admin-noc-pdf-input"
                type="file"
                accept="application/pdf,.pdf"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  setPdfFile(e.target.files?.[0] || null);
                  setMessage({ type: "", text: "" });
                }}
                required
              />
            </div>

            {message.text && (
              <div
                role="alert"
                className={`alert text-sm ${
                  message.type === "success" ? "alert-success" : "alert-error"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={submitting || !parseApplicantValue(applicantKey)}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Issuing...
                </>
              ) : (
                <>
                  <FaFileSignature /> Submit NOC
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow">
        <h2 className="mb-3 text-lg font-semibold">
          Recently Issued NOC ({recentNocs?.length ?? 0})
        </h2>
        {recentLoading ? (
          <p>Loading list...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {recentNocs?.length ? (
                  recentNocs.slice(0, 12).map((row) => (
                    <tr key={row._id}>
                      <td>{row.name || "—"}</td>
                      <td className="capitalize">{row.memberType || "—"}</td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center opacity-70">
                      No NOC issued yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NocManagement;
