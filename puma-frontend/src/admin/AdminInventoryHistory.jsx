import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminInventoryHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await api.get("/api/admin/inventory/history/1");
    setHistory(res.data);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Inventory Transactions</h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4">Product</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Previous</th>
              <th>New</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map(h => (
              <tr key={h.id} className="border-t border-white/10">
                <td className="p-4">{h.product.name}</td>
                <td className={h.type==="SALE"?"text-red-400":"text-green-400"}>
                  {h.type}
                </td>
                <td>{h.quantity}</td>
                <td>{h.previousStock}</td>
                <td>{h.newStock}</td>
                <td>{new Date(h.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}