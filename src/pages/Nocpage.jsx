import React, { useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaFileSignature, FaFilePdf } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";
import useAuth from "../Hooks/useAuth";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseApplicantValue(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeNocStatus(s) {
  if (s === "rejected") return "declined";
  if (!s) return "pending";
  return s;
}

function statusBadgeMeta(status) {
  const s = normalizeNocStatus(status);
  const map = {
    pending: { label: "Pending", className: "badge-ghost border border-white/20" },
    approved: { label: "Approved", className: "badge-success" },
    declined: { label: "Declined", className: "badge-error" },
    suspended: { label: "Suspended", className: "badge-warning" },
  };
  return map[s] || map.pending;
}

const Nocpage = () => {
  const axiosSecure = useAxiossecure();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const userEmailNorm = useMemo(
    () => user?.email?.trim().toLowerCase() ?? "",
    [user?.email]
  );
  const userEmailValid = EMAIL_RX.test(userEmailNorm);

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

  const applicantsReady = !isLoading && !isError;

  const profileEmails = useMemo(() => {
    const set = new Set();
    (applicants?.teachers ?? []).forEach((p) => {
      if (p.email?.trim()) set.add(p.email.trim().toLowerCase());
    });
    (applicants?.staff ?? []).forEach((p) => {
      if (p.email?.trim()) set.add(p.email.trim().toLowerCase());
    });
    return set;
  }, [applicants]);

  const isEligible =
    applicantsReady && userEmailValid && profileEmails.has(userEmailNorm);

  const { data: myNocs, isLoading: myLoading, isFetching: myFetching } = useQuery({
    queryKey: ["noc-my", userEmailNorm],
    queryFn: async () => {
      const res = await axiosSecure.get("/noc/my-requests", {
        params: { email: userEmailNorm },
      });
      return res.data;
    },
    enabled: isEligible,
    refetchInterval: isEligible ? 45_000 : false,
  });

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const pdfUrl = (path) =>
    path && apiBase ? `${apiBase}${path}` : path || "#";

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

  const matchingOptions = useMemo(() => {
    if (!userEmailValid) return [];
    return allOptions.filter(
      (o) => o.email?.trim().toLowerCase() === userEmailNorm
    );
  }, [allOptions, userEmailNorm, userEmailValid]);

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
    if (person) {
      setDepartment(person.department || "");
      setJoiningDate(person.joiningDate || "");
      if (person.email?.trim()) {
        setStatusEmail(person.email.trim());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const parsed = parseApplicantValue(applicantKey);
    if (!parsed?.memberType || !parsed?.memberId) {
      setMessage({ type: "error", text: "Please select your name from the list." });
      return;
    }
    if (!department.trim() || !joiningDate.trim() || !purpose.trim()) {
      setMessage({
        type: "error",
        text: "Department, joining date, and purpose are required.",
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
        text:
          "Your NOC request was submitted successfully. Status: pending — an admin will review it soon.",
      });
      setApplicantKey("");
      setDepartment("");
      setJoiningDate("");
      setPurpose("");
      setPdfFile(null);
      const fileInput = document.getElementById("noc-pdf-input");
      if (fileInput) fileInput.value = "";
      queryClient.invalidateQueries({
        queryKey: ["noc-my", userEmailNorm],
      });
      queryClient.invalidateQueries({ queryKey: ["noc-my"] });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Network error — check that the API is running and VITE_API_URL is set."
          : err.message || "Submission failed.");
      setMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <section className="relative bg-[#050b1e] text-white min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-10 px-6 min-h-[70vh]">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <FaFileSignature className="text-cyan-400" />
            NOC Application
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Only teachers and staff whose <strong className="text-gray-300">signed-in email</strong> matches the
            email on their dashboard profile can view status and submit an NOC.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-cyan-400" />
          </div>
        )}

        {isError && (
          <div className="alert alert-error text-sm">
            {error?.response?.data?.message ||
              error?.message ||
              "Could not load applicant list."}
          </div>
        )}

        {applicantsReady && !userEmailValid && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-300">
            <p className="text-sm">
              Your account does not have a valid email address. Add an email to your
              login account, or sign in with an email linked to your teacher/staff
              profile.
            </p>
          </div>
        )}

        {applicantsReady && userEmailValid && !isEligible && (
          <div className="backdrop-blur-xl bg-white/5 border border-amber-500/30 rounded-2xl p-8 text-center">
            <p className="text-amber-200/95 text-sm leading-relaxed">
              The email you are signed in with ({user?.email}) is not registered as a
              teacher or staff member in this system. NOC status and the application
              form are only available when that email matches your profile in the
              dashboard. Ask an administrator to add or correct your email on your
              teacher/staff record.
            </p>
          </div>
        )}

        {isEligible && (
          <>
        {/* —— Your applications (admin status) —— */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-6 shadow-xl mb-6">
          <h2 className="text-lg font-semibold text-cyan-200 mb-3">
            Your applications &amp; status
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Showing requests for <span className="text-gray-300">{user?.email}</span>.
            Admin updates (Approved, Declined, Suspended, Pending) refresh about every
            45 seconds while this page is open.
          </p>
          {myLoading ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-spinner text-cyan-400" />
            </div>
          ) : myNocs?.length ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="table table-sm text-gray-200">
                <thead>
                  <tr className="border-white/10">
                    <th>Submitted</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {myNocs.map((row) => {
                    const meta = statusBadgeMeta(row.status);
                    return (
                      <tr key={row._id} className="border-white/10">
                        <td className="whitespace-nowrap text-xs align-top">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="max-w-[200px] text-xs align-top">
                          <span className="line-clamp-2" title={row.purpose}>
                            {row.purpose}
                          </span>
                        </td>
                        <td className="align-top">
                          <span
                            className={`badge badge-sm ${meta.className}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="align-top">
                          {row.file ? (
                            <a
                              href={pdfUrl(row.file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary text-xs inline-flex items-center gap-1"
                            >
                              <FaFilePdf /> Open
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2">
              {myFetching && !myLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  Refreshing…
                </span>
              ) : (
                "No NOC requests submitted for this profile yet."
              )}
            </p>
          )}
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-gray-300">Select your name *</span>
                </label>
                <select
                  className="select select-bordered w-full bg-white/10 border-white/20 text-white"
                  value={applicantKey}
                  onChange={onApplicantChange}
                  required
                >
                  <option value="">Choose your name…</option>
                  {matchingOptions.filter(
                    (p) => (p.memberType || "").toLowerCase() === "teacher"
                  ).length > 0 && (
                    <optgroup
                      label="Teachers"
                      className="bg-[#050b1e] text-white"
                    >
                      {matchingOptions
                        .filter(
                          (p) => (p.memberType || "").toLowerCase() === "teacher"
                        )
                        .map((p) => (
                        <option
                          key={`t-${p.memberId}`}
                          value={JSON.stringify({
                            memberType: p.memberType,
                            memberId: p.memberId,
                          })}
                          className="bg-[#050b1e]"
                        >
                          {p.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {matchingOptions.filter(
                    (p) => (p.memberType || "").toLowerCase() === "staff"
                  ).length > 0 && (
                    <optgroup label="Staff" className="bg-[#050b1e] text-white">
                      {matchingOptions
                        .filter(
                          (p) => (p.memberType || "").toLowerCase() === "staff"
                        )
                        .map((p) => (
                        <option
                          key={`s-${p.memberId}`}
                          value={JSON.stringify({
                            memberType: p.memberType,
                            memberId: p.memberId,
                          })}
                          className="bg-[#050b1e]"
                        >
                          {p.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                {!matchingOptions.length && (
                  <p className="text-amber-300/90 text-xs mt-2">
                    No profile row uses this login email. Contact an administrator.
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-gray-300">Department *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  placeholder="Department / position"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-gray-300">Joining date *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  placeholder="e.g. 2020-01-15"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-gray-300">
                    Purpose of NOC *
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  placeholder="Describe why you need the NOC…"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-gray-300">
                    PDF attachment * {" "}
                    <FaFilePdf className="inline text-cyan-400" />
                  </span>
                </label>
                <input
                  id="noc-pdf-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  className="file-input file-input-bordered w-full bg-white/10 border-white/20 text-sm"
                  onChange={(e) => {
                    setPdfFile(e.target.files?.[0] || null);
                    setMessage({ type: "", text: "" });
                  }}
                />
                <span className="label-text-alt text-gray-500 mt-1">
                  PDF only (max size depends on server configuration).
                </span>
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
                className="btn btn-primary w-full text-base"
                disabled={
                  submitting ||
                  !matchingOptions.length ||
                  !parseApplicantValue(applicantKey)
                }
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <FaFileSignature /> Submit NOC request
                  </>
                )}
              </button>
            </form>
        </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Nocpage;
