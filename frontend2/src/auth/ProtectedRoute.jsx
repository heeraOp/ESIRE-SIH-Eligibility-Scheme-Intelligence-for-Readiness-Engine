import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return <div className="dashboard-outlet" style={{ marginLeft: 0 }}>Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
