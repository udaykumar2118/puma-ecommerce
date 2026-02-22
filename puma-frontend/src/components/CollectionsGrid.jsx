import { useNavigate } from "react-router-dom";

export default function CollectionsGrid() {
  const navigate = useNavigate();

  const collections = [
    {
      title: "SPEEDCAT",
      subtitle: "Motorsport inspired classics",
      route: "/category/men",
      image:
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1600&auto=format&fit=crop&q=60",
    },
    {
      title: "CUTTING EDGE PERFORMANCE",
      subtitle: "Engineered for speed & comfort",
      route: "/category/sneakers",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&auto=format&fit=crop&q=60",
    },
    {
      title: "DISCOVER THE LATEST",
      subtitle: "Fresh drops just landed",
      route: "/category/women",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop&q=60",
    },
{
  title: "LUCKY SIZES",
  subtitle: "Limited stock available",
  route: "/sale",
  image:
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&auto=format&fit=crop&q=60",
}

  ];

  return (
    <section className="mt-5">

      {/* TITLE */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold tracking-widest">
          TRENDING COLLECTIONS
        </h2>
        <p className="text-gray-500 mt-2">Discover the latest Sneaky drops</p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6 px-6 md:px-12">

        {collections.map((c, i) => (
          <div
            key={i}
            onClick={() => navigate(c.route)}
            className="group relative h-[420px] cursor-pointer overflow-hidden rounded-2xl"
          >

            {/* IMAGE */}
            <img
              src={c.image}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition"/>

            {/* TEXT */}
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-bold mb-2 tracking-wide">
                {c.title}
              </h3>
              <p className="mb-4 text-sm">{c.subtitle}</p>

              <button className="bg-white text-black px-6 py-2 font-semibold group-hover:bg-black group-hover:text-white transition">
                SHOP NOW →
              </button>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}
