import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the current location so we can redirect back after login
    localStorage.setItem(
      "auth_return_url",
      location.pathname + location.search,
    );

    if (fallback) {
      return <>{fallback}</>;
    }

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
