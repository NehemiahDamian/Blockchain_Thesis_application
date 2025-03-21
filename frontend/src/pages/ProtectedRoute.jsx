// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ role, children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    // While checking auth, show a loader or message.
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to the correct login page for the role.
  if (!authUser) {
    return <Navigate to={`/${role}/login`} />;
  }

  // If the logged in user's role doesn't match the required role, redirect them.
  if (authUser.role !== role) {
    return <Navigate to={`/${authUser.role}/dashboard`} />;
  }

  // If everything is good, render the children (protected component).
  return children;
};

export default ProtectedRoute;
