import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState({});
  const [openOrder, setOpenOrder] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // ================= LOAD ORDERS =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/orders/my", authHeader);
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    }
  };

  // ================= LOAD ORDER ITEMS =================
  const toggleOrder = async (orderId) => {
    if (openOrder === orderId) {
      setOpenOrder(null);
      return;
    }

    if (!items[orderId]) {
      try {
        const res = await api.get(`/api/orders/${orderId}/items`, authHeader);
        setItems(prev => ({ ...prev, [orderId]: res.data }));
      } catch {
        alert("Failed to load items");
        return;
      }
    }

    setOpenOrder(orderId);
  };

  // ================= TRACK ORDER =================
  const toggleTrack = (orderId) => {
    if (trackingOpen === orderId) setTrackingOpen(null);
    else setTrackingOpen(orderId);
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await api.put(`/api/orders/${orderId}/cancel`, {}, authHeader);
      alert("Order cancelled ❌");
      loadOrders();
    } catch {
      alert("Cancel failed");
    }
  };

  // ================= DOWNLOAD INVOICE =================
  const downloadInvoice = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:9090/api/invoice/download/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("Invoice not ready");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch {
      alert("Invoice not available yet");
    }
  };

  // ================= STATUS COLOR =================
  const statusColor = (status) => {
    if (status === "PLACED") return "text-yellow-600";
    if (status === "PAID") return "text-blue-600";
    if (status === "SHIPPED") return "text-purple-600";
    if (status === "DELIVERED") return "text-green-600";
    if (status === "CANCELLED") return "text-red-600";
    return "";
  };

  const getStep = (status) => {
    switch (status) {
      case "PLACED":
      case "PAID": return 1;
      case "SHIPPED": return 2;
      case "OUT_FOR_DELIVERY": return 3;
      case "DELIVERED": return 4;
      default: return 0;
    }
  };

  const isActive = (step, current) => step <= current;

  // ================= UI =================
  return (
    <div className="bg-gray-100 min-h-screen py-14 px-6 md:px-16">

      <h1 className="text-4xl font-bold mb-12">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-32 text-gray-500 text-2xl">
          No orders found 😢
        </div>
      ) : (
        <div className="space-y-8">

          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">

              {/* HEADER */}
              <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">TOTAL</p>
                    <p className="font-semibold">₹{order.totalAmount}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">ORDER ID</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">STATUS</p>
                    <p className={`font-bold ${statusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 flex-wrap">

                  <button
                    onClick={() => toggleTrack(order.id)}
                    className="border px-4 py-2 rounded hover:bg-gray-100">
                    Track Package
                  </button>

                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    Order Details
                  </button>

                  {(order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED") && (
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white">
                      Download Invoice
                    </button>
                  )}

                  {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white">
                      Cancel Order
                    </button>
                  )}

                </div>
              </div>

              {/* TRACKING */}
              {trackingOpen === order.id && (
                <div className="p-6 bg-gray-50 border-b">
                  {(() => {
                    const currentStep = getStep(order.status);
                    const steps = ["Order Placed","Shipped","Out for delivery","Delivered"];

                    return (
                      <div className="flex justify-between items-center text-sm">
                        {steps.map((label, index) => {
                          const active = isActive(index+1, currentStep);

                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${active ? "bg-green-500" : "bg-gray-300"}`}>
                                {active ? "✓" : ""}
                              </div>
                              <p className="mt-2">{label}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ITEMS */}
              {openOrder === order.id && items[order.id] && (
                <div className="p-6 space-y-6">
                  {items[order.id].map(i => (
                    <div key={i.id} className="flex gap-6 items-center border-b pb-6">
                      <img src={i.product.imageUrl} className="w-24 h-24 object-contain bg-gray-100 p-2 rounded"/>
                      <div className="flex-1">
                        <h3 className="font-semibold">{i.product.name}</h3>
                        <p>Qty: {i.quantity}</p>
                        <p className="font-bold">₹{i.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
