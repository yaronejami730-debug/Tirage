"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(108,92,231,0.1)",
      boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ position: "relative", width: 130, height: 44 }}>
            <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} />
          </div>
        </Link>

        {/* Trust badges — masqués sur mobile */}
        <div className="hide-mobile" style={{ gap: 20, fontSize: 12, color: "#636E72", fontWeight: 700 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Paiement sécurisé Stripe
          </span>
          <span style={{ color: "#e0d9ff" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Certifié huissier indépendant
          </span>
          <span style={{ color: "#e0d9ff" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FDCB6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Confirmation immédiate
          </span>
        </div>

        {/* CTA */}
        <a
          href="#lots"
          style={{
            flexShrink: 0,
            display: "inline-flex", alignItems: "center",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
            padding: "9px 18px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
            color: "white", textDecoration: "none",
            boxShadow: "0 4px 14px rgba(108,92,231,0.35)",
            transition: "all .2s ease",
          }}
        >
          Voir les lots
        </a>
      </div>
    </header>
  );
}
