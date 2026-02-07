import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // ⭐ JWT
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // ================= LOAD WISHLIST =================
  const loadWishlist = () => {
    if (!token) return;

    api.get("/api/wishlist/my", authHeader)   // ⭐ FIXED URL + TOKEN
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // ❤️ REMOVE ITEM
  const removeItem = async (productId) => {
    await api.delete(`/api/wishlist/remove?productId=${productId}`, authHeader);

    loadWishlist();
    window.dispatchEvent(new Event("wishlistUpdated")); // update navbar
  };

  // 🛒 ADD TO CART FROM WISHLIST
  const addToCart = async (productId) => {
    try {
      await api.post(
        `/api/cart/add?productId=${productId}&quantity=1`,
        {},
        authHeader
      );

      window.dispatchEvent(new Event("cartUpdated")); // navbar cart count

      // remove from wishlist after adding to cart
      await api.delete(`/api/wishlist/remove?productId=${productId}`, authHeader);

      loadWishlist();
      alert("Added to cart 🛒");
      navigate("/cart");

    } catch (err) {
      console.error(err);
      alert("Cart error");
    }
  };

  // ================= LOGIN CHECK =================
  if (!token)
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold">Login to view wishlist</h1>
        <button
          onClick={()=>navigate("/login")}
          className="bg-black text-white px-6 py-3"
        >
          LOGIN
        </button>
      </div>
    );

  // ================= EMPTY =================
  if (items.length === 0)
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-6">
        <h1 className="text-4xl font-bold">Your Wishlist is Empty 💔</h1>
        <button
          onClick={()=>navigate("/")}
          className="bg-black text-white px-8 py-3 font-semibold"
        >
          START SHOPPING
        </button>
      </div>
    );

  // ================= UI (UNCHANGED) =================
  return (
    <div className="bg-gray-100 min-h-screen px-6 md:px-16 py-14">

      <h1 className="text-4xl font-bold mb-10 tracking-wider">
        MY WISHLIST
      </h1>

      <div className="space-y-6">
        {items.map(w => (
          <div
            key={w.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-2xl transition"
          >
            <img
              src={w.product.imageUrl}
              alt={w.product.name}
              className="w-32 h-32 object-contain bg-gray-100 p-4 rounded-xl"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold">{w.product.name}</h2>
              <p className="text-gray-500">PUMA</p>
              <p className="text-2xl font-bold mt-2">₹{w.product.price}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addToCart(w.product.id)}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeItem(w.product.id)}
                className="border px-6 py-3 rounded-xl hover:bg-gray-100"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
