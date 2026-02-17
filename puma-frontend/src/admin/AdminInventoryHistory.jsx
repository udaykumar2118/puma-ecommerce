import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminInventoryHistory() {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const loadHistory = async (productId) => {
    const res = await api.get(`/api/admin/inventory/history/${productId}`);
    setHistory(res.data);
  };

  const selectProduct = (p) => {
    setSelectedProduct(p);
    loadHistory(p.id);
  };

  return (
    <div className="p-4 md:p-8">

      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10">
        Inventory Transactions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">

        {/* PRODUCT LIST */}
        <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20">
          <h2 className="text-lg md:text-xl font-bold mb-4">Select Product</h2>

          <div className="space-y-3 max-h-[350px] md:max-h-[500px] overflow-auto pr-2">
            {products.map(p => (
              <div
                key={p.id}
                onClick={()=>selectProduct(p)}
                className={`flex items-center gap-3 md:gap-4 p-3 rounded-lg cursor-pointer transition
                  ${selectedProduct?.id===p.id
                    ? "bg-green-600"
                    : "hover:bg-white/10"}`}
              >
                <img src={p.imageUrl} className="w-12 h-12 md:w-14 md:h-14 object-contain bg-white rounded" alt=""/>

                <div>
                  <p className="font-semibold text-sm md:text-base">{p.name}</p>
                  <p className="text-xs md:text-sm text-gray-400">Stock: {p.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">

          {!selectedProduct && (
            <p className="p-6 md:p-10 text-center text-gray-400">
              Select product to view history
            </p>
          )}

          {selectedProduct && (
            <>
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-bold">
                  {selectedProduct.name} — History
                </h2>
              </div>

              {/* TABLE SCROLL FIX FOR MOBILE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="p-3 md:p-4">Type</th>
                      <th>Qty</th>
                      <th>Previous</th>
                      <th>New</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map(h => (
                      <tr key={h.id} className="border-t border-white/10">
                        <td className={`p-3 md:p-4 font-bold ${
                          h.type === "SALE" ? "text-red-400" :
                          h.type === "PURCHASE" ? "text-green-400" :
                          "text-yellow-400"
                        }`}>
                          {h.type}
                        </td>
                        <td>{h.quantity}</td>
                        <td>{h.previousStock}</td>
                        <td>{h.newStock}</td>
                        <td className="text-sm">
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
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}