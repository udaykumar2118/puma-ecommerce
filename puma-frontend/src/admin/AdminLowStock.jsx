import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminLowStock() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      // ⭐ USE BACKEND LOW STOCK API
      const res = await api.get("/api/admin/inventory/low-stock");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load low stock products");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <h1 className="text-3xl font-bold">Loading low stock...</h1>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 text-red-400">
        ⚠ Low Stock Products
      </h1>

      {products.length === 0 && (
        <p className="text-green-400 text-xl">
          All products are well stocked 🎉
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl backdrop-blur-lg"
          >
            <img
              src={p.imageUrl}
              className="h-40 mx-auto object-contain"
            />

            <h2 className="font-bold mt-4 text-lg">
              {p.name}
            </h2>

            <p className="text-gray-300">
              Brand: {p.brand}
            </p>

            <p className="text-red-400 font-bold text-2xl mt-2">
              Only {p.stock} left!
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Min level: {p.minStockLevel || "Not set"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}