import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export const metadata: Metadata = {
  title: "GoWinGo 🎰 — Tentez votre chance !",
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

        <AnnouncementBanner />

        {/* NAVBAR */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
          borderBottom: "2px solid #f0eeff",
          boxShadow: "0 2px 20px rgba(108,92,231,0.08)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

            {/* Logo */}
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ position: "relative", width: 50, height: 50, borderRadius: 12, overflow: "hidden", background: "white", border: "1px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, boxShadow: "0 6px 15px rgba(108,92,231,0.15)" }}>
                <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} />
              </div>
              <span style={{
                fontFamily: "'Fredoka One', cursive", fontSize: 22,
                color: "#2D3436"
              }}>GoWinGo</span>
              <span style={{
                background: "#FD79A8", color: "white", fontSize: 10, fontWeight: 800,
                padding: "2px 7px", borderRadius: 20
              }}>LIVE 🔥</span>
            </a>

            {/* Nav */}
            <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <a href="/" style={{ fontWeight: 700, fontSize: 13, color: "#6C5CE7", textDecoration: "none", padding: "6px 14px", borderRadius: 10, background: "#f0eeff", whiteSpace: "nowrap" }}>
                🎁 Lots
              </a>
              <a href="#how" style={{ fontWeight: 600, fontSize: 13, color: "#636e72", textDecoration: "none", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                ❓ Comment jouer
              </a>
              <a href="/admin" style={{ fontWeight: 600, fontSize: 12, color: "#b2bec3", textDecoration: "none", padding: "6px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>
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
              <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "white" }}>GoWinGo</span>
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
            <p style={{ color: "#4a5568", fontSize: 11 }}>© {new Date().getFullYear()} GoWinGo — Tous droits réservés</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
