import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToWishlist = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/wishlist/add?productId=${product.id}`);
      window.dispatchEvent(new Event("wishlistUpdated"));
      alert("Added to wishlist ❤️");
    } catch {
      alert("Already in wishlist");
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="border p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 bg-white"
    >
      <button onClick={addToWishlist} className="absolute top-2 right-2 text-xl">
        ♡
      </button>

      <img src={product.imageUrl} alt={product.name} className="w-full h-52 object-contain" />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-lg font-bold">₹{product.price}</p>
    </div>
  );
}
