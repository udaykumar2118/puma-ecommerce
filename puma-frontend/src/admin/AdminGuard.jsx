import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // still checking storage (prevents redirect loop)
  if (token === null || role === null) {
    return null; // wait one render
  }

  // not logged in → go admin login
  if (!token) {
return <Navigate to="/admin/login" replace />;  }

  // logged in but not admin → go home
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // admin allowed
  return children;
}
