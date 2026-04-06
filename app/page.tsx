"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { supabaseClient, Lot } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import LotGrid from "@/components/LotGrid";

const FLOATING_ITEMS = [
  { emoji: "🚗", size: 52, top: 12, left: 3  },
  { emoji: "✈️", size: 50, top: 10, left: 80 },
  { emoji: "💻", size: 48, top: 65, left: 88 },
  { emoji: "🎧", size: 44, top: 72, left: 5  },
  { emoji: "💎", size: 42, top: 80, left: 50 },
  { emoji: "🏆", size: 46, top: 20, left: 55 },
  { emoji: "⌚", size: 42, top: 45, left: 92 },
  { emoji: "📱", size: 44, top: 55, left: 1  },
];

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient.from("lots")
      .select("*")
      .in("statut", ["actif", "programme"])
      .order("created_at", { ascending: false })
      .then(({ data }) => { 
        setLots(data || []); 
        setLoading(false); 
      });
  }, []);

  // Prochain tirage = lot actif avec la date_fin la plus proche (non expirée)
  const prochainTirage = useMemo(() => {
    const now = Date.now();
    return lots
      .filter(l => {
        const isProgramme = !!(l.date_ouverture && new Date(l.date_ouverture) > new Date());
        return !isProgramme && l.date_fin && new Date(l.date_fin).getTime() > now;
      })
      .sort((a, b) => new Date(a.date_fin!).getTime() - new Date(b.date_fin!).getTime())[0] ?? null;
  }, [lots]);

  // Lots triés : prochain tirage toujours en premier
  const lotsSorted = useMemo(() => {
    if (!prochainTirage) return lots;
    return [prochainTirage, ...lots.filter(l => l.id !== prochainTirage.id)];
  }, [lots, prochainTirage]);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", padding: "clamp(40px, 8vw, 70px) clamp(16px, 5vw, 24px) clamp(48px, 8vw, 80px)", background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 40%, #FD79A8 70%, #FDCB6E 100%)" }}>

        {/* Floating prize items */}
        {FLOATING_ITEMS.map((item, i) => (
          <div key={i} style={{
            position: "absolute",
            fontSize: item.size,
            top: `${item.top}%`,
            left: `${item.left}%`,
            opacity: 0.12,
            animation: `float ${4 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
            pointerEvents: "none",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            userSelect: "none",
          }}>{item.emoji}</div>
        ))}

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", width: 400, height: 400 }}>
              <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(38px, 7vw, 68px)",
            color: "white", lineHeight: 1.05,
            marginBottom: 16,
            textShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            {"Tentez votre chance\u00A0!"}
          </h1>

          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600, marginBottom: 36, lineHeight: 1.6 }}>
            Achetez vos tickets et remportez des lots incroyables !<br className="hero-br" />
            {" "}Simple, rapide, et certifié huissier. 🏆
          </p>


        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: "white", borderBottom: "1px solid #f0eeff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, label: "Paiement 100% sécurisé" },
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Tirage certifié huissier" },
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "Confirmation email immédiate" },
            { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FDCB6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: "Des milliers de gagnants" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: "#636E72", whiteSpace: "nowrap" }}>
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* LOTS */}
      <div id="lots" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{ width: 44, height: 44, border: "4px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          </div>
        ) : lots.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎟️</div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#2D3436", marginBottom: 8 }}>Aucun lot en cours</h2>
            <p style={{ color: "#636E72" }}>Revenez bientôt pour nos prochains tirages !</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#2D3436" }}>🎁 Lots à gagner</h2>
              <span style={{ background: "#f0eeff", color: "#6C5CE7", fontWeight: 800, fontSize: 13, padding: "4px 14px", borderRadius: 999 }}>
                {lots.length} actif{lots.length > 1 ? "s" : ""}
              </span>
              <span style={{ background: "#fff3e0", color: "#FF7043", fontWeight: 800, fontSize: 13, padding: "4px 14px", borderRadius: 999 }}>
                🎫 {lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0)} tickets dispo
              </span>
            </div>

            {/* Filtres catégories — seulement les catégories présentes dans les lots */}
            {(() => {
              const presentCats = Array.from(new Set(lots.map(l => l.categorie)));
              const filteredCats = CATEGORIES.filter(c => presentCats.includes(c.val as Lot["categorie"]));
              if (filteredCats.length < 2) return null;
              return (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 28, WebkitOverflowScrolling: "touch" as any }}>
                  {/* Bouton Tous */}
                  <button
                    onClick={() => setActiveCategory(null)}
                    style={{
                      flexShrink: 0, padding: "8px 18px", borderRadius: 999,
                      fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                      cursor: "pointer", border: "2px solid",
                      borderColor: activeCategory === null ? "#6C5CE7" : "#e0d9ff",
                      background: activeCategory === null ? "#6C5CE7" : "white",
                      color: activeCategory === null ? "white" : "#636E72",
                      transition: "all .15s",
                    }}
                  >
                    Tous
                  </button>
                  {filteredCats.map(cat => {
                    const active = activeCategory === cat.val;
                    return (
                      <button
                        key={cat.val}
                        onClick={() => setActiveCategory(active ? null : cat.val)}
                        style={{
                          flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                          cursor: "pointer", border: "2px solid",
                          borderColor: active ? cat.color : "#e0d9ff",
                          background: active ? cat.color : "white",
                          color: active ? "white" : "#636E72",
                          transition: "all .15s",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            <LotGrid lots={activeCategory ? lotsSorted.filter(l => l.categorie === activeCategory) : lotsSorted} prochainTirageId={prochainTirage?.id} />
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes flicker { 0% { transform: scale(1) rotate(-3deg); } 100% { transform: scale(1.15) rotate(3deg); } }
      `}</style>
    </div>
  );
}
