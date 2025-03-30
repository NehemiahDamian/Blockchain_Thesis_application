// pages/ProtectedRoute.jsx
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ children, role }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-8" />
      </div>
    );
  }

  if (!authUser || authUser.role !== role) {
    return <Navigate to={`/${role}/login`} />;
  }

  return children;
};

export default ProtectedRoute;
