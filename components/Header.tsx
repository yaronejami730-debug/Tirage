"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Ferme le menu sur resize vers desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Bloque le scroll body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleCategory = (val: string) => {
    setMenuOpen(false);
    router.push(`/?cat=${val}`);
  };

  const handleAllLots = () => {
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Image src="/logo.png" alt="GoWinGo" width={240} height={80} style={{ objectFit: "contain" }} priority />
          </Link>

          {/* Trust — desktop uniquement */}
          <div className="hide-mobile" style={{ gap: 20, fontSize: 12, color: "#a0a0a0", fontWeight: 400, alignItems: "center" }}>
            <span>Paiement sécurisé</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>Certifié huissier</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>Confirmation immédiate</span>
          </div>

          {/* Desktop CTA */}
          <a href="#lots" className="hide-mobile" style={{
            flexShrink: 0,
            display: "inline-flex", alignItems: "center",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            padding: "9px 20px", borderRadius: 10,
            background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)",
            color: "#ffffff",
            textDecoration: "none", transition: "all .2s", letterSpacing: "-0.01em",
            boxShadow: "0 4px 14px rgba(123,77,255,0.25)",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(123,77,255,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(123,77,255,0.25)"; }}
          >
            Voir les lots
          </a>

          {/* Hamburger — mobile uniquement */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: "none",
              alignItems: "center", justifyContent: "center",
              width: 38, height: 38, borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.1)",
              background: menuOpen ? "rgba(0,0,0,0.05)" : "transparent",
              cursor: "pointer", flexShrink: 0,
              transition: "background .15s",
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              /* X */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              /* Hamburger */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Overlay menu mobile ──────────────────────── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 199,
            background: "#ffffff",
            overflowY: "auto",
            paddingTop: 60, // sous le header
            animation: "menuSlideDown .25s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <div style={{ padding: "28px 24px 60px" }}>

            {/* Tous les lots */}
            <button
              onClick={handleAllLots}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px", borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.07)",
                background: "#ffffff", cursor: "pointer", fontFamily: "inherit",
                marginBottom: 24, textAlign: "left",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <span style={{ fontSize: 22 }}>🎯</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111111", letterSpacing: "-0.01em" }}>Tous les lots</div>
                <div style={{ fontSize: 12, color: "#a0a0a0", marginTop: 1 }}>Voir toute la sélection</div>
              </div>
              <svg style={{ marginLeft: "auto", color: "#a0a0a0" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Titre section */}
            <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 4 }}>
              Catégories
            </div>

            {/* Grille catégories */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.val}
                  onClick={() => handleCategory(cat.val)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.07)",
                    background: "#ffffff", cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    transition: "box-shadow .15s",
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#111111", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hamburger-btn { display: none !important; }
        @media (max-width: 639px) {
          .hamburger-btn { display: flex !important; }
        }
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
