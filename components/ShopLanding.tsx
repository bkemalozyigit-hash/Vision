import React from "react";
import { motion } from "framer-motion";

const BRAND_GREEN = "#9AC72C";
const BRAND_GREY = "#71797E";

const Nav: React.FC = () => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(245,247,250,.92)", // daha gri
      borderBottom: "1px solid #e6e8eb",
      backdropFilter: "blur(8px)",
    }}
  >
    <div
      className="container"
      style={{
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <a
        href="#"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 800,
          color: BRAND_GREEN,
        }}
      >
        <img
          src="/vision.png"
          alt="Vision Logo"
          style={{ height: 48, objectFit: "contain" }}
        />
        <span style={{ fontSize: 20, lineHeight: 1 }}>Vision</span>
      </a>
      <button className="btn">Sepet</button>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="hero" style={{ background: "linear-gradient(135deg, #f3f4f6 0%, #ffffff 40%, #eef1f4 100%)" }}>
    {/* ... */}
  </section>
);
  >
    {/* Arka plan watermark */}
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          letterSpacing: -1,
          fontSize: "clamp(64px, 12vw, 220px)",
          color: BRAND_GREY,
          opacity: 0.08,
          transform: "rotate(-8deg) translateY(-6%)",
          userSelect: "none",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        #stayonvision
      </div>
    </div>

    <div
      className="container"
      style={{ padding: "72px 0", display: "grid", gap: 24 }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 56, fontWeight: 900, color: BRAND_GREEN }}
        >
          Vision
        </motion.h1>
        <p style={{ color: "#2a2f33", maxWidth: 720, marginTop: 12 }}>
          TR ve Avrupa için limitli koleksiyon: T-Shirt, Sleeve Hoodie, Tapestry
          ve Canvas. Beden seçenekleri XS–XXL. Kargo: TR 1–3 iş günü, EU 3–7 iş
          günü.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <a href="#shop" className="btn btn-primary">
            Ürünleri Gör
          </a>
          <a
            href="#custom"
            className="btn btn-ghost"
            style={{ textDecoration: "none" }}
          >
            Custom Gift Başlat
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default function ShopLanding() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  );
}
