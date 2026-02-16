import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminAddStock() {

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  const addStock = async () => {
    if (!selected || !qty) return alert("Fill all fields");

    await api.post(
      `/api/admin/inventory/add-stock?productId=${selected.id}&quantity=${qty}&note=${note}`
    );

    alert("Stock added successfully ✅");
    setQty(""); setNote("");
    loadProducts();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Inventory Purchase</h1>

      <div className="grid grid-cols-2 gap-10">

        {/* PRODUCT LIST */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <h2 className="text-xl font-bold mb-4">Select Product</h2>

          <div className="space-y-3 max-h-[500px] overflow-auto">
            {products.map(p => (
              <div
                key={p.id}
                onClick={()=>setSelected(p)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition
                  ${selected?.id===p.id ? "bg-green-600" : "hover:bg-white/10"}`}
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
              <p className="text-gray-400">Current stock: {selected.stock}</p>
            </div>
          )}

          <input
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
            onClick={addStock}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl w-full text-lg font-semibold"
          >
            Add Stock
          </button>

        </div>
      </div>
    </div>
  );
}