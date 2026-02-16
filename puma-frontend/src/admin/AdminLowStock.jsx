import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminLowStock() {

  const [products, setProducts] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await api.get('/api/products');
    setProducts(res.data.filter(p => p.stock < 10));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 text-red-400">
        ⚠ Low Stock Alert
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl"
          >
            <img src={p.imageUrl} className="h-40 mx-auto object-contain"/>
            <h2 className="font-bold mt-4">{p.name}</h2>
            <p className="text-red-400 font-bold text-xl">
              Only {p.stock} left!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}