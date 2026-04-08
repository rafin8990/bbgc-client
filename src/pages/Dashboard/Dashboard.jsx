import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaNewspaper,
  FaUserTie,
  FaBook,
  FaChartPie,
  FaClock,
  FaNotesMedical,
  FaImage,
  FaVideo,
  FaEdit,
  FaKeyboard,
  FaFlask,
  FaBookOpen,
  FaChalkboardTeacher,
  FaUsers,
  FaFileSignature,
} from "react-icons/fa";
import { FaClipboardUser, FaMapLocationDot } from "react-icons/fa6";

const Dashboard = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ===== CONTENT ===== */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <div className="navbar bg-base-100 border-b">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
            >
              ☰
            </label>
          </div>
          <div className="flex-1 px-4 font-semibold text-lg">
            Dashboard
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* ===== SIDEBAR ===== */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-base-200 px-4 py-6">
          <ul className="menu text-base-content gap-1">

            {/* Dashboard */}
            <li>
              <NavLink to="/dashboard/dashboard-manage" className="font-medium">
                <FaChartPie /> Dashboard
              </NavLink>
            </li>

            {/* Home */}
            <li>
              <NavLink to="/">
                <FaHome /> Home
              </NavLink>
            </li>

            {/* ABOUT */}
            <li className="menu-title mt-3">About</li>
            <li><NavLink to="/dashboard/at-a-glance">At a Glance</NavLink></li>
            <li><NavLink to="/dashboard/history">History</NavLink></li>
            <li><NavLink to="/dashboard/about-management">About Management</NavLink></li>
            <li><NavLink to="/dashboard/achievements">Achievement</NavLink></li>
            <li><NavLink to="/dashboard/news-events">News & Event</NavLink></li>
            <li><NavLink to="/dashboard/why-study">Why Study</NavLink></li>
            <li><NavLink to="/dashboard/mission-vision">Mission & Vision</NavLink></li>

            {/* ADMINISTRATION */}
            <li className="menu-title mt-3">Administration</li>
             <li>
              <NavLink to="/dashboard/principal-message">
                Principal's Message
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/chairmen-message">
                <FaUserTie /> Vice Principal's Message
              </NavLink>
            </li>
           
            <li>
              <NavLink to="/dashboard/teachers">
                Teachers
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/staff-management">
                <FaUsers /> Staff Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/noc-management">
                <FaFileSignature /> NOC Management
              </NavLink>
            </li>

            {/* ACADEMIC */}
            <li className="menu-title mt-3">Academic</li>
            <li>
              <NavLink to="/dashboard/student-list">
                <FaBook /> Student List
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/class-routine">
                <FaClipboardUser /> Class Routine
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/exam-routine">
                <FaClock /> Exam Routine
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/syllabus">
                <FaNotesMedical /> Syllabus
              </NavLink>
            </li>
            <li className="menu-title mt-3">Facilities</li>
            <li>
              <NavLink to="/dashboard/computer-lab-management">
                <FaKeyboard /> Computer Lab Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/science-lab-management">
                <FaFlask /> Science Lab Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/library-management">
                <FaBookOpen /> Library Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/classroom-management">
                <FaChalkboardTeacher /> Classroom Management
              </NavLink>
            </li>

           {/* Admission*/}
            <li className="menu-title mt-3">Admission</li>
            <li>
              <NavLink to="/dashboard/circular">
                <FaBook /> Circular
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/admission-result">
                <FaClipboardUser /> Admission Result
              </NavLink>
            </li>

           {/* Photo videos*/}
            <li className="menu-title mt-3">Gallery</li>
            <li>
              <NavLink to="/dashboard/header-management">
                <FaImage /> Header Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/slider-management">
                <FaImage /> Slider Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/photos">
                <FaImage /> Photos
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/videos">
                <FaVideo /> Videos
              </NavLink>
            </li>

            
            {/* NOTICE */}
            <li className="menu-title mt-3">Others</li>
            <li>
              <NavLink to="/dashboard/notice">
                <FaNewspaper /> Notice
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/contact-management">
                <FaMapLocationDot /> Contact Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/footer-management">
                <FaEdit /> Footer Management
              </NavLink>
            </li>

          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
