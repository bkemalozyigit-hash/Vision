export default function Success() {
  return (
    <div style={{minHeight: "60vh", display: "grid", placeItems: "center"}}>
      <div style={{textAlign: "center"}}>
        <h1 style={{fontSize: 36, fontWeight: 900, color: "#9AC72C"}}>Sipariş Alındı 🎉</h1>
        <p style={{color: "#555", maxWidth: 520}}>
          Teşekkürler! Sipariş detayları e-posta adresinize gönderilecek.
          Sorular için <a href="mailto:hello@visionart.com">hello@visionart.com</a>
        </p>
      </div>
    </div>
  );
}
