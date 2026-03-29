import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import logo from '../assets/bbgclogo.jpeg'
import Marquee from 'react-fast-marquee';
import NoticeMarquee from '../Components/NoticeMarquee';
const Mainlayout = () => {
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050b1e] text-white'>
          <header>
          <div className="relative w-full overflow-hidden bg-[#050b1e]">

  {/* Glow effects */}
  <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-blue-600/30 blur-[140px]" />
  <div className="absolute -bottom-32 -right-32 w-80 h-80 md:w-[420px] md:h-[420px] bg-cyan-400/20 blur-[160px]" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center">
    
    {/* Glass Card */}
    <div
      className="
        w-full
        flex flex-col sm:flex-row
        items-center sm:items-start
        gap-4 sm:gap-6
        backdrop-blur-xl bg-white/10
        border border-white/20
        rounded-2xl
        px-4 sm:px-6 md:px-8
        py-5 sm:py-6
        shadow-xl
      "
    >
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 grid place-items-center shrink-0">
        <img
          src={logo}
          alt="logo"
          className="w-full h-full object-contain rounded-full"
        />
      </div>

      {/* Text */}
      <div className="text-white text-center sm:text-left">
        <h1 className="font-bold text-lg sm:text-xl md:text-3xl tracking-wide">
         BEANIBAZAR GOVERNMENT COLLEGE
        </h1>

        <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
         BEANIBAZAR GOVT. COLLEGE - 1709<br></br>
          Beanibazar, Sylhet, Bangladesh  
          <br />
          <span className="text-cyan-300">
            EIIN: 130172 
          </span>
        </p>
      </div>
    </div>
  </div>
</div>


            {/* Navbar */}
           <Navbar/>
          </header>
          <main>
            <NoticeMarquee/>
            <Outlet/>
            </main>  
            <footer>
                <Footer/>
            </footer>
            <Marquee/>
        </div>
    );
};

export default Mainlayout;