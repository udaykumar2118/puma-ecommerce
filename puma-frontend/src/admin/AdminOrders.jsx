import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/admin/orders/${id}/status?status=${status}`);
      setOrders(o => o.map(ord => ord.id === id ? res.data : ord));
    } catch (err) {
      console.error(err);
    }
  };

  // 🌈 STATUS COLORS
  const badgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "PLACED":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30";
      case "PAID":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "SHIPPED":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-400/30";
      case "DELIVERED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-400/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  // 🔎 SEARCH + FILTER
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toString().includes(search);
    const matchFilter = filter === "ALL" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <h1 className="text-4xl font-bold">Orders Management</h1>

        <div className="flex gap-4">
          {/* SEARCH */}
          <input
            placeholder="Search Order ID..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg outline-none focus:border-green-400 transition"
          />

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-black rounded-lg"
          >
            <option value="ALL">All</option>
            <option>PENDING</option>
            <option>PLACED</option>
            <option>PAID</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl">
        <table className="w-full text-left">

          <thead className="bg-white/5 text-gray-300 text-sm uppercase">
            <tr>
              <th className="p-5">Order ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Update</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} className="border-t border-white/10 hover:bg-white/10 transition">

                <td className="p-5 font-semibold text-lg">#{o.id}</td>

                <td className="font-bold text-green-400 text-lg">
                  ₹{o.totalAmount}
                </td>

                {/* STATUS BADGE */}
                <td>
                  <span className={`${badgeColor(o.status)} px-4 py-1.5 rounded-full text-xs font-semibold`}>
                    {o.status}
                  </span>
                </td>

                {/* STATUS UPDATE */}
                <td>
                  <select
                    value={o.status}
                    onChange={(e)=>updateStatus(o.id, e.target.value)}
                    className="bg-black/40 border border-white/20 px-4 py-2 rounded-lg"
                  >
                    <option>PENDING</option>
                    <option>PLACED</option>
                    <option>PAID</option>
                    <option>SHIPPED</option>
                    <option>DELIVERED</option>
                    <option>CANCELLED</option>
                  </select>
                </td>

                {/* VIEW DETAILS */}
                <td>
                  <button
                    onClick={()=>setSelectedOrder(o)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-[500px] space-y-3">
            <h2 className="text-2xl font-bold">
              Order #{selectedOrder.id}
            </h2>

            <p>Status: {selectedOrder.status}</p>
            <p>Amount: ₹{selectedOrder.totalAmount}</p>

            <button
              onClick={()=>setSelectedOrder(null)}
              className="mt-6 bg-red-600 px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
