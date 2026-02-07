import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import categories from "../data/categories";

export default function Category() {

  const { type } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const category = categories[type];

    if (!category) {
      setProducts([]);
      setLoading(false);
      setError("Category not found");
      return;
    }

    setLoading(true);
    setError("");

    // ⭐ FIXED API URL
    api.get(`/api/products/category/${category.id}`)
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));

  }, [type]);

  const categoryName = categories[type]?.name || "Category";

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
        <h1 className="text-3xl font-bold">{error}</h1>
      </div>
    );

  return (
    <div className="px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold mb-8 uppercase">
        {categoryName} Collection
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-32 text-gray-500 text-xl">
          No products available 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
