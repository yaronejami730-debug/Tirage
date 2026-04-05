import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WinYouWatch 🎰 — Tentez votre chance !",
  description: "Achetez vos tickets et tentez de remporter des lots incroyables !",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Nunito', sans-serif", background: "#F8F9FF", minHeight: "100vh" }}>

        {/* NAVBAR */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
          borderBottom: "2px solid #f0eeff",
          boxShadow: "0 2px 20px rgba(108,92,231,0.08)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Logo */}
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: "linear-gradient(135deg, #6C5CE7, #FD79A8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 4px 15px rgba(108,92,231,0.4)"
              }}>🎰</div>
              <span style={{
                fontFamily: "'Fredoka One', cursive", fontSize: 24,
                background: "linear-gradient(135deg, #6C5CE7, #FD79A8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>WinYouWatch</span>
              <span style={{
                background: "#FD79A8", color: "white", fontSize: 11, fontWeight: 800,
                padding: "2px 8px", borderRadius: 20, marginLeft: 4
              }}>LIVE 🔥</span>
            </a>

            {/* Nav */}
            <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <a href="/" style={{ fontWeight: 700, fontSize: 14, color: "#6C5CE7", textDecoration: "none", padding: "8px 16px", borderRadius: 12, background: "#f0eeff" }}>
                🎁 Lots
              </a>
              <a href="#how" style={{ fontWeight: 700, fontSize: 14, color: "#636E72", textDecoration: "none", padding: "8px 16px", borderRadius: 12, transition: "all .2s" }}>
                ❓ Comment jouer
              </a>
              <a href="/admin" style={{ fontWeight: 600, fontSize: 13, color: "#b2bec3", textDecoration: "none", padding: "8px 14px", borderRadius: 12 }}>
                Admin
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* FOOTER */}
        <footer style={{ background: "#2D3436", padding: "48px 24px 32px", marginTop: 80 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🎰</span>
              <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "white" }}>WinYouWatch</span>
            </div>
            <p style={{ color: "#636E72", fontSize: 13, maxWidth: 480 }}>
              Tentez votre chance, changez votre quotidien ! 🎉<br />
              Jeu administré sous contrôle huissier indépendant · Paiement sécurisé Stripe
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {["Mentions légales", "CGV", "Règlement", "Contact"].map(l => (
                <a key={l} href="#" style={{ color: "#636E72", fontSize: 12, textDecoration: "none" }}>{l}</a>
              ))}
            </div>
            <p style={{ color: "#4a5568", fontSize: 11 }}>© {new Date().getFullYear()} WinYouWatch — Tous droits réservés</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
