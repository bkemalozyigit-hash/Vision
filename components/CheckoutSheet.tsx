import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  sku?: string;
  payload: {
    productId: string;
    title: string;
    priceTRY?: number;
    priceUSD?: number;
    size?: string;
    color?: string;
  };
};

export default function CheckoutSheet({ open, onClose, sku, payload }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: "TR", // TR/EU pazar hedefi
  });

  const disabled =
    !sku ||
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.line1 ||
    !form.city ||
    !form.postalCode ||
    !form.countryCode;

  const handlePay = async () => {
    if (disabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gooten/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          ...payload,
          shipping: {
            firstName: form.firstName,
            lastName: form.lastName,
            line1: form.line1,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            countryCode: form.countryCode,
            email: form.email,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert("Sipariş alındı, e-posta ile onay gönderilecek.");
          onClose();
        }
      } else {
        // env yoksa veya hata varsa mailto fallback
        const mail = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
          JSON.stringify({ sku, ...payload, shipping: form }, null, 2)
        )}`;
        window.location.href = mail;
      }
    } catch {
      const mail = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
        JSON.stringify({ sku, ...payload, shipping: form }, null, 2)
      )}`;
      window.location.href = mail;
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "grid",
        placeItems: "end",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -10px 30px rgba(0,0,0,.15)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>Gönderim Bilgileri</div>
          <button className="pill" onClick={onClose}>Kapat</button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Ad" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} />
            <input placeholder="Soyad" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} />
          </div>
          <input placeholder="E-posta" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
          <input placeholder="Adres Satırı" value={form.line1} onChange={(e)=>setForm({...form, line1: e.target.value})} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Şehir" value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} />
            <input placeholder="İl/State (ops.)" value={form.state} onChange={(e)=>setForm({...form, state: e.target.value})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Posta Kodu" value={form.postalCode} onChange={(e)=>setForm({...form, postalCode: e.target.value})} />
            <select value={form.countryCode} onChange={(e)=>setForm({...form, countryCode: e.target.value})}>
              <option value="TR">Türkiye (TR)</option>
              <option value="DE">Germany (DE)</option>
              <option value="NL">Netherlands (NL)</option>
              <option value="FR">France (FR)</option>
              <option value="ES">Spain (ES)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="IT">Italy (IT)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12, marginTop: 14, alignItems: "center" }}>
          <div style={{ color: "#555" }}>
            <div style={{ fontWeight: 700 }}>{payload.title}</div>
            <div style={{ fontSize: 12 }}>
              {payload.size ? `Beden: ${payload.size}` : ""} {payload.color ? `• Renk: ${payload.color}` : ""}
            </div>
          </div>
          <button
            className="btn btn-primary"
            disabled={disabled || loading}
            style={{ opacity: disabled || loading ? .6 : 1 }}
            onClick={handlePay}
          >
            {loading ? "Gönderiliyor..." : "Siparişi Ver"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: "#777", marginTop: 10 }}>
          Kargo: TR 1–3 iş günü, EU 3–7 iş günü (shipped). Fiyatlar USD bazlıdır; TRY gösterimi bilgi amaçlıdır.
        </p>
      </div>
    </div>
  );
}
