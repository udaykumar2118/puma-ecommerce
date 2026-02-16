import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminAddStock() {

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    }
  };

  const addStock = async () => {
    if (!selected) return alert("Please select product");
    if (!qty || qty <= 0) return alert("Enter valid quantity");

    try {
      setLoading(true);

      await api.post(
        `/api/admin/inventory/add-stock?productId=${selected.id}&quantity=${Number(qty)}&note=${note || "Stock purchase"}`
      );

      alert("Stock added successfully ✅");

      // ⭐ RESET FORM
      setQty("");
      setNote("");
      setSelected(null);

      // ⭐ REFRESH PRODUCT LIST (important)
      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Inventory Purchase</h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* PRODUCT LIST */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <h2 className="text-xl font-bold mb-4">Select Product</h2>

          <div className="space-y-3 max-h-[500px] overflow-auto">
            {products.map(p => (
              <div
                key={p.id}
                onClick={()=>setSelected(p)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition
                  ${selected?.id===p.id
                    ? "bg-green-600"
                    : "hover:bg-white/10"}`}
              >
                <img src={p.imageUrl} className="w-14 h-14 object-contain"/>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-400">
                    Current Stock: {p.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STOCK FORM */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">

          <h2 className="text-xl font-bold mb-6">Purchase Stock</h2>

          {selected && (
            <div className="mb-6">
              <p className="text-lg font-semibold">{selected.name}</p>
              <p className="text-gray-400">
                Current stock: {selected.stock}
              </p>
            </div>
          )}

          <input
            type="number"
            placeholder="Quantity purchased"
            className="input mb-4"
            value={qty}
            onChange={e=>setQty(e.target.value)}
          />

          <input
            placeholder="Note (supplier / warehouse)"
            className="input mb-6"
            value={note}
            onChange={e=>setNote(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={addStock}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl w-full text-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Stock"}
          </button>

        </div>
      </div>
    </div>
  );
}