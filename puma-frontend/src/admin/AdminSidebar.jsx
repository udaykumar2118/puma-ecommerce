import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const link =
    "block px-6 py-3 rounded transition font-medium";

  const active =
    "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30";

  return (
    <div className="h-screen w-64 fixed bg-black/80 backdrop-blur-md border-r border-white/10">

      <h1 className="text-2xl font-bold p-6 border-b border-white/10">
        PUMA Admin
      </h1>

      <nav className="mt-6 space-y-2 px-3">

        <NavLink to="/admin"
          className={({isActive}) =>
            `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7 transition-all duration-300"}`
          }>
          Dashboard
        </NavLink>

        <NavLink to="/admin/orders"
          className={({isActive}) =>
            `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7 transition-all duration-300"}`
          }>
          Orders
        </NavLink>

        <NavLink to="/admin/products"
          className={({isActive}) =>
            `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7 transition-all duration-300"}`
          }>
          Products
        </NavLink>

        <NavLink to="/admin/revenue"
          className={({isActive}) =>
            `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7 transition-all duration-300"}`
          }>
          Revenue
        </NavLink>

      </nav>
    </div>
  );
}
