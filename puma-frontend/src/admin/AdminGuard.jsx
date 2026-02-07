import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
