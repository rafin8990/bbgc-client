import React from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router";
import logo from "../../../assets/logo.jpeg";
import useAuth from "../../../Hooks/useAuth";
import useAxiossecure from "../../../Hooks/useAxiossecure";

const Register = () => {
    const {registerUser}=useAuth()
    const axiosSecure=useAxiossecure()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  

  const handleRegister=(data)=>{
    console.log(data);
    registerUser(data.email,data.password)
    .then((res)=>{
        console.log(res.data);
        alert("Register Successfylly")
        const userInfo={
              displayName : data.name,
              email:data.email,
             }
        axiosSecure.post('/users',userInfo)
           if(res.data.insertedId){
                console.log('user created in Database');
                alert("user saved in database")
              }
            })
            .catch(error=>{
              console.log(error);
              
            })

    .catch(error=>{
        console.log(error);
        alert(error.message)
        
    })
  }
  return (
    <div className="relative min-h-screen bg-[#050b1e] flex items-center justify-center overflow-hidden px-4">
      
      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Register Card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 rounded-full border border-white/20 mb-3"
          />
          <h2 className="text-2xl font-semibold text-white">
            Create Account
          </h2>
          <p className="text-sm text-gray-400">
            Register to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Full Name
            </label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-cyan-400">
              <FaUser className="text-cyan-400" />
              <input
                type="text"
                placeholder="Enter your name"
                className="bg-transparent w-full text-white placeholder-gray-400 
                           outline-none focus:outline-none focus:ring-0 focus:bg-transparent"
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Email
            </label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-cyan-400">
              <FaEnvelope className="text-cyan-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full text-white placeholder-gray-400 
                           outline-none focus:outline-none focus:ring-0 focus:bg-transparent"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Password
            </label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-cyan-400">
              <FaLock className="text-cyan-400" />
              <input
                type="password"
                placeholder="Create a strong password"
                className="bg-transparent w-full text-white placeholder-gray-400 
                           outline-none focus:outline-none focus:ring-0 focus:bg-transparent"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Must include uppercase, lowercase, number & special character",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition"
          >
            Register
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Jannatul Ummah Girls Dakhil Madrasa
        </p>
      </div>
    </div>
  );
};

export default Register;
