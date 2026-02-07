import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1974&auto=format&fit=crop"
        className="fixed inset-0 w-full h-full object-cover -z-20"
      />

      {/* GREEN PREMIUM GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_40%)] -z-10" />

      {/* DARK GLASS OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-md -z-10" />

      <AdminSidebar />

      <div className="ml-64 p-10 min-h-screen">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
