import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");

  const logout = () => {
    if (!window.confirm("Logout from admin panel?")) return;
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-10">

      {/* TITLE */}
      <h1 className="text-xl md:text-2xl font-bold tracking-wide">
        Sneaky Admin Panel
      </h1>

      {/* RIGHT PROFILE BOX */}
      <div className="flex items-center justify-between md:justify-start gap-3 md:gap-4 
        bg-gradient-to-r from-white/10 to-white/5 
        backdrop-blur-xl px-4 md:px-5 py-2 rounded-full 
        border border-white/20 shadow-lg shadow-green-500/10 w-full md:w-auto">

        <div className="flex items-center gap-3 md:gap-4">
          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500"
            alt=""
          />

          <div className="leading-tight">
            <p className="font-semibold text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
              {adminEmail}
            </p>
            <p className="text-[10px] md:text-xs text-gray-400">
              Super Admin
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}