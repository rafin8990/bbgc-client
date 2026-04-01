import React from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "../../../assets/logo.jpeg";
import useAuth from "../../../Hooks/useAuth";
import useAxiossecure from "../../../Hooks/useAxiossecure";

const Login = () => {
    const { loginUser } = useAuth();
    const axiosSecure = useAxiossecure();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await loginUser(data.email, data.password);
      const email = res?.user?.email;

      if (!email) {
        alert("Login failed: user email not found");
        return;
      }

      const roleRes = await axiosSecure.get(`/users/${email}/role`);
      const role = roleRes.data?.role;

      alert("Login Successfully");

      if (role === "admin") {
        navigate("/dashboard", { replace: true });
        return;
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050b1e] flex items-center justify-center overflow-hidden px-4">
      
      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-400/20 blur-[120px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 rounded-full border border-white/20 mb-3"
          />
          <h2 className="text-2xl font-semibold text-white">
            Admin Login
          </h2>
          <p className="text-sm text-gray-400">
            Welcome back, please login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Email
            </label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <FaEnvelope className="text-cyan-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                {...register("email", { required: "Email is required" })}
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
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <FaLock className="text-cyan-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                {...register("password", {
                  required: "Password is required",
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
            Login
          </button>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-cyan-400 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Register Link */}
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Jannatul Ummah Girls Dakhil Madrasa
        </p>
      </div>
    </div>
  );
};

export default Login;
