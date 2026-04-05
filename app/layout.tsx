import type { Metadata } from "next";
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
