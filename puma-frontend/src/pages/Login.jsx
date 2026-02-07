import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../services/api";
import "../admin/AdminLogin.css";

export default function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  // GSAP refs
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // ================= USER LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });

      // ⭐ SAVE USER DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      alert("Login successful 🎉");

      navigate("/"); // go home

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      alert("Login failed");
    }
  };

  // ================= GSAP ANIMATION =================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(leftRef.current, { x: -80, opacity: 0 });
      gsap.set(rightRef.current, { x: 80, opacity: 0 });
      gsap.set(".admin-right input", { y: 20, opacity: 0 });
      gsap.set(".admin-right button", { y: 20, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(cardRef.current, { opacity: 1, scale: 1, duration: 0.8 })
        .to(leftRef.current, { x: 0, opacity: 1, duration: 0.8 }, "-=0.5")
        .to(rightRef.current, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to(".admin-right input", { y: 0, opacity: 1, stagger: 0.12 }, "-=0.4")
        .to(".admin-right button", { y: 0, opacity: 1 }, "-=0.3");
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="admin-wrapper"
      ref={wrapperRef}
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1677995700941-100976883af7?w=1000&auto=format&fit=crop&q=60')",
        backgroundSize:"cover",
        backgroundPosition:"center"
      }}
    >
      <div className="admin-card" ref={cardRef}>

        {/* LEFT SIDE */}
        <div className="admin-left" ref={leftRef}>
          <h1>PUMA</h1>
          <p>
            Discover the latest collections, track your orders
            and enjoy a seamless shopping experience.
          </p>

          <span className="badge">Fast • Secure • Premium</span>

          <div className="features">
            <p>✔ Easy checkout</p>
            <p>✔ Track your orders</p>
            <p>✔ Wishlist & Cart sync</p>
            <p>✔ Exclusive member offers</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="admin-right" ref={rightRef}>
          <h2>User Sign in</h2>

          {error && <div className="error">{error}</div>}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            Sign in to Shop
          </button>

          <p
            className="secure-note"
            style={{cursor:"pointer"}}
            onClick={()=>navigate("/register")}
          >
            Create new account →
          </p>
        </div>

      </div>
    </div>
  );
}
