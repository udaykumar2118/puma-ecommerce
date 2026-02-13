import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import api from "../services/api";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // ================= LOGIN =================
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const { token, role, name, email: userEmail, userId } = res.data;

      // allow only admin
      if (role !== "ADMIN") {
        setError("Access denied. Admins only.");
        return;
      }

      // ⭐ STORE ADMIN SESSION
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("adminEmail", userEmail);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("userId", userId);

      navigate("/admin");

    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid admin credentials";
      setError(errorMessage);
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
          "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1170&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="admin-card" ref={cardRef}>
        
        {/* LEFT SIDE */}
        <div className="admin-left" ref={leftRef}>
          <h1>PUMA Admin Portal</h1>
          <p>
            Manage products, orders, users, and revenue analytics from a single
            powerful dashboard.
          </p>

          <span className="badge">Secure • Private • Authorized</span>

          <div className="features">
            <p>✔ Product Management</p>
            <p>✔ Order Tracking</p>
            <p>✔ Revenue Analytics</p>
            <p>✔ Customer Insights</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="admin-right" ref={rightRef}>
          <h2>Admin Sign in</h2>

          {error && <div className="error">{error}</div>}

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            Sign in to Dashboard
          </button>

          <p className="secure-note">🔒 Authorized personnel only</p>
        </div>

      </div>
    </div>
  );
}
