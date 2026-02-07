import { useNavigate } from "react-router-dom";

export default function PromoBanners() {
  const navigate = useNavigate();

  const promos = [
    {
      title: "PUMA x McLAREN",
      subtitle: "Inspired by Speed • Built for Performance",
      route: "/category/men",
      image:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80",
    },
    {
      title: "RUNNING COLLECTION",
      subtitle: "Engineered for Athletes",
      route: "/category/women",
      image:
        "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1600&auto=format&fit=crop&q=80",
    },
    {
      title: "TRAIN HARD",
      subtitle: "Gym • Training • Lifestyle",
      route: "/category/men",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1600&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">

        {/* SECTION TITLE */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wider">
            FEATURED CAMPAIGNS
          </h2>
          <p className="text-gray-500 text-sm">New Drops 🔥</p>
        </div>

        {/* BANNERS */}
        <div className="space-y-10">
          {promos.map((p, i) => (
            <div
              key={i}
              onClick={() => navigate(p.route)}
              className="relative h-[320px] md:h-[420px] overflow-hidden rounded-3xl cursor-pointer group"
            >
              {/* IMAGE */}
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition duration-[1200ms] group-hover:scale-110"
              />

              {/* DARK GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* GLASS CONTENT */}
              <div className="absolute inset-0 flex items-center">
                <div className="ml-10 md:ml-16 text-white max-w-xl backdrop-blur-sm">
                  <h3 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-wide">
                    {p.title}
                  </h3>
                  <p className="text-sm md:text-lg mb-6 text-gray-200">
                    {p.subtitle}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(p.route);
                    }}
                    className="
                      bg-white text-black 
                      px-8 py-3 rounded-full 
                      font-semibold tracking-wide
                      hover:bg-gray-200 transition
                    "
                  >
                    SHOP NOW →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
