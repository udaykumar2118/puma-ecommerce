import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ⭐ STOCK STATES
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const onSale = product.price <= 6000; // same logic used in SALE page

  // ❤️ ADD TO WISHLIST (FIXED API + TOKEN)
  const addToWishlist = async (e) => {
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

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

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="
        relative border p-4 rounded-xl cursor-pointer bg-white
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 active:scale-95
      "
    >

      {/* ❤️ Wishlist */}
      <button
        onClick={addToWishlist}
        className="absolute top-3 right-3 text-xl hover:scale-125 transition"
      >
        ♡
      </button>

      {/* ⭐ SALE BADGE */}
      {onSale && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
          SALE
        </span>
      )}

      {/* ⭐ OUT OF STOCK BADGE */}
      {outOfStock && (
        <span className="absolute bottom-20 left-3 bg-black text-white text-xs px-2 py-1 rounded">
          OUT OF STOCK
        </span>
      )}

      {/* ⭐ LOW STOCK BADGE */}
      {lowStock && !outOfStock && (
        <span className="absolute bottom-20 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          Only {product.stock} left 🔥
        </span>
      )}

      {/* IMAGE */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-52 object-contain mb-3"
      />

      {/* NAME */}
      <h3 className="font-semibold line-clamp-2 min-h-[48px]">
        {product.name}
      </h3>

      {/* PRICE */}
      <p className="text-xl font-bold mt-2">₹{product.price}</p>

      {/* ⭐ QUICK VIEW BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/product/${product.id}`);
        }}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        View Product
      </button>

    </div>
  );
}