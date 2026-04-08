
import { useState } from "react";
import { NavLink } from "react-router";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

const menuData = [
  { name: "HOME", link: "/" },

  {
    name: "ABOUT",
    dropdown: [
      { name: "At a Glance", link: "/glance" },
      { name: "History", link: "/history" },
      { name: "Mission & Vision", link: "/mission-vision" },
      { name: "News & Events", link: "/news-events" },
      { name: "Achievements", link: "/achievements" },
      { name: "Why Study", link: "/why-study" },
    ],
  },

  {
    name: "ADMINISTRATION",
    dropdown: [
      { name: "Principal", link: "/principal" },
      { name: "Vice Principal", link: "/chairmen" },
      { name: "Teachers", link: "/teacher" },
      { name: "Staffs", link: "/staffs" },
      { name: "NOC Application", link: "/noc" },
    ],
  },

  {
    name: "ACADEMIC",
    dropdown: [
    
      { name: "Class Routine", link: "/class-routine" },
      { name: "Exam Routine", link: "/exam-routine" },
      { name: "Syllabus", link: "/syllabus" },
    ],
  },

  {
    name: "RESULT",
    dropdown: [
      { name: "Exam Result", link: "/exam-result" },
      { name: "Board Result", link: "/board-result" },
    ],
  },

  { name: "NOTICE", link: "/notice" },

  {
    name: "ADMISSION",
    dropdown: [
      { name: "Caricular", link: "/caricular" },
      { name: "Admission Rules", link: "/admission-result" },
    ],
  },

  {
    name: "FACILITIES",
    dropdown: [
      { name: "Classrooms", link: "/classrooms" },
      { name: "Computer Lab", link: "/computer-lab" },
      { name: "Science Lab", link: "/science-lab" },
      { name: "Library", link: "/library" },
    ],
  },

  {
    name: "GALLERY",
    dropdown: [
      { name: "Photos", link: "/photos" },
      { name: "Videos", link: "/videos" },
    ],
  },

  { name: "CONTACT", link: "/contact" },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { logout, user } = useAuth();
  const { role, roleLoading } = useRole();

  const activeClass =
    "text-sky-300 border-b-2 border-sky-400";
  const normalClass =
    "flex items-center gap-1 hover:text-sky-300 transition";

  const handlelogout=()=>{
    logout()
    .then(res=>{
      console.log(res);
      alert("Logout Successfully")

      
    })
    .catch(error=>{
      console.log(error);
      alert(error.message)
      
    })
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-white">
            {menuData.map((item, index) => (
              <li key={index} className="relative group">

                {/* Main Item */}
                {item.link ? (
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      isActive ? activeClass : normalClass
                    }
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <button className={normalClass}>
                    {item.name}
                    <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
                  </button>
                )}

                {/* Desktop Dropdown */}
                {item.dropdown && (
                  <ul className="absolute top-10 left-0 w-52 rounded-xl bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl opacity-0 scale-95 invisible group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                    {item.dropdown.map((sub, i) => (
                      <li key={i}>
                        <NavLink
                          to={sub.link}
                          className="block px-5 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-sky-300"
                        >
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            
          {/* Dashboard */}
{!roleLoading && role === "admin" && (
  <li>
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? activeClass : normalClass
      }
    >
      DASHBOARD
    </NavLink>
  </li>
)}

            {/* Login */}

           {
            user ?  <li className="text-red-300 hover:text-red-400 cursor-pointer">
           <button onClick={handlelogout}> LOGOUT</button>
            </li>: <li className="text-sky-300 hover:text-sky-400 cursor-pointer">
           <NavLink to={'/login'}> LOGIN</NavLink>
            </li>
           }
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl border-t border-white/10 shadow-xl overflow-hidden transition-all duration-300 ${
          openMenu ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 text-white">

          {menuData.map((item, index) => (
            <div key={index} className="border-b border-white/10">

              {/* Mobile Main */}
              {item.link ? (
                <NavLink
                  to={item.link}
                  onClick={() => setOpenMenu(false)}
                  className="block py-3 font-semibold hover:text-sky-300"
                >
                  {item.name}
                </NavLink>
              ) : (
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === index ? null : index)
                  }
                  className="w-full flex justify-between items-center py-3 font-semibold"
                >
                  {item.name}
                  <FaChevronDown
                    className={`transition-transform ${
                      openDropdown === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* Mobile Dropdown */}
              {item.dropdown && openDropdown === index && (
                <div className="pl-4 pb-2 text-sm text-white/90">
                  {item.dropdown.map((sub, i) => (
                    <NavLink
                      key={i}
                      to={sub.link}
                      onClick={() => setOpenMenu(false)}
                      className="block py-2 px-2 rounded-md hover:bg-white/10 hover:text-sky-300"
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!roleLoading && role === "admin" && (
            <div className="border-b border-white/10">
              <NavLink
                to="/dashboard"
                onClick={() => setOpenMenu(false)}
                className="block py-3 font-semibold text-sky-300 hover:text-sky-200"
              >
                DASHBOARD
              </NavLink>
            </div>
          )}

         <NavLink to="/login">
  <div className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500/80 via-sky-600/80 to-sky-700/80 text-white font-semibold text-center cursor-pointer">
    LOGIN
  </div>
</NavLink>


          <div className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-500/90 via-red-600/90 to-red-700/90 text-white font-semibold text-center cursor-pointer">
            ONLINE APPLICATION
          </div>
        </div>
      </div>
    </nav>
  );
}

