import { NavLink } from "react-router-dom";

export default function AdminSidebar({ open, setOpen }) {

  const link = "block px-6 py-3 rounded transition font-medium";
  const active = "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={()=>setOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 z-50
        bg-black/80 backdrop-blur-md border-r border-white/10
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>

        <h1 className="text-2xl font-bold p-6 border-b border-white/10">
          Sneaky Admin
        </h1>

        <nav className="mt-6 space-y-2 px-3">

          <NavLink to="/admin" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Dashboard
          </NavLink>

          <NavLink to="/admin/orders" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Orders
          </NavLink>

          <NavLink to="/admin/products" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Products
          </NavLink>

          <NavLink to="/admin/revenue" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Revenue
          </NavLink>

          {/* INVENTORY */}
          <div className="pt-6 mt-6 border-t border-white/10 text-sm text-gray-400 px-3">
            INVENTORY
          </div>

          <NavLink to="/admin/add-stock" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Add Stock
          </NavLink>

          <NavLink to="/admin/low-stock" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Low Stock
          </NavLink>

          <NavLink to="/admin/inventory-history" onClick={()=>setOpen(false)}
            className={({isActive}) =>
              `${link} ${isActive ? active : "hover:bg-white/10 hover:pl-7"}`
            }>
            Inventory History
          </NavLink>

        </nav>
      </div>
    </>
  );
}