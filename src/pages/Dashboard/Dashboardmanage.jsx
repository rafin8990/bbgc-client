import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiossecure from "../../Hooks/useAxiossecure";
import {
  FaChalkboardTeacher,
  FaUserTie,
  FaNewspaper,
  FaTrophy,
  FaBook,
  FaClipboardList,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaUsers,
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

  // Generic fetcher
  const fetchData = async (url) => {
    const res = await axiosSecure.get(url);
    return res.data;
  };

  // Queries
  const { data: notices = [] } = useQuery({ queryKey: ["notices"], queryFn: () => fetchData("/notice") });
  const { data: news = [] } = useQuery({ queryKey: ["news"], queryFn: () => fetchData("/news") });
  const { data: events = [] } = useQuery({ queryKey: ["achievements"], queryFn: () => fetchData("/achievements") });
  const { data: teachers = [] } = useQuery({ queryKey: ["teachers"], queryFn: () => fetchData("/teacher") });
  const { data: achievements = [] } = useQuery({ queryKey: ["achievements"], queryFn: () => fetchData("/achievements") });

  // Chart data
  const barData = [
    { name: "Notices", count: notices.length },
    { name: "News", count: news.length },
    { name: "Events", count: events.length },
    { name: "Teachers", count: teachers.length },
    { name: "Achievements", count: achievements.length },
  ];

  const pieData = [
    { name: "Notices", value: notices.length },
    { name: "News", value: news.length },
    { name: "Events", value: events.length },
    { name: "Teachers", value: teachers.length },
    { name: "Achievements", value: achievements.length },
  ];

  const COLORS = ["#00BFFF", "#FF7F50", "#FFBB28", "#00C49F", "#8884D8"];

  // Dashboard cards
  const cards = [
    { title: "Notices", icon: <FaFileAlt />, count: notices.length, color: "from-cyan-400 to-blue-500" },
    { title: "Teachers", icon: <FaChalkboardTeacher />, count: teachers.length, color: "from-pink-400 to-purple-500" },
    { title: "News", icon: <FaNewspaper />, count: news.length, color: "from-orange-400 to-red-500" },
    { title: "Events", icon: <FaTrophy />, count: events.length, color: "from-green-400 to-teal-500" },
    { title: "Achievements", icon: <FaTrophy />, count: achievements.length, color: "from-yellow-400 to-orange-500" },
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-10 px-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Dashboard Overview</h2>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Bar Chart */}
        <div className="bg-white shadow-xl rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Entity Counts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: "#4B5563", fontSize: 14 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#4B5563", fontSize: 14 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "10px" }}
                itemStyle={{ color: "#1D4ED8", fontWeight: "bold" }}
              />
              <Bar dataKey="count" fill="#00BFFF" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-xl rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Content Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`relative bg-gradient-to-r ${card.color} text-white rounded-3xl p-6 flex flex-col justify-between shadow-lg overflow-hidden transform transition-all hover:scale-105 cursor-pointer`}
          >
            {/* Decorative Circle */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-4 z-10 relative">
              <div className="text-4xl">{card.icon}</div>
              <div>
                <h3 className="text-lg font-semibold truncate">{card.title}</h3>
                <p className="text-sm mt-1">{card.count} items</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notices */}
        <div className="bg-white shadow-xl rounded-3xl p-6 overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Notices</h3>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {notices.slice(0, 5).map((item) => (
              <li key={item._id} className="border-b border-gray-200 pb-2 last:border-none">
                <p className="text-gray-800 font-medium truncate">{item.noticeTitle}</p>
                <p className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent News */}
        <div className="bg-white shadow-xl rounded-3xl p-6 overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent News</h3>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {news.slice(0, 5).map((item) => (
              <li key={item._id} className="border-b border-gray-200 pb-2 last:border-none">
                <p className="text-gray-800 font-medium truncate">{item.title}</p>
                <p className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Events */}
        <div className="bg-white shadow-xl rounded-3xl p-6 overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Events</h3>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {events.slice(0, 5).map((item) => (
              <li key={item._id} className="border-b border-gray-200 pb-2 last:border-none">
                <p className="text-gray-800 font-medium truncate">{item.title}</p>
                <p className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboardmanage;
