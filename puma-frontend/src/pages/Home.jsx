import HeroBanner from "../components/HeroBanner";
import RoundCategories from "../components/RoundCategories";
import PromoBanners from "../components/PromoBanners";
import CollectionsGrid from "../components/CollectionsGrid";
import TopPicksSlider from "../components/TopPicksSlider";

export default function Home() {
  return (
    <div>

      {/* 1️⃣ SHOP BY CATEGORY */}
      <RoundCategories />

      {/* 2️⃣ HERO BANNER */}
      <HeroBanner />

      {/* 3️⃣ PROMO CAMPAIGN BANNERS */}
      <PromoBanners />

      {/* 4️⃣ PRODUCT SLIDER (Backend data) */}
      <TopPicksSlider />

      {/* 5️⃣ COLLECTION GRID */}
      <CollectionsGrid />

    </div>
  );
}
