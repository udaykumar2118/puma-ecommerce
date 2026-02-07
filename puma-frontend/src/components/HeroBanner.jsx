import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="w-full grid md:grid-cols-2">

      {/* ================= MEN ================= */}
      <div
        onClick={() => navigate("/category/men")}
        className="relative h-[420px] md:h-[560px] cursor-pointer overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&auto=format&fit=crop&q=60"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-[1200ms]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"/>

        {/* TEXT */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 text-white">
          <p className="tracking-[6px] text-sm mb-3 opacity-80">NEW ARRIVALS</p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            MEN COLLECTION
          </h1>

          <p className="max-w-md mb-6 text-gray-200">
            Performance & street style engineered for speed and comfort.
          </p>

          <button
            onClick={(e)=>{
              e.stopPropagation();
              navigate("/category/men");
            }}
            className="bg-white text-black w-fit px-8 py-3 font-bold tracking-wider hover:bg-gray-200 transition active:scale-95"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* ================= WOMEN ================= */}
      <div
        onClick={() => navigate("/category/women")}
        className="relative h-[420px] md:h-[560px] cursor-pointer overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=60"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-[1200ms]"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"/>

        {/* TEXT */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 text-white">
          <p className="tracking-[6px] text-sm mb-3 opacity-80">TRENDING NOW</p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            WOMEN COLLECTION
          </h1>

          <p className="max-w-md mb-6 text-gray-200">
            Bold designs built to move with confidence and style.
          </p>

          <button
            onClick={(e)=>{
              e.stopPropagation();
              navigate("/category/women");
            }}
            className="bg-white text-black w-fit px-8 py-3 font-bold tracking-wider hover:bg-gray-200 transition active:scale-95"
          >
            SHOP NOW
          </button>
        </div>
      </div>

    </section>
  );
}
