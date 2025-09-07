import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Gift, Shirt, Hoodie, Package, Wand2 } from "lucide-react";

const BRAND_GREEN = "#9AC72C";
const BRAND_GREY = "#71797E";

const CATEGORIES = [
  { id: "tshirt", label: "T‑Shirt", icon: Shirt },
  { id: "sleeve", label: "Sleeve Top", icon: Package },
  { id: "hoodie", label: "Hoodie", icon: Hoodie },
  { id: "ziphoodie", label: "Zip Hoodie", icon: Hoodie },
  { id: "custom", label: "Custom Gift", icon: Gift },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

type Variant = { label: string; sku: string; priceUSD?: number };

type Product = {
  id: string;
  title: string;
  priceTRY?: number;
  priceUSD?: number;
  image: string;
  category: CategoryId;
  badges?: string[];
  sizes?: Array<"XS"|"S"|"M"|"L"|"XL"|"XXL">;
  colors?: string[];
  variants?: Variant[];
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Skateboard Wizard",
    priceTRY: 1400,
    priceUSD: 30,
    image: "/skateboard-wizard.jpg", // replace with your image
    category: "sleeve",
    badges: ["Limited"],
    sizes: ["XS","S","M","L","XL"],
    colors: ["Black","DarkGreyHeather"],
  },
  {
    id: "p2",
    title: "Vision Premium",
    priceTRY: 1100,
    priceUSD: 25,
    image: "/vision-premium.jpg", // replace with your image
    category: "tshirt",
    badges: ["Limited"],
    sizes: ["S","M","L","XL"],
    colors: ["Black"],
  },
  {
    id: "p3",
    title: "Psychodelic Woven Blanket – Tapestry",
    image: "/blanket.jpg", // replace
    category: "custom",
    variants: [
      { label: "52×37", sku: "WovenBlanket_52x37-20250605220322355", priceUSD: 65 },
      { label: "52×37 (Photo)", sku: "WovenBlanket_52x37_Photo-20250605220322355", priceUSD: 75 },
      { label: "50×60", sku: "WovenBlanket_50x60-20250605220322355", priceUSD: 85 },
      { label: "50×60 (Photo)", sku: "WovenBlanket_50x60_Photo-20250605220322355", priceUSD: 95 },
      { label: "60×80", sku: "WovenBlanket_60x80-20250605220322355", priceUSD: 95 },
      { label: "60×80 (Photo)", sku: "WovenBlanket_60x80_Photo-20250605220322355", priceUSD: 95 }
    ],
  },
  {
    id: "p4",
    title: "Cubic Canvas Portraits",
    image: "/canvas.jpg", // replace
    category: "custom",
    variants: [
      { label: "8×10 Black Wrap (Thick)", sku: "CanvsWrp-BlkWrp-8x10-Thick-20250611174155878", priceUSD: 40 },
      { label: "8×10 White Wrap (Thick)", sku: "CanvsWrp-WhtWrp-8x10-Thick-20250611174155878", priceUSD: 50 },
      { label: "8×10 Image Wrap (Thick)", sku: "CanvsWrp-ImgWrp-8x10-Thick-20250611174155878", priceUSD: 60 },
      { label: "16×20 Black Wrap (Thick)", sku: "CanvsWrp-BlkWrp-16x20-Thick-20250611174155878", priceUSD: 70 },
      { label: "16×20 White Wrap (Thick)", sku: "CanvsWrp-WhtWrp-16x20-Thick-20250611174155878", priceUSD: 70 }
    ],
  }
];

const GOOTEN_SKUS: Record<string, Record<string, string>> = {
  p1: {
    "Black-XS": "Apparel-DTG-LongSleeveTee-Bella-3501-XS-Black-Unisex-CB-20250906223312834",
    "Black-S":  "Apparel-DTG-LongSleeveTee-Bella-3501-S-Black-Unisex-CB-20250906223312834",
    "Black-M":  "Apparel-DTG-LongSleeveTee-Bella-3501-M-Black-Unisex-CB-20250906223312834",
    "Black-L":  "Apparel-DTG-LongSleeveTee-Bella-3501-L-Black-Unisex-CB-20250906223312834",
    "Black-XL": "Apparel-DTG-LongSleeveTee-Bella-3501-XL-Black-Unisex-CB-20250906223312834",
    "DarkGreyHeather-XS": "Apparel-DTG-LongSleeveTee-Bella-3501-XS-DarkGreyHeather-Unisex-CB-20250906223312834",
    "DarkGreyHeather-S":  "Apparel-DTG-LongSleeveTee-Bella-3501-S-DarkGreyHeather-Unisex-CB-20250906223312834",
    "DarkGreyHeather-M":  "Apparel-DTG-LongSleeveTee-Bella-3501-M-DarkGreyHeather-Unisex-CB-20250906223312834",
    "DarkGreyHeather-L":  "Apparel-DTG-LongSleeveTee-Bella-3501-L-DarkGreyHeather-Unisex-CB-20250906223312834",
    "DarkGreyHeather-XL": "Apparel-DTG-LongSleeveTee-Bella-3501-XL-DarkGreyHeather-Unisex-CB-20250906223312834"
  },
  p2: {
    "Black-S":  "Apparel-DTG-Tshirt-CC-1717-S-Black-Unisex-CB-20250906210544442",
    "Black-M":  "Apparel-DTG-Tshirt-CC-1717-M-Black-Unisex-CB-20250906210544442",
    "Black-L":  "Apparel-DTG-Tshirt-CC-1717-L-Black-Unisex-CB-20250906210544442",
    "Black-XL": "Apparel-DTG-Tshirt-CC-1717-XL-Black-Unisex-CB-20250906210544442"
  }
};

const tl = (v?: number) => (v != null ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(v) : null);
const usd = (v?: number) => (v != null ? `$${v.toFixed(2)}` : null);

const Nav: React.FC = () => (
  <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,.9)", borderBottom: "1px solid #eee", backdropFilter: "blur(6px)" }}>
    <div className="container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: BRAND_GREEN }}>
        <img src="/vision.png" alt="Vision Logo" style={{ height: 32 }} />
        Vision
      </a>
      <nav style={{ display: "none" }} />
      <button className="btn">Sepet</button>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}22, white, ${BRAND_GREY}22)` }}>
    <div className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: 42, fontWeight: 900, color: BRAND_GREEN }}>
          Vision
        </motion.h1>
        <p style={{ color: "#333", maxWidth: 640, marginTop: 12 }}>TR ve Avrupa için limitli koleksiyon: T‑Shirt, Sleeve Hoodie, Tapestry ve Canvas. Beden seçenekleri XS–XXL. Kargo: TR 1–3 iş günü, EU 3–7 iş günü.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <a href="#shop" className="btn btn-primary">Ürünleri Gör</a>
          <a href="#custom" className="btn btn-ghost" style={{ textDecoration: "none" }}>Custom Gift Başlat</a>
        </div>
      </div>
    </div>
  </section>
);

function CheckoutButton({ sku, payload }: { sku?: string; payload: any }) {
  const disabled = !sku;
  const handleClick = async () => {
    const body = { ...payload, sku };
    try {
      const res = await fetch('/api/gooten/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        if (data?.paymentUrl) window.location.href = data.paymentUrl; else alert('Sipariş alındı, e‑posta ile onay gönderilecek.');
      } else {
        window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(JSON.stringify(body, null, 2))}`;
      }
    } catch {
      window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(JSON.stringify(body, null, 2))}`;
    }
  };
  return (
    <button onClick={handleClick} disabled={disabled} className="btn btn-primary" style={{ 
