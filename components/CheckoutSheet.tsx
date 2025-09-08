import React, { useMemo, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

type CheckoutSheetProps = {
  open: boolean;
  onClose: () => void;
  sku: string | undefined;
  title: string;
  payload: Record<string, any>;
};

export default function CheckoutSheet({ open, onClose, sku, title, payload }: CheckoutSheetProps) {
  const [loading, setLoading] = useState(false);
  const disabled = !open || !sku || loading;

  const reqBody = useMemo(() => ({ ...payload, sku, title }), [payload, sku, title]);

  const handlePay = async () => {
    if (!sku) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gooten/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
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
        // Fallback (mailto)
        window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
          JSON.stringify(reqBody, null, 2)
        )}`;
      }
    } catch {
      window.location.href = `mailto:hello@visionart.com?subject=Gooten%20Sipari%C5%9F&body=${encodeURIComponent(
        JSON.stringify(reqBody, null, 2)
      )}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`sheet ${open ? "sheet-open" : ""}`} aria-hidden={!open}>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet-panel" role="dialog" aria-modal="true">
        <div className="sheet-head">
          <div style={{ fontWeight: 800 }}>Ödeme</div>
          <button className="btn-icon" onClick={onClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        <div className="sheet-body">
          <div style={{ fontSize: 14, color: "#555" }}>Ürün</div>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>{title}</div>
          <div className="sheet-line">
            <span>SKU</span>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas" }}>
              {sku || "-"}
            </span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={disabled}
          className="btn btn-primary"
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
        >
          <ShoppingCart size={16} />
          {loading ? "Yükleniyor..." : "Ödemeye Geç (Gooten)"}
        </button>
      </div>
    </div>
  );
}
