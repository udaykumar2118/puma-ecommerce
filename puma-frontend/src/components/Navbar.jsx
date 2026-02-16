import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  // ================= JWT CHECK =================
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");

  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  const isLoggedIn = token && !isTokenExpired();

  // ================= CART COUNT =================
  const loadCartCount = () => {
    if (!isLoggedIn) return;

    api.get("/api/cart/my")
      .then(res => setCartCount(res.data?.items?.length || 0))
      .catch(() => setCartCount(0));
  };

  // ================= WISHLIST COUNT =================
  const loadWishlistCount = () => {
    if (!isLoggedIn) return;

    api.get("/api/wishlist/my")
      .then(res => setWishlistCount(res.data.length || 0))
      .catch(() => setWishlistCount(0));
  };

  // ================= EFFECT =================
  useEffect(() => {

    // 🔥 Auto logout if token expired
    if (token && isTokenExpired()) {
      logout();
      return;
    }

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
    if (!isLoggedIn) {
      alert("Please login first 🔐");
      return navigate("/login");
    }
    navigate(path);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    setWishlistCount(0);
    navigate("/login");
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
        <Link to="/" className="text-3xl font-extrabold tracking-widest">
          PUMA
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
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-8">

          {/* ⭐ SHOW ONLY IF LOGGED IN */}
          {isLoggedIn && (
            <>
              {/* WISHLIST */}
              <button onClick={()=>requireLogin("/wishlist")} className="relative">
                <span className="text-2xl">♡</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* CART */}
              <button onClick={()=>requireLogin("/cart")} className="relative">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* ACCOUNT */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setProfileOpen(!profileOpen)}>
              {!isLoggedIn ? "Login" : `Hi, ${userName}`}
            </button>

            {profileOpen && isLoggedIn && (
              <div className="absolute right-0 mt-4 w-40 bg-white text-black rounded-xl shadow-xl p-4">
                <p onClick={logout} className="cursor-pointer text-red-500">
                  Logout
                </p>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}