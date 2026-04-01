
import React from "react";
import { Link } from "react-router";
import { useQueries } from "@tanstack/react-query";
import useAxiossecure from "../../Hooks/useAxiossecure";
import {
  FaChalkboardTeacher,
  FaNewspaper,
  FaTrophy,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaUsers,
  FaImages,
  FaBullhorn,
  FaBookOpen,
  FaUniversity,
  FaRegChartBar,
  FaArrowRight,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboardmanage = () => {
  const axiosSecure = useAxiossecure();

  const fetchData = async (url) => {
    const res = await axiosSecure.get(url);
    return res.data;
  };

  const dashboardItems = [
    {
      key: "notices",
      title: "Notices",
      endpoint: "/notice",
      route: "/dashboard/notice",
      icon: FaBullhorn,
      color: "from-cyan-500 to-blue-600",
    },
    {
      key: "teachers",
      title: "Teachers",
      endpoint: "/teacher",
      route: "/dashboard/teachers",
      icon: FaChalkboardTeacher,
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      key: "news",
      title: "News",
      endpoint: "/news",
      route: "/dashboard/news-events",
      icon: FaNewspaper,
      color: "from-orange-500 to-red-500",
    },
    {
      key: "achievements",
      title: "Achievements",
      endpoint: "/achievements",
      route: "/dashboard/achievements",
      icon: FaTrophy,
      color: "from-emerald-500 to-teal-600",
    },
    {
      key: "slider",
      title: "Slider",
      endpoint: "/slider",
      route: "/dashboard/slider-management",
      icon: FaImages,
      color: "from-indigo-500 to-blue-700",
    },
    {
      key: "photos",
      title: "Photos",
      endpoint: "/photos",
      route: "/dashboard/photos",
      icon: FaImage,
      color: "from-pink-500 to-rose-600",
    },
    {
      key: "videos",
      title: "Videos",
      endpoint: "/videos",
      route: "/dashboard/videos",
      icon: FaVideo,
      color: "from-amber-500 to-orange-600",
    },
    {
      key: "syllabus",
      title: "Syllabus",
      endpoint: "/syllabus",
      route: "/dashboard/syllabus",
      icon: FaBookOpen,
      color: "from-sky-500 to-cyan-700",
    },
    {
      key: "circular",
      title: "Circular",
      endpoint: "/circular",
      route: "/dashboard/circular",
      icon: FaFileAlt,
      color: "from-lime-500 to-green-600",
    },
    {
      key: "admissionResult",
      title: "Admission Result",
      endpoint: "/admission-results",
      route: "/dashboard/admission-result",
      icon: FaUniversity,
      color: "from-slate-500 to-gray-700",
    },
  ];

  const queryResults = useQueries({
    queries: dashboardItems.map((item) => ({
      queryKey: [item.key],
      queryFn: () => fetchData(item.endpoint),
    })),
  });

  const itemsWithCount = dashboardItems.map((item, index) => ({
    ...item,
    count: Array.isArray(queryResults[index]?.data)
      ? queryResults[index].data.length
      : 0,
  }));

  const isLoading = queryResults.some((query) => query.isLoading);
  const hasError = queryResults.some((query) => query.isError);

  const totalContent = itemsWithCount.reduce((acc, item) => acc + item.count, 0);

  const barData = itemsWithCount
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((item) => ({ name: item.title, count: item.count }));

  const pieData = itemsWithCount
    .filter((item) => item.count > 0)
    .map((item) => ({ name: item.title, value: item.count }));

  const COLORS = [
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#14b8a6",
    "#84cc16",
    "#6366f1",
  ];

  return (
    <section className="min-h-screen bg-white text-slate-900 px-4 md:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
          <p className="text-cyan-700 text-sm uppercase tracking-wider mb-2 font-semibold">
            Admin Control Center
          </p>
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            Dashboard Management
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-1.5">
              <FaUsers />
              Total Content: {totalContent}
            </span>
            <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5">
              <FaRegChartBar />
              Data Sources: {itemsWithCount.length}
            </span>
          </div>
        </div>

        {hasError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3">
            Some dashboard data failed to load. Please refresh the page.
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-200 px-4 py-3">
            Loading dashboard data...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
              Content Count (Top 8)
            </h3>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    color: "#0f172a",
                  }}
                />
                <Bar dataKey="count" fill="#0891b2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-md">
            <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">
              Content Distribution
            </h3>
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  innerRadius={45}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    color: "#0f172a",
                  }}
                />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800">Quick Manage Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {itemsWithCount.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.route}
                  className={`group relative rounded-2xl border border-slate-200 bg-gradient-to-br ${item.color} p-4 shadow-md transition hover:scale-[1.02]`}
                >
                  <div className="absolute inset-0 bg-black/35 rounded-2xl" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <h4 className="text-2xl font-bold mt-1 text-white">{item.count}</h4>
                      <p className="text-xs text-white/95 mt-1">
                        Manage {item.title.toLowerCase()}
                      </p>
                    </div>
                    <Icon className="text-2xl text-white" />
                  </div>
                  <div className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm text-white font-medium">
                    Open <FaArrowRight className="text-xs" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">Highest Content</p>
            <p className="text-2xl font-bold mt-1 text-cyan-700">
              {barData[0]?.name || "N/A"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {barData[0]?.count || 0} entries
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">Managed Sections</p>
            <p className="text-2xl font-bold mt-1 text-violet-700">
              {itemsWithCount.length}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              One-click navigation enabled
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">Overall Status</p>
            <p className="text-2xl font-bold mt-1 text-emerald-700">
              {hasError ? "Needs Review" : "Healthy"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Live data from API endpoints
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboardmanage;
