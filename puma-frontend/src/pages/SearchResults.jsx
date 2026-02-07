import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function SearchResults() {
  const query = new URLSearchParams(useLocation().search).get("q");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;

    api.get("/products")
      .then(res => {
        const filtered = res.data.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch(console.error);
  }, [query]);

  return (
    <div className="px-6 md:px-12 py-12">
      <h2 className="text-2xl font-bold mb-6">
        Search results for “{query}”
      </h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
        ">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
