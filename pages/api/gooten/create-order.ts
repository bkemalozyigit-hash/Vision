import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sku, quantity = 1, market = "TR", shipping, title, priceUSD, size, color } = req.body || {};
  if (!sku) return res.status(400).json({ error: "Missing SKU" });

  const orderPayload = {
    Items: [
      {
        SKU: sku,
        Quantity: Number(quantity) || 1,
        Metadata: { title, size, color, market, priceUSD },
      },
    ],
    ShipToAddress: {
      FirstName: shipping?.firstName || "Vision",
      LastName:  shipping?.lastName  || "Customer",
      Line1:     shipping?.line1     || "Test Address",
      City:      shipping?.city      || "Istanbul",
      State:     shipping?.state     || "",
      CountryCode: (shipping?.countryCode || (market === "EU" ? "DE" : "TR")).toUpperCase(),
      PostalCode: shipping?.postalCode || "34000",
      Email:     shipping?.email     || "hello@visionart.com",
    },
  };

  // DEMO MODU: Env yoksa sahte başarı dön → mailto açılmasın
  if (!process.env.GOOTEN_API_KEY) {
    return res.status(200).json({ orderId: "demo", paymentUrl: "/checkout/success" });
  }

  try {
    const gootenRes = await fetch("https://api.print.io/api/v/3/source/api-gooten/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GOOTEN_API_KEY}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!gootenRes.ok) {
      const errorText = await gootenRes.text();
      return res.status(gootenRes.status).json({ error: errorText });
    }

    const data = await gootenRes.json();
    const paymentUrl = data?.PaymentUrl || data?.payment_url || "/checkout/success";
    return res.status(200).json({ orderId: data.Id, paymentUrl });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
