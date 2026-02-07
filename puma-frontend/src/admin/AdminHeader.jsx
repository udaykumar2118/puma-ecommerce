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
    <div className="flex justify-between items-center mb-10">

      <h1 className="text-2xl font-bold tracking-wide">
        PUMA Admin Panel
      </h1>

      <div className="flex items-center gap-4 
        bg-gradient-to-r from-white/10 to-white/5 
        backdrop-blur-xl px-5 py-2 rounded-full 
        border border-white/20 shadow-lg shadow-green-500/10">

        <img
          src="https://i.pravatar.cc/100"
          className="w-10 h-10 rounded-full border-2 border-green-500"
        />

        <div>
          <p className="font-semibold text-sm">{adminEmail}</p>
          <p className="text-xs text-gray-400">Super Admin</p>
        </div>

        <button
          onClick={logout}
          className="ml-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
