import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const onSale = product.price <= 6000;

  // ❤️ WISHLIST
  const addToWishlist = async (e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");

    try {
      await api.post(
        `/api/wishlist/add?productId=${product.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.dispatchEvent(new Event("wishlistUpdated"));
      alert("Added to wishlist ❤️");
    } catch {
      alert("Already in wishlist");
    }
  };

  // 🛒 QUICK ADD TO CART
  const quickAdd = async (e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");

    await api.post(
      `/api/cart/add?productId=${product.id}&quantity=1`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added to cart 🛒");
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="
        group relative bg-white rounded-2xl p-5 cursor-pointer
        transition-all duration-500
        hover:shadow-2xl hover:-translate-y-2
      "
    >
      {/* ❤️ Wishlist */}
      <button
        onClick={addToWishlist}
        className="absolute top-4 right-4 text-xl opacity-70 hover:opacity-100 hover:scale-125 transition"
      >
        ♡
      </button>

      {/* BADGES */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        {onSale && (
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            SALE
          </span>
        )}

        {outOfStock && (
          <span className="bg-black text-white text-xs px-2 py-1 rounded">
            OUT OF STOCK
          </span>
        )}

        {lowStock && !outOfStock && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* IMAGE */}
      <div className="h-56 flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="
            h-52 object-contain transition duration-700
            group-hover:scale-110
          "
        />
      </div>

      {/* INFO */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {product.brand || "PUMA"}
        </p>

        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        <p className="text-2xl font-bold mt-2">₹{product.price}</p>
      </div>

      {/* HOVER ACTION BAR */}
      <div className="
        absolute bottom-0 left-0 right-0 p-4
        opacity-0 translate-y-6
        group-hover:opacity-100 group-hover:translate-y-0
        transition duration-400
      ">
        <button
          onClick={quickAdd}
          disabled={outOfStock}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${outOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"}
          `}
        >
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}