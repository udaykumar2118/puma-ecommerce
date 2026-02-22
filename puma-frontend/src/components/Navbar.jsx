import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  // ⭐ JWT BASED LOGIN CHECK
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");   // ⭐ FIXED
  const isLoggedIn = !!token;

  // ================= CART COUNT (JWT) =================
  const loadCartCount = () => {
    if (!token) return;

    api.get("/api/cart/my", {   // ⭐ FIXED URL
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCartCount(res.data?.items?.length || 0))
      .catch(() => setCartCount(0));
  };

  // ================= WISHLIST COUNT (JWT) =================
  const loadWishlistCount = () => {
    if (!token) return;

    api.get("/api/wishlist/my", {   // ⭐ FIXED URL
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setWishlistCount(res.data.length || 0))
      .catch(() => setWishlistCount(0));
  };

  // ================= EFFECT =================
  useEffect(() => {
    loadCartCount();
    loadWishlistCount();

    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("wishlistUpdated", loadWishlistCount);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("wishlistUpdated", loadWishlistCount);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= REQUIRE LOGIN =================
  const requireLogin = (path) => {
    if (!isLoggedIn) return navigate("/login");
    navigate(path);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));
    navigate("/");
  };

  return (
    <>
      <div className="bg-white text-black text-center text-xs py-2 font-semibold tracking-wide">
        FREE SHIPPING ABOVE ₹999 • EASY RETURNS
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-500
        ${scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-black"}
        text-white px-6 lg:px-12 py-4 flex justify-between items-center`}>

        {/* LOGO */}
        <Link to="/" className="text-3xl font-extrabold tracking-widest hover:opacity-80">
          Sneaky
        </Link>

        {/* MENU */}
        <ul className="hidden lg:flex gap-10 text-sm font-semibold tracking-wider">
          {["men","women","kids"].map(cat => (
            <li key={cat}
              onClick={() => navigate(`/category/${cat}`)}
              className="cursor-pointer relative group">
              {cat.toUpperCase()}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"/>
            </li>
          ))}
          <li onClick={() => navigate("/sale")}
              className="cursor-pointer text-red-500 relative group">
            SALE
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all duration-300"/>
          </li>
        </ul>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-8">

          {/* WISHLIST */}
          <button onClick={()=>requireLogin("/wishlist")} className="relative hover:scale-110 transition">
            <span className="text-2xl">♡</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART */}
          <button onClick={()=>requireLogin("/cart")} className="relative hover:scale-110 transition">
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* ACCOUNT DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setProfileOpen(!profileOpen)} className="text-left leading-tight hover:opacity-80">
              {!isLoggedIn ? (
                <>
                  <p className="text-xs">Hello, Sign in</p>
                  <p className="font-bold text-sm">Account & Lists</p>
                </>
              ) : (
                <>
                  <p className="text-xs">Hello, {userName}</p>
                  <p className="font-bold text-sm">Account & Lists</p>
                </>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-white text-black rounded-xl shadow-xl p-4 space-y-3">

                {!isLoggedIn && (
                  <button
                    onClick={()=>navigate("/login")}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Sign In
                  </button>
                )}

                {isLoggedIn && (
                  <>
                    <p onClick={()=>navigate("/orders")} className="cursor-pointer hover:text-gray-500">
                      My Orders
                    </p>

                    <hr/>

                    <p onClick={logout} className="cursor-pointer text-red-500">
                      Logout
                    </p>
                  </>
                )}

              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}
