import React, { useEffect, useRef, useState } from "react";

type Market = "TR" | "EU";

type Shipping = {
  firstName: string;
  lastName: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string; // ISO2 (TR/DE vb.)
};

type CheckoutSheetProps = {
  open: boolean;
  onClose: () => void;
  sku?: string;
  payload: {
    productId?: string;
    title: string;
    priceUSD?: number;
    priceTRY?: number;
    size?: string;
    color?: string;
  };
};

const BRAND_GREEN = "#9AC72C";

export default function CheckoutSheet({ open, onClose, sku, payload }: CheckoutSheetProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [market, setMarket] = useState<Market>("TR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shipping, setShipping] = useState<Shipping>({
    firstName: "",
    lastName: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: "TR",
  });

  const panelRef = useRef<HTMLDivElement>(null);

  // market değişince varsayılan ülke
  useEffect(() => {
    setShipping((s) => ({ ...s, countryCode: market === "EU" ? "DE" : "TR" }));
  }, [market]);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Basit validasyon
  const isValid =
    !!sku &&
    shipping.firstName.trim() &&
    shipping.lastName.trim() &&
    shipping.email.trim() &&
    shipping.line1.trim() &&
    shipping.city.trim() &&
    shipping.postalCode.trim();

  const handleChange =
    (key: keyof Shipping) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setShipping((s) => ({ ...s, [key]: e.target.value }));
    };

  const handleOrder = async () => {
    setError(null);
    if (!isValid) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }
    setLoading(true);
    const body = {
      sku,
      quantity,
      market,
      shipping,
      ...payload,
    };

    try {
      const res = await fetch("/api/gooten/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert("Sipariş alındı, onay e-posta ile gönderilecek.");
          onClose();
        }
      } else {
        // yedek: e-posta
        window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
          JSON.stringify(body, null, 2)
        )}`;
      }
    } catch (e: any) {
      // yedek: e-posta
      window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
        JSON.stringify(body, null, 2)
      )}`;
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      aria-modal
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,.35)",
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
      onClick={(e) => {
        // panel dışına tıklayınca kapat
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: "min(560px, 100%)",
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
          padding: 20,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Ürün</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{payload.title}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              {payload.size ? `Beden: ${payload.size}` : ""}
              {payload.color ? ` • Renk: ${payload.color}` : ""}
              {!payload.size && !payload.color ? "Opsiyon yok" : ""}
            </div>
          </div>

          <button
            onClick={onClose}
            className="pill"
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Kapat
          </button>
        </div>

        {/* Line */}
        <div style={{ height: 1, background: "#eee", margin: "14px 0" }} />

        {/* Pazar + Adet */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
            Pazar
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value as Market)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "10px 12px",
              }}
            >
              <option value="TR">Türkiye</option>
              <option value="EU">Avrupa Birliği</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
            Adet
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "10px 12px",
              }}
            />
          </label>
        </div>

        {/* Line */}
        <div style={{ height: 1, background: "#eee", margin: "14px 0" }} />

        {/* Adres Formu */}
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Teslimat Adresi</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              Ad
              <input
                value={shipping.firstName}
                onChange={handleChange("firstName")}
                placeholder="Ad"
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              Soyad
              <input
                value={shipping.lastName}
                onChange={handleChange("lastName")}
                placeholder="Soyad"
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
            E-posta
            <input
              type="email"
              value={shipping.email}
              onChange={handleChange("email")}
              placeholder="ornek@eposta.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
            Adres
            <input
              value={shipping.line1}
              onChange={handleChange("line1")}
              placeholder="Sokak, No, Daire"
              style={inputStyle}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              Şehir
              <input value={shipping.city} onChange={handleChange("city")} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              İlçe/Eyalet
              <input value={shipping.state} onChange={handleChange("state")} style={inputStyle} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              Posta Kodu
              <input
                value={shipping.postalCode}
                onChange={handleChange("postalCode")}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#444" }}>
              Ülke (ISO2)
              <input
                value={shipping.countryCode}
                onChange={handleChange("countryCode")}
                style={inputStyle}
                placeholder={market === "EU" ? "DE" : "TR"}
              />
            </label>
          </div>
        </div>

        {/* Hata */}
        {error && (
          <div
            style={{
              marginTop: 10,
              color: "#b91c1c",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: "8px 10px",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Ödeme Butonu */}
        <div style={{ height: 12 }} />
        <button
          onClick={handleOrder}
          disabled={!isValid || loading}
          className="btn btn-primary"
          style={{
            width: "100%",
            opacity: !isValid || loading ? 0.6 : 1,
            background: BRAND_GREEN,
            color: "#000",
            borderRadius: 16,
            padding: "12px 14px",
            border: "1px solid rgba(0,0,0,.08)",
            fontWeight: 700,
          }}
        >
          {loading ? "İşleniyor..." : "Ödemeye Geç (Gooten)"}
        </button>

        {/* Bilgi */}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
          TR: 1–3 iş günü • EU: 3–7 iş günü kargoya verilir.
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "10px 12px",
};
