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

function VisaLogo() {
  return (
    <svg width="54" height="34" viewBox="0 0 54 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width="54" height="34" rx="6" fill="#1A1F71"/>
      <path d="M22.5 23L24.9 11H28.1L25.7 23H22.5Z" fill="white"/>
      <path d="M36.2 11.3C35.5 11 34.4 10.8 33 10.8C29.9 10.8 27.7 12.4 27.7 14.7C27.7 16.4 29.2 17.3 30.4 17.9C31.6 18.4 32 18.8 32 19.3C32 20 31.1 20.4 30.3 20.4C29.1 20.4 28.5 20.2 27.5 19.8L27.1 19.6L26.7 22.4C27.5 22.8 28.9 23.1 30.4 23.1C33.7 23.1 35.8 21.5 35.8 19C35.8 17.7 35 16.6 33.3 15.8C32.2 15.3 31.6 14.9 31.6 14.4C31.6 13.9 32.1 13.4 33.3 13.4C34.2 13.4 34.9 13.6 35.4 13.8L35.7 13.9L36.2 11.3Z" fill="white"/>
      <path d="M40.5 11H38C37.3 11 36.8 11.2 36.5 12L31.8 23H35.1L35.7 21.3H39.7L40.1 23H43L40.5 11ZM36.6 19.1C36.8 18.5 37.9 15.5 37.9 15.5C37.9 15.5 38.2 14.7 38.4 14.2L38.6 15.4C38.6 15.4 39.3 18.4 39.5 19.1H36.6Z" fill="white"/>
      <path d="M19.8 11L16.7 19.3L16.4 17.9C15.8 16 14 13.9 12 12.8L14.9 23H18.2L23.1 11H19.8Z" fill="white"/>
      <path d="M13.9 11H8.9L8.8 11.3C12.8 12.3 15.5 14.8 16.4 17.9L15.4 12C15.2 11.2 14.6 11 13.9 11Z" fill="#F9A51A"/>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="54" height="34" viewBox="0 0 54 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width="54" height="34" rx="6" fill="#252525"/>
      <circle cx="21" cy="17" r="8" fill="#EB001B"/>
      <circle cx="33" cy="17" r="8" fill="#F79E1B"/>
      <path d="M27 10.8C28.9 12.2 30.1 14.4 30.1 17C30.1 19.6 28.9 21.8 27 23.2C25.1 21.8 23.9 19.6 23.9 17C23.9 14.4 25.1 12.2 27 10.8Z" fill="#FF5F00"/>
    </svg>
  );
}

function CBLogo() {
  return (
    <svg width="54" height="34" viewBox="0 0 54 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width="54" height="34" rx="6" fill="#005FC5"/>
      <text x="27" y="22" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">CB</text>
    </svg>
  );
}

function ApplePayLogo() {
  return (
    <svg width="66" height="34" viewBox="0 0 66 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width="66" height="34" rx="6" fill="#000000"/>
      <path d="M18.5 11.5C18.9 11 19.4 10.6 20 10.5C20.1 11.2 19.8 11.8 19.4 12.3C19 12.8 18.5 13.1 17.9 13.1C17.8 12.4 18.1 11.9 18.5 11.5Z" fill="white"/>
      <path d="M20 13.4C20.9 13.4 21.7 13.9 22.1 13.9C22.5 13.9 23.4 13.4 24.5 13.5C25 13.5 26.3 13.7 27.1 14.9C27 15 25.2 16 25.2 18.2C25.2 20.8 27.4 21.7 27.5 21.7C27.5 21.8 26.8 24 25.1 24C24.3 24 23.7 23.5 22.9 23.5C22.1 23.5 21.4 24 20.5 24C18.9 24 17 22.1 17 18.8C17 15.6 18.9 13.5 20 13.4Z" fill="white"/>
      <text x="41" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="500" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">Pay</text>
    </svg>
  );
}

function GooglePayLogo() {
  return (
    <svg width="70" height="34" viewBox="0 0 70 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width="70" height="34" rx="6" fill="white" stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
      <path d="M19.5 17.6V20.5H18.5V13H21.3C21.8 13 22.3 13.2 22.7 13.5C23.1 13.9 23.3 14.3 23.3 14.8C23.3 15.3 23.1 15.8 22.7 16.1C22.3 16.5 21.9 16.6 21.3 16.6H19.5V17.6ZM19.5 13.9V15.8H21.3C21.6 15.8 21.8 15.7 22 15.5C22.2 15.3 22.3 15.1 22.3 14.8C22.3 14.5 22.2 14.3 22 14.1C21.8 13.9 21.6 13.9 21.3 13.9H19.5Z" fill="#5F6368"/>
      <path d="M26.4 15.2C27 15.2 27.5 15.4 27.9 15.7C28.3 16.1 28.5 16.6 28.5 17.2V20.5H27.5V19.8H27.5C27.2 20.3 26.7 20.6 26.1 20.6C25.5 20.6 25.1 20.4 24.7 20.1C24.4 19.7 24.2 19.3 24.2 18.9C24.2 18.4 24.4 18 24.7 17.7C25.1 17.4 25.6 17.2 26.3 17.2C26.9 17.2 27.4 17.4 27.7 17.6V17.4C27.7 17.1 27.6 16.8 27.4 16.6C27.2 16.4 26.9 16.3 26.6 16.3C26.1 16.3 25.8 16.5 25.5 16.9L24.6 16.3C25 15.6 25.6 15.2 26.4 15.2ZM25.2 18.9C25.2 19.1 25.3 19.3 25.5 19.4C25.7 19.6 25.9 19.6 26.1 19.6C26.4 19.6 26.8 19.5 27 19.2C27.3 19 27.5 18.7 27.5 18.4C27.2 18.2 26.8 18 26.3 18C25.9 18 25.6 18.1 25.4 18.3C25.3 18.5 25.2 18.7 25.2 18.9Z" fill="#5F6368"/>
      <path d="M33 15.3L30.3 21.8H29.3L30.3 19.6L28.4 15.3H29.5L30.8 18.5H30.8L32.1 15.3H33Z" fill="#5F6368"/>
      <path d="M36.8 17C36.8 16.3 37.1 15.7 37.6 15.3C38 14.9 38.6 14.7 39.3 14.7C40 14.7 40.5 14.9 40.9 15.4L40.2 16.1C39.9 15.8 39.6 15.6 39.2 15.6C38.8 15.6 38.4 15.8 38.1 16.1C37.8 16.4 37.7 16.8 37.7 17.3V17.4C37.7 17.9 37.8 18.3 38.1 18.6C38.4 18.9 38.7 19.1 39.2 19.1C39.6 19.1 39.9 18.9 40.2 18.7V18H39.1V17.2H41.1V19.1C40.6 19.7 39.9 20 39.1 20C38.4 20 37.8 19.8 37.4 19.3C36.9 18.8 36.8 18.2 36.8 17.4V17Z" fill="#4285F4"/>
      <path d="M44 14.7C44.7 14.7 45.3 14.9 45.7 15.4C46.2 15.8 46.4 16.4 46.4 17.1C46.4 17.8 46.2 18.4 45.7 18.8C45.3 19.3 44.7 19.5 44 19.5C43.3 19.5 42.7 19.3 42.3 18.8C41.8 18.4 41.6 17.8 41.6 17.1C41.6 16.4 41.8 15.8 42.3 15.4C42.7 14.9 43.3 14.7 44 14.7ZM44 15.6C43.6 15.6 43.3 15.7 43 16C42.8 16.3 42.6 16.7 42.6 17.1C42.6 17.6 42.8 18 43 18.2C43.3 18.5 43.6 18.6 44 18.6C44.4 18.6 44.7 18.5 45 18.2C45.2 18 45.4 17.6 45.4 17.1C45.4 16.7 45.2 16.3 45 16C44.7 15.7 44.4 15.6 44 15.6Z" fill="#EA4335"/>
      <path d="M50 14.7C50.7 14.7 51.3 14.9 51.7 15.4C52.2 15.8 52.4 16.4 52.4 17.1C52.4 17.8 52.2 18.4 51.7 18.8C51.3 19.3 50.7 19.5 50 19.5C49.3 19.5 48.7 19.3 48.3 18.8C47.8 18.4 47.6 17.8 47.6 17.1C47.6 16.4 47.8 15.8 48.3 15.4C48.7 14.9 49.3 14.7 50 14.7ZM50 15.6C49.6 15.6 49.3 15.7 49 16C48.8 16.3 48.6 16.7 48.6 17.1C48.6 17.6 48.8 18 49 18.2C49.3 18.5 49.6 18.6 50 18.6C50.4 18.6 50.7 18.5 51 18.2C51.2 18 51.4 17.6 51.4 17.1C51.4 16.7 51.2 16.3 51 16C50.7 15.7 50.4 15.6 50 15.6Z" fill="#FBBC05"/>
      <path d="M55 14.8V15.7H54.7C54.3 15.7 54 15.9 53.8 16.1C53.6 16.4 53.4 16.7 53.4 17.1V19.4H52.5V14.8H53.4V15.5C53.7 15 54.2 14.8 54.7 14.8H55Z" fill="#34A853"/>
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body className={inter.className} style={{ background: "#ffffff", minHeight: "100vh" }}>
        <PresenceProvider>
          <AgeVerificationModal />
          <AnnouncementBanner />
          <Header />
          <main>{children}</main>
        </PresenceProvider>

        <footer style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          background: "#f8f8fa",
          padding: "56px 24px 40px",
          marginTop: 100,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
              {/* Brand */}
              <div>
                <Image src="/logo.png" alt="GoWinGo" width={160} height={54} style={{ objectFit: "contain", marginBottom: 10 }} />
                <p style={{ color: "#6b6b6b", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
                  Une sélection exclusive de lots d&apos;exception.<br />
                  Paiement sécurisé. Tirage certifié.
                </p>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Légal</div>
                  {["Mentions légales", "CGV", "Règlement", "Confidentialité"].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Contact</div>
                  {["Support", "Partenariats"].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Moyens de paiement */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 28, marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Moyens de paiement acceptés
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <VisaLogo />
                <MastercardLogo />
                <CBLogo />
                <ApplePayLogo />
                <GooglePayLogo />
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <p style={{ color: "#a0a0a0", fontSize: 12 }}>
                © {new Date().getFullYear()} GoWinGo — Tous droits réservés
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {[
                  { label: "Paiement sécurisé", icon: "🔒" },
                  { label: "Certifié huissier", icon: "⚖️" },
                ].map(item => (
                  <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a0a0a0" }}>
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
