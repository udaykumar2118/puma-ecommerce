import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-xl">Loading...</div>;

  const isOutOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  // ================= CART =================
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    await api.post(
      `/api/cart/add?productId=${id}&quantity=${qty}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added to cart 🛒");
  };

  // ================= WISHLIST =================
  const addToWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    await api.post(
      `/api/wishlist/add?productId=${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Added to wishlist ❤️");
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ================= BREADCRUMB ================= */}
      <div className="px-8 md:px-20 py-6 text-sm text-gray-500">
        Home / {product.category?.name || "Products"} / 
        <span className="text-black font-semibold"> {product.name}</span>
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid md:grid-cols-2 gap-16 px-8 md:px-20 pb-20">

        {/* IMAGE SECTION */}
        <div className="bg-gray-100 p-16 rounded-2xl shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[480px] object-contain hover:scale-105 transition duration-500"
          />
        </div>

        {/* BUY BOX */}
        <div className="space-y-6">

          <div>
            <p className="text-gray-500 uppercase tracking-widest text-sm">
              {product.brand || "PUMA"}
            </p>

            <h1 className="text-4xl font-extrabold mt-1">
              {product.name}
            </h1>

            <p className="text-3xl font-bold mt-3">
              ₹{product.price}
            </p>
          </div>

          {/* STOCK WARNINGS */}
          {isOutOfStock && (
            <p className="text-red-600 font-semibold text-lg">
              Out of Stock ❌
            </p>
          )}

          {lowStock && (
            <p className="text-orange-600 font-semibold text-lg">
              Only {product.stock} left in stock 🔥
            </p>
          )}

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* QUANTITY */}
          <div>
            <p className="font-semibold mb-2">Quantity</p>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) =>
                setQty(Math.min(product.stock, Math.max(1, e.target.value)))
              }
              className="border px-4 py-3 w-28 rounded-lg"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">

            <button
              disabled={isOutOfStock}
              onClick={addToCart}
              className={`px-10 py-4 font-bold tracking-wide transition rounded-lg
                ${isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"}
              `}
            >
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>

            <button
              onClick={addToWishlist}
              className="border border-black px-8 py-4 rounded-lg hover:bg-black hover:text-white transition"
            >
              ♡ WISHLIST
            </button>

          </div>

          {/* TRUST BADGES */}
          <div className="border-t pt-6 mt-6 text-sm text-gray-600 space-y-2">
            <p>✔ 100% Original Product</p>
            <p>✔ Free Delivery & Easy Returns</p>
            <p>✔ Secure Payments</p>
          </div>

        </div>
      </div>
    </div>
  );
}