import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "../admin/AdminLogin.css";

export default function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");

  const navigate = useNavigate();

  // GSAP refs
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // ================= REGISTER =================
  const handleRegister = async () => {
  try {
    const res = await API.post("/api/auth/register", formData);

    // ⭐ SAVE TOKEN
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name);

    alert("Register success");
  } catch (err) {
    alert("Register failed");
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
          "url('https://plus.unsplash.com/premium_photo-1678193922619-061ac9a09697?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="admin-card" ref={cardRef}>

        {/* LEFT SIDE */}
        <div className="admin-left" ref={leftRef}>
          <h1>Join PUMA</h1>
          <p>
            Create your account and enjoy faster checkout,
            order tracking and exclusive member deals.
          </p>

          <span className="badge">Fast • Secure • Free</span>

          <div className="features">
            <p>✔ Easy Checkout</p>
            <p>✔ Track Orders</p>
            <p>✔ Save Wishlist</p>
            <p>✔ Exclusive Offers</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="admin-right" ref={rightRef}>
          <h2>Create Account</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Create Account
            </button>
          </form>

          <p className="secure-note">
            Already have an account?
            <span
              style={{cursor:"pointer",marginLeft:5}}
              onClick={()=>navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
