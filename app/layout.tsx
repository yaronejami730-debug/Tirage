import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Header from "@/components/Header";
import { PresenceProvider } from "@/components/PresenceContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GoWinGo — Participez. Gagnez.",
  description: "Une sélection exclusive de lots d'exception. Paiement sécurisé, tirage certifié.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body className={inter.className} style={{ background: "#fbfbfd", minHeight: "100vh" }}>
        <PresenceProvider>
          <AgeVerificationModal />
          <AnnouncementBanner />
          <Header />
          <main>{children}</main>
        </PresenceProvider>

        <footer style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          background: "#f5f5f7",
          padding: "56px 24px 40px",
          marginTop: 100,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
              {/* Brand */}
              <div>
                <Image src="/logo.png" alt="GoWinGo" width={160} height={54} style={{ objectFit: "contain", marginBottom: 10 }} />
                <p style={{ color: "#6e6e73", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
                  Une sélection exclusive de lots d'exception.<br />
                  Paiement sécurisé. Tirage certifié.
                </p>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Légal</div>
                  {["Mentions légales", "CGV", "Règlement", "Confidentialité"].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Contact</div>
                  {["Support", "Partenariats"].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ color: "#a1a1a6", fontSize: 12 }}>
                © {new Date().getFullYear()} GoWinGo — Tous droits réservés
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {[
                  { label: "Paiement sécurisé", icon: "🔒" },
                  { label: "Certifié huissier", icon: "⚖️" },
                ].map(item => (
                  <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a1a1a6" }}>
                    <span style={{ fontSize: 11 }}>{item.icon}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
