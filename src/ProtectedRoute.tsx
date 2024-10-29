import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/auth";

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
