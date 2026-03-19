import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("USER" | "LANDLORD" | "ADMIN" | "ADVERTISER")[];
  requiredRole?: "USER" | "LANDLORD" | "ADMIN" | "ADVERTISER";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredRole,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role restrictions
  const roles = requiredRoles || (requiredRole ? [requiredRole] : undefined);

  if (roles && !roles.includes(user?.role as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
