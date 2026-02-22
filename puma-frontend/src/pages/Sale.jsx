import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Sale() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => {
        const filtered = res.data.filter((p) => p.price <= 6000);
        setSaleProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🔥 HERO HEADER */}
      <div className="px-6 md:px-12 pt-12 pb-8 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 tracking-tight">
          SALE
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Grab your favorites at special prices 🔥 Limited time deals
        </p>
      </div>

      {/* 🔥 CONTENT */}
      <div className="px-6 md:px-12 pb-14 max-w-7xl mx-auto">
        {loading ? (
          /* ✅ PREMIUM SKELETON */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : saleProducts.length === 0 ? (
          /* ✅ EMPTY STATE */
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">
              😔 No sale products available
            </p>
          </div>
        ) : (
          /* ✅ PRODUCTS GRID */
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-8
            "
          >
            {saleProducts.map((product) => (
              <div key={product.id} className="relative group">

                {/* 🔥 HOVER CARD EFFECT */}
                <div
                  className="
                    bg-white
                    rounded-2xl
                    transition-all duration-300
                    group-hover:-translate-y-1
                    group-hover:shadow-xl
                  "
                >
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}