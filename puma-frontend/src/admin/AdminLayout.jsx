import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {

  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1974&auto=format&fit=crop"
        className="fixed inset-0 w-full h-full object-cover -z-20"
        alt=""
      />

      {/* GREEN PREMIUM GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_40%)] -z-10" />

      {/* DARK GLASS OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-md -z-10" />

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={()=>setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 px-3 py-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT */}
      <div className="
        p-4 md:p-6 lg:p-10 min-h-screen
        lg:ml-64 transition-all duration-300
      ">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}