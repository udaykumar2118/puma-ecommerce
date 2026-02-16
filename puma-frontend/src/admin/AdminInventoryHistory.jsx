import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminInventoryHistory() {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  // ⭐ LOAD PRODUCTS FIRST
  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  // ⭐ LOAD HISTORY WHEN PRODUCT SELECTED
  const loadHistory = async (productId) => {
    const res = await api.get(`/api/admin/inventory/history/${productId}`);
    setHistory(res.data);
  };

  const selectProduct = (p) => {
    setSelectedProduct(p);
    loadHistory(p.id);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">
        Inventory Transactions
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* PRODUCT LIST */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <h2 className="text-xl font-bold mb-4">Select Product</h2>

          <div className="space-y-3 max-h-[500px] overflow-auto">
            {products.map(p => (
              <div
                key={p.id}
                onClick={()=>selectProduct(p)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition
                  ${selectedProduct?.id===p.id
                    ? "bg-green-600"
                    : "hover:bg-white/10"}`}
              >
                <img src={p.imageUrl} className="w-14 h-14 object-contain"/>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-400">
                    Stock: {p.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">

          {!selectedProduct && (
            <p className="p-10 text-center text-gray-400">
              Select product to view history
            </p>
          )}

          {selectedProduct && (
            <>
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">
                  {selectedProduct.name} — History
                </h2>
              </div>

              <table className="w-full text-left">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-4">Type</th>
                    <th>Qty</th>
                    <th>Previous</th>
                    <th>New</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map(h => (
                    <tr key={h.id} className="border-t border-white/10">
                      <td className={`p-4 font-bold ${
                        h.type === "SALE" ? "text-red-400" :
                        h.type === "PURCHASE" ? "text-green-400" :
                        "text-yellow-400"
                      }`}>
                        {h.type}
                      </td>
                      <td>{h.quantity}</td>
                      <td>{h.previousStock}</td>
                      <td>{h.newStock}</td>
                      <td>
                        {new Date(h.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {history.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-400">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

        </div>
      </div>
    </div>
  );
}