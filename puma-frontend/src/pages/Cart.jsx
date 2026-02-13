import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const navigate = useNavigate();
  const [cart, setCart] = useState(null);

  
  // ================= LOAD CART =================
  const loadCart = () => {
    if (!token) return;

    api.get("/api/cart/my", authHeader)
      .then(res => setCart(res.data))
      .catch(() => setCart({ items: [], totalAmount: 0 }));
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= CART ACTIONS =================
  const increaseQty = async (id) => {
    await api.put(`/api/cart/${id}/increase`, {}, authHeader);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQty = async (id) => {
    await api.put(`/api/cart/${id}/decrease`, {}, authHeader);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = async (id) => {
    await api.delete(`/api/cart/${id}`, authHeader);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!token)
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center">
        <h1 className="text-3xl font-bold">Login to view cart 🛒</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-3 rounded"
        >
          LOGIN
        </button>
      </div>
    );

  if (!cart)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading cart...
      </div>
    );

  if (cart.items.length === 0)
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center">
        <h1 className="text-3xl font-bold">Your cart is empty 🛒</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-8 py-3"
        >
          START SHOPPING
        </button>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen py-14 px-6 md:px-16">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-6">
          {cart.items.map(item => {
            const p = item.product;
            const image = p.imageUrl || p.image_url;

            return (
              <div key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center">

                <div className="bg-gray-100 p-4 rounded-xl">
                  <img src={image} alt={p.name}
                    className="w-32 h-32 object-contain"/>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="text-2xl font-bold mt-2">₹{p.price}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => decreaseQty(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>

                    <button onClick={() => removeItem(item.id)}
                      className="text-red-500">Remove</button>
                  </div>
                </div>

                <div className="text-2xl font-bold">
                  ₹{p.price * item.quantity}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 h-fit">
          <h2 className="text-2xl font-bold mb-6">Total ₹{cart.totalAmount}</h2>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-4 rounded-xl">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
