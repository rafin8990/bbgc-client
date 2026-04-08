import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";

/**
 * requireEmail=true (default): must have Firebase user + email (e.g. dashboard).
 * requireEmail=false: any signed-in user — role does not matter (e.g. NOC page).
 */
const Privateroutes = ({ children, requireEmail = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center bg-[#050b1e] text-white">
        <span className="loading loading-spinner loading-lg text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmail && !user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Privateroutes;
