import { useNavigate } from "react-router-dom";

export default function RoundCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      label: "MEN",
      route: "/category/men",
      image: "https://images.puma.com/image/upload/f_auto,q_auto/global/377028/01/sv01/fnd/IND",
    },
    {
      label: "WOMEN",
      route: "/category/women",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=60",
    },
    {
      label: "SNEAKERS",
      route: "/category/sneakers",
      image: "https://images.puma.com/image/upload/f_auto,q_auto/global/389289/01/sv01/fnd/IND",
    },
    {
      label: "SPORTS",
      route: "/category/men",
      image: "https://images.puma.com/image/upload/f_auto,q_auto/global/379271/01/sv01/fnd/IND",
    },
    {
      label: "KIDS",
      route: "/category/kids",
      image: "https://images.puma.com/image/upload/f_auto,q_auto/global/380822/01/sv01/fnd/IND",
    },
    {
      label: "WINTER",
      route: "/category/men",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=60"
,
    },
  ];

  // 🔥 fallback if puma image fails
  const fallback =
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=60";

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white py-10">

      {/* HEADER */}
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold tracking-widest">
          SHOP BY CATEGORY
        </h2>
        <p className="text-gray-500 mt-2">
          Discover your style
        </p>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto flex justify-center gap-12 flex-wrap">

        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(cat.route)}
            className="text-center cursor-pointer group"
          >

            {/* IMAGE */}
            <div className="
              mx-auto
              w-32 h-32 md:w-40 md:h-40
              rounded-full overflow-hidden
              border border-gray-200
              shadow-md
              transition duration-500
              group-hover:scale-110 group-hover:shadow-2xl
            ">
              <img
                src={cat.image}
                onError={(e)=> e.target.src = fallback}
                alt={cat.label}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-125"
              />
            </div>

            {/* LABEL */}
            <p className="mt-5 font-semibold tracking-widest text-sm group-hover:text-red-500 transition">
              {cat.label}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
}
