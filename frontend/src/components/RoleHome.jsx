import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleHome() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    switch (user.role) {
      case "student":
        navigate("/dashboard/student");
        break;
      case "teacher":
        navigate("/dashboard/teacher");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      default:
        navigate("/feed");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFC]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}
