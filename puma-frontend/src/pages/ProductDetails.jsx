import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD PRODUCT
  useEffect(() => {
    api.get(`/api/products/${id}`)   // ⭐ FIXED
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Product not found");
        navigate("/");
      });
  }, [id]);

  // ================= ADD TO CART =================
  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        `/api/cart/add?productId=${id}&quantity=${qty}`,  // ⭐ FIXED
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("cartUpdated"));
      alert("Added to cart 🛒");

    } catch (err) {
      console.error(err);
      alert("Cart error! ⚠️");
    }
  };

  // ================= ADD TO WISHLIST =================
  const addToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        `/api/wishlist/add?productId=${id}`,   // ⭐ FIXED
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to wishlist ❤️");

    } catch {
      alert("Already in wishlist ❤️");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 md:px-20 py-12">

      <div className="bg-gray-100 p-10 rounded-xl shadow">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-[420px] object-contain hover:scale-105 transition"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
        <p className="text-3xl font-semibold mb-4">₹{product.price}</p>

        <p className="text-gray-600 mb-8">{product.description}</p>

        <div className="flex items-center gap-4 mb-8">
          <span className="font-semibold text-lg">Quantity</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="border px-4 py-2 w-24 rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={addToCart}
            className="bg-black text-white px-10 py-4 font-semibold hover:bg-gray-800"
          >
            ADD TO CART
          </button>

          <button
            onClick={addToWishlist}
            className="border border-black px-8 py-4 hover:bg-black hover:text-white"
          >
            ♡ WISHLIST
          </button>
        </div>
      </div>
    </div>
  );
}
