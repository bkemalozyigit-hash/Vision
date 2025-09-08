import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Gift, Shirt, Hoodie, Package } from "lucide-react";

const BRAND_GREEN = "#9AC72C";
const BRAND_GREY = "#71797E";

type Category = { id: CategoryId; label: string; icon: any };
const CATEGORIES: Category[] = [
  { id: "tshirt", label: "T-Shirt", icon: Shirt },
  { id: "sleeve", label: "Sleeve Top", icon: Package },
  { id: "hoodie", label: "Hoodie", icon: Hoodie },
  { id: "ziphoodie", label: "Zip Hoodie", icon: Hoodie },
  { id: "custom", label: "Custom Gift", icon: Gift },
];
type CategoryId = "tshirt" | "sleeve" | "hoodie" | "ziphoodie" | "custom";

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
    image: "/Sleeve.jpeg",
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
    image: "/Tee.jpeg",
    category: "tshirt",
    badges: ["Limited"],
    sizes: ["S","M","L","XL"],
    colors: ["Black"],
  },
  {
    id: "p3",
    title: "Psychodelic Woven Blanket – Tapestry",
    image: "/blanket.jpg",
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
    image: "/canvas.jpg",
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
  <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,.85)", borderBottom: "1px solid #e5e7eb", backdropFilter: "blur(8px)" }}>
    <div className="container" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, color: BRAND_GREEN }}>
        <img src="/vision.png" alt="Vision Logo" style={{ height: 56, filter: "drop-shadow(0 1px 0 rgba(0,0,0,.15))" }} />
        <span style={{ fontSize: 22, marginLeft: 2 }}>Vision</span>
      </a>
      <nav style={{ display: "none" }} />
      <button className="btn">Sepet</button>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="hero">
    <div className="container" style={{ padding: "80px 0", display: "grid", gap: 24 }}>
      <div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: 56, fontWeight: 900, color: BRAND_GREEN }}>
          Vision
        </motion.h1>
        <p style={{ color: "#333", maxWidth: 820, marginTop: 12 }}>
          TR ve Avrupa için limitli koleksiyon: T-Shirt, Sleeve Hoodie, Tapestry ve Canvas. Beden seçenekleri XS–XXL.
          Kargo: TR 1–3 iş günü, EU 3–7 iş günü.
        </p>
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
        if (data?.paymentUrl) window.location.href = data.paymentUrl;
        else alert('Sipariş alındı, e-posta ile onay gönderilecek.');
      } else {
        window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(JSON.stringify(body, null, 2))}`;
      }
    } catch {
      window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(JSON.stringify(body, null, 2))}`;
    }
  };
  return (
    <button onClick={handleClick} disabled={disabled} className="btn btn-primary" style={{ width: "100%", opacity: disabled ? .6 : 1 }}>
      <ShoppingCart size={16} /> {disabled ? 'Seçim Yapın' : 'Ödemeye Geç (Gooten)'}
    </button>
  );
}

const ProductCard: React.FC<{ p: Product }> = ({ p }) => {
  // Varsayılan seçimleri yap → buton sayfa açılır açılmaz aktif olsun
  const [size, setSize] = useState<string>(p.sizes?.[0] || "");
  const [color, setColor] = useState<string>(p.colors?.[0] || "");
  const [variant, setVariant] = useState<string>(p.variants?.[0]?.sku || "");

  const sku = useMemo(() => {
    if (p.variants && p.variants.length) return variant;
    if (p.sizes && p.colors) return GOOTEN_SKUS[p.id]?.[`${color}-${size}`];
    return undefined;
  }, [p, size, color, variant]);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,.06)" }}>
      <div style={{ aspectRatio: "4/5", overflow: "hidden" }}>
        <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{p.title}</h3>
          <div style={{ textAlign: "right" }}>
            {p.priceTRY != null && (<div style={{ color: BRAND_GREEN, fontWeight: 700 }}>{tl(p.priceTRY)}</div>)}
            {p.priceUSD != null && (<div style={{ color: "#666", fontSize: 12 }}>{usd(p.priceUSD)}</div>)}
          </div>
        </div>

        {p.sizes && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {p.sizes.map(s => (
              <button key={s} onClick={() => setSize(s)} className="pill" style={{ background: size === s ? "#000" : "#fff", color: size === s ? "#fff" : "#000" }}>{s}</button>
            ))}
          </div>
        )}
        {p.colors && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {p.colors.map(c => (
              <button key={c} onClick={() => setColor(c)} className="pill" style={{ background: color === c ? "#000" : "#fff", color: color === c ? "#fff" : "#000" }}>{c}</button>
            ))}
          </div>
        )}
        {p.variants && p.variants.length > 0 && (
          <select value={variant} onChange={(e)=>setVariant(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd", marginTop: 10 }}>
            {p.variants.map(v => (
              <option key={v.sku} value={v.sku}>{v.label}{v.priceUSD ? ` – $${v.priceUSD.toFixed(2)}` : ''}</option>
            ))}
          </select>
        )}

        <CheckoutButton sku={sku} payload={{ productId: p.id, title: p.title, priceTRY: p.priceTRY, priceUSD: p.priceUSD, size, color }} />
      </div>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer style={{ borderTop: "1px solid #eee", marginTop: 40, background: "#fff" }}>
    <div className="container" style={{ display: "grid", gap: 24, padding: "24px 0" }}>
      <div>
        <div style={{ fontWeight: 700, color: BRAND_GREEN }}>Vision Art Collection</div>
        <p style={{ color: "#555", margin: "8px 0 0" }}>Kaliteli baskı, hızlı teslimat, %100 memnuniyet.</p>
        <p style={{ color: "#555", margin: "6px 0 0" }}>Kargo: TR 1–3 iş günü shipped • EU 3–7 iş günü shipped</p>
      </div>
    </div>
    <div style={{ textAlign: "center", fontSize: 12, color: "#888", padding: "12px 0" }}>© {new Date().getFullYear()} Vision. Tüm hakları saklıdır.</div>
  </footer>
);

export default function ShopLanding() {
  const [active, setActive] = useState<CategoryId | "all">("all");
  const filtered = useMemo(() => (active === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === active)), [active]);
  return (
    <div>
      <Nav />
      <Hero />
      <section id="shop" className="container" style={{ padding: "40px 0" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: BRAND_GREEN, marginBottom: 16 }}>Kategoriler</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {filtered.map((p) => (<ProductCard key={p.id} p={p} />))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
