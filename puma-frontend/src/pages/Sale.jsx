import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Sale() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(res => {
        // 🔥 SALE LOGIC (price <= 6000)
        const filtered = res.data.filter(p => p.price <= 6000);
        setSaleProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold mb-2 text-red-600">
        SALE
      </h1>
      <p className="text-gray-600 mb-8">
        Grab your favorites at special prices
      </p>

      {loading ? (
        <p>Loading sale products...</p>
      ) : saleProducts.length === 0 ? (
        <p>No sale products available</p>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {saleProducts.map(product => (
            <div key={product.id} className="relative">
              {/* SALE BADGE */}
              <span
                className="
                  absolute top-2 left-2
                  bg-red-600 text-white
                  text-xs font-bold
                  px-2 py-1
                  z-10
                "
              >
                SALE
              </span>

              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
