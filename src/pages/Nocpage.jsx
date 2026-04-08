import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFileSignature, FaFilePdf } from "react-icons/fa";
import useAxiossecure from "../Hooks/useAxiossecure";

const Nocpage = () => {
  const axiosSecure = useAxiossecure();
  const [typeFilter, setTypeFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data: allNocs, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["noc-public-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/noc-list");
      return res.data;
    },
    refetchInterval: 45_000,
  });

  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const pdfUrl = (path) =>
    path && apiBase ? `${apiBase}${path}` : path || "#";

  const filteredNocs = useMemo(() => {
    const list = allNocs ?? [];
    const q = searchText.trim().toLowerCase();
    return list.filter((row) => {
      const rowType = (row.memberType || "").toLowerCase();
      const matchType = !typeFilter || rowType === typeFilter;
      const matchName = !q || (row.name || "").toLowerCase().includes(q);
      return matchType && matchName;
    });
  }, [allNocs, typeFilter, searchText]);

  return (
    <section className="relative bg-[#050b1e] text-white overflow-hidden py-10 px-4 md:px-8 min-h-[70vh]">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3">
            <FaFileSignature className="text-cyan-400" />
            NOC Documents
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto">
            This page is open for everyone. You can filter by teacher/staff and search
            by name to find NOC documents.
          </p>
        </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-300">Type</span>
              </label>
              <select
                className="select select-bordered w-full bg-white/10 border-white/20 text-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All (Teacher + Staff)</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="form-control md:col-span-2">
              <label className="label py-1">
                <span className="label-text text-gray-300">Search by name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                placeholder="Type teacher/staff name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <p className="text-gray-500 text-xs mb-4">
            Total result: <span className="text-gray-300">{filteredNocs.length}</span>
            {isFetching ? " · Refreshing..." : ""}
          </p>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-spinner text-cyan-400" />
            </div>
          ) : isError ? (
            <div className="alert alert-error text-sm">
              {error?.response?.data?.message ||
                error?.message ||
                "Could not load NOC records."}
            </div>
          ) : filteredNocs?.length ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="table table-md text-gray-200">
                <thead>
                  <tr className="border-white/10">
                    <th>Name</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNocs.map((row) => {
                    return (
                      <tr key={row._id} className="border-white/10">
                        <td className="whitespace-nowrap text-xs align-top">
                          {row.name || "—"}
                        </td>
                        <td className="text-xs align-top capitalize">
                          {row.memberType || "—"}
                        </td>
                        <td className="whitespace-nowrap text-xs align-top">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="align-top">
                          {row.file ? (
                            <a
                              href={pdfUrl(row.file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/45 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 shadow-sm transition-all hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-cyan-100"
                            >
                              <FaFilePdf className="text-sm" /> Download PDF
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
              No NOC found for the selected filter/search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Nocpage;
