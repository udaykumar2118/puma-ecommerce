import { useEffect, useRef, useState } from "react";
import api from "../services/api";

export default function TopPicksSlider() {

  const [products, setProducts] = useState([]);
  const sliderRef = useRef();

  useEffect(() => {
    api.get("/api/products")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const scroll = (dir) => {
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth"
    });
  };

  const addToCart = async (productId) => {
  const token = localStorage.getItem("token");
  if(!token){
    alert("Login first");
    return;
  }

  await api.post(`/api/cart/add?productId=1&quantity=1`);
  window.dispatchEvent(new Event("cartUpdated"));
  alert("Added to cart 🛒");
};


  return (
    <section className="px-6 md:px-12 py-16 bg-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Top Picks of the Week</h2>

        <div className="flex gap-4">
          <button onClick={()=>scroll("left")} className="text-2xl">←</button>
          <button onClick={()=>scroll("right")} className="text-2xl">→</button>
        </div>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {products.map(p => (
          <div
            key={p.id}
            className="min-w-[240px] bg-white border rounded-xl overflow-hidden group hover:shadow-xl transition"
          >

            {/* IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-64 w-full object-cover group-hover:scale-110 transition duration-700"
              />

              {/* QUICK ACTIONS */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={()=>addToCart(p.id)}
                  className="w-full bg-white text-black py-2 font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* INFO */}
            <div className="p-4">
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-500 text-sm">{p.brand}</p>
              <p className="font-bold mt-2">₹{p.price}</p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
