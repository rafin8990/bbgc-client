import { createBrowserRouter, Navigate } from "react-router"
import Mainlayout from "../Layouts/Mainlayout"
import Home from "../pages/HomePages/Home"
import Dashboard from "../pages/Dashboard/Dashboard"
import Notice from "../DashboardPages/Notice"
import SliderManagement from "../DashboardPages/SliderManagement"
import Noticepage from "../pages/NoticePage/Noticepage"
import ChairmenMessage from "../DashboardPages/ChairmenMessage"
import PrincipalMessage from "../DashboardPages/PrincipalMessage"
import Chairmenpage from "../pages/Chairmen/Chairmenpage"
import Principalpage from "../pages/Principal/Principalpage"
import Teachers from "../DashboardPages/Teachers"
import Teacherspage from "../pages/Teachers/Teacherspage"
import History from "../DashboardPages/History"
import Historypage from "../pages/History/Historypage"
import NewsEvents from "../DashboardPages/NewsEvents"
import Newseventpage from "../pages/News&Events/Newseventpage"
import Achievements from "../DashboardPages/Achievements"
import Achievementspage from "../pages/Achievements/Achievementspage"
import Classroutine from "../DashboardPages/Classroutine"
import Classroutinepage from "../pages/Classroutine/Classroutinepage"
import ExamRoutine from "../DashboardPages/Examroutine"
import Examroutinepage from "../pages/Examroutine/Examroutinepage"
import Login from "../pages/Auth/Login/Login"
import Register from "../pages/Auth/Register/Register"
import MissionVision from "../pages/Dashboard/MissionVision"
import MissionVisionpage from "../pages/Mission&Vision/MissionVisionpage"
import Atglance from "../DashboardPages/Atglance"
import Syllabus from "../pages/Dashboard/Syllabus"
import Atglancepage from "../pages/Atglancepage"
import Syllabuspage from "../pages/Syllabus/Syllabuspage"
import Circular from "../DashboardPages/Circular"
import Caricularpage from "../pages/Caricular/Caricularpage"
import AdmissionResult from "../pages/Dashboard/AdmissionResult"
import AdmissionResultpage from "../pages/AdmissionResult/AdmissionResultpage"
import Photos from "../DashboardPages/Photos"
import Photospage from "../pages/Photos/Photospage"
import Videos from "../DashboardPages/Videos"
import Videopage from "../pages/Videos/Videopage"
import Contactpage from "../pages/Contact/Contactpage"
import Whaystudypage from "../pages/WhyStudy/Whaystudypage"
import Dashboardmanage from "../pages/Dashboard/Dashboardmanage"
import Privateroutes from "./Privateroutes"
import Classroompage from "../pages/Classroompage"
import Computerlabpage from "../pages/Computerlabpage"
import Sciencelabpage from "../pages/Sciencelab/Sciencelabpage"
import Librarypage from "../pages/Library/Librarypage"
import Examresultpage from "../pages/Result/Examresultpage"
import Boardresultpage from "../pages/Result/Boardresultpage"
import Studentlist from "../DashboardPages/Studentlist"
import Whaystudy from "../DashboardPages/Whaystudy"
import HeaderManagement from "../DashboardPages/HeaderManagement"
import AboutManagement from "../DashboardPages/AboutManagement"
import FooterManagement from "../DashboardPages/FooterManagement"
import ContactManagement from "../DashboardPages/ContactManagement"
import ComputerLabManagement from "../DashboardPages/ComputerLabManagement"
import ScienceLabManagement from "../DashboardPages/ScienceLabManagement"
import LibraryManagement from "../DashboardPages/LibraryManagement"
import ClassroomManagement from "../DashboardPages/ClassroomManagement"
import StaffManagement from "../DashboardPages/StaffManagement"
import Stuffpage from "../pages/staffs/Stuffpage"

export const router=createBrowserRouter([
     //Main Layout Routes
    {
        path:'/',
        element:<Mainlayout/>,
        children:[{path:'/', element:<Home/>},
             {path:'/notice', element:<Noticepage/>},
             {path:'/chairmen', element:<Chairmenpage/>},
             {path:'/principal', element:<Principalpage/>},
             {path:'/teacher', element:<Teacherspage/>},
             {path:'/staff', element:<Stuffpage/>},
             {path:'/staffs', element:<Stuffpage/>},
             {path:'/history', element:<Historypage/>},
             {path:'/news-events', element:<Newseventpage/>},
             {path:'/achievements', element:<Achievementspage/>},
             {path:'/class-routine', element:<Classroutinepage/>},
             {path:'/exam-routine', element:<Examroutinepage/>},
             {path:'/mission-vision', element:<MissionVisionpage/>},
             {path:'/login', element:<Login/>},
             {path:'/register', element:<Register/>},
             {path:'/glance', element:<Atglancepage/>},
             {path:'/syllabus', element:<Syllabuspage/>},
             {path:'/caricular', element:<Caricularpage/>},
             {path:'/admission-result', element:<AdmissionResultpage/>},
             {path:'/photos', element:<Photospage/>},
             {path:'/videos', element:<Videopage/>},
             {path:'/contact', element:<Contactpage/>},
             {path:'/why-study', element:<Whaystudypage/>},
             {path:'/classrooms', element:<Classroompage/>},
             {path:'/computer-lab', element:<Computerlabpage/>},
             {path:'/science-lab', element:<Sciencelabpage/>},
             {path:'/library', element:<Librarypage/>},
             {path:'/exam-result', element:<Examresultpage/>},
             {path:'/board-result', element:<Boardresultpage/>},
        ]
    },
    
    //dashboard Layout
    {
        path:'/dashboard',
        element:<Privateroutes><Dashboard/></Privateroutes>,
        children:[{index:true, element:<Navigate to="/dashboard/dashboard-manage" replace />},
                 {path:'/dashboard/notice', element:<Notice/>},
                  {path:'/dashboard/slider-management', element:<SliderManagement/>},
                  {path:'/dashboard/chairmen-message', element:<ChairmenMessage/>},
                  {path:'/dashboard/principal-message', element:<PrincipalMessage/>},
                  {path:'/dashboard/teachers', element:<Teachers/>},
                  {path:'/dashboard/history', element:<History/>},
                  {path:'/dashboard/news-events', element:<NewsEvents/>},
                  {path:'/dashboard/achievements', element:<Achievements/>},
                  {path:'/dashboard/class-routine', element:<Classroutine/>},
                  {path:'/dashboard/exam-routine', element:<ExamRoutine/>},
                  {path:'/dashboard/mission-vision', element:<MissionVision/>},
                  {path:'/dashboard/at-a-glance', element:<Atglance/>},
                  {path:'/dashboard/syllabus', element:<Syllabus/>},
                  {path:'/dashboard/circular', element:<Circular/>},
                  {path:'/dashboard/admission-result', element:<AdmissionResult/>},
                  {path:'/dashboard/photos', element:<Photos/>},
                  {path:'/dashboard/videos', element:<Videos/>},
                  {path:'/dashboard/dashboard-manage', element:<Dashboardmanage/>},
                  {path:'/dashboard/why-study', element:<Whaystudy/>},
                  {path:'/dashboard/student-list', element:<Studentlist/>},
                  {path:'/dashboard/header-management', element:<HeaderManagement/>},
                  {path:'/dashboard/about-management', element:<AboutManagement/>},
                  {path:'/dashboard/footer-management', element:<FooterManagement/>},
                  {path:'/dashboard/contact-management', element:<ContactManagement/>},
                  {path:'/dashboard/computer-lab-management', element:<ComputerLabManagement/>},
                  {path:'/dashboard/science-lab-management', element:<ScienceLabManagement/>},
                  {path:'/dashboard/library-management', element:<LibraryManagement/>},
                  {path:'/dashboard/classroom-management', element:<ClassroomManagement/>},
                  {path:'/dashboard/staff-management', element:<StaffManagement/>},

        ]
    }
])