import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tirage — Tentez votre chance !",
  description: "Achetez vos tickets et participez à nos tirages au sort exclusifs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 1px 20px rgba(0,0,0,0.06)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,58,237,0.4)"
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg, #7c3aed, #4c1d95)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Tirage
              </span>
            </a>
            <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a href="/" style={{ fontSize: 14, fontWeight: 600, color: "#6d28d9", textDecoration: "none", padding: "6px 14px", borderRadius: 10, background: "rgba(124,58,237,0.08)" }}>
                Lots
              </a>
              <a href="/admin" style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af", textDecoration: "none", padding: "6px 14px", borderRadius: 10 }}>
                Admin
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer style={{ marginTop: 80, background: "#111", padding: "40px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #4c1d95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>Tirage</span>
            </div>
            <p style={{ color: "#6b7280", fontSize: 12, textAlign: "center" }}>
              Tirages certifiés par huissier indépendant · Paiement sécurisé · © {new Date().getFullYear()} Tirage
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
