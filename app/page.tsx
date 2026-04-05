"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { supabaseClient, Lot } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import LotGrid from "@/components/LotGrid";

const FLOATING_ITEMS = [
  { emoji: "📱", size: 52, top: 5,  left: 2  },
  { emoji: "🚗", size: 60, top: 60, left: 0  },
  { emoji: "✈️", size: 56, top: 14, left: 82 },
  { emoji: "💻", size: 54, top: 71, left: 85 },
  { emoji: "📺", size: 50, top: 3,  left: 43 },
  { emoji: "🎧", size: 48, top: 79, left: 42 },
  { emoji: "⌚", size: 46, top: 37, left: 89 },
  { emoji: "🎮", size: 52, top: 43, left: 1  },
  { emoji: "💎", size: 44, top: 86, left: 13 },
  { emoji: "🏎️", size: 58, top: 91, left: 69 },
  { emoji: "🎟️", size: 44, top: 21, left: 62 },
  { emoji: "📷", size: 48, top: 56, left: 92 },
  { emoji: "🖥️", size: 50, top: 9,  left: 21 },
  { emoji: "🎸", size: 46, top: 74, left: 57 },
  { emoji: "🚀", size: 44, top: 29, left: 74 },
  { emoji: "👜", size: 46, top: 93, left: 34 },
  { emoji: "🛥️", size: 50, top: 19, left: 9  },
  { emoji: "🏠", size: 48, top: 67, left: 21 },
  { emoji: "💰", size: 44, top: 44, left: 51 },
  { emoji: "🍾", size: 46, top: 32, left: 6  },
  { emoji: "🚁", size: 50, top: 8,  left: 66 },
  { emoji: "👟", size: 44, top: 83, left: 76 },
  { emoji: "🧳", size: 46, top: 52, left: 88 },
  { emoji: "🏆", size: 50, top: 16, left: 30 },
  { emoji: "🎯", size: 42, top: 97, left: 52 },
  { emoji: "🪙", size: 40, top: 48, left: 77 },
  { emoji: "🎀", size: 42, top: 63, left: 6  },
  { emoji: "💳", size: 44, top: 26, left: 48 },
  { emoji: "🎪", size: 48, top: 88, left: 28 },
  { emoji: "🛍️", size: 44, top: 40, left: 15 },
  { emoji: "🏋️", size: 46, top: 76, left: 93 },
  { emoji: "🎨", size: 44, top: 12, left: 55 },
  { emoji: "🚤", size: 48, top: 58, left: 33 },
  { emoji: "🎺", size: 44, top: 95, left: 8  },
  { emoji: "🧿", size: 40, top: 35, left: 58 },
  { emoji: "🛸", size: 46, top: 22, left: 18 },
  { emoji: "🎭", size: 44, top: 70, left: 48 },
  { emoji: "🌟", size: 42, top: 50, left: 68 },
  { emoji: "🏝️", size: 46, top: 82, left: 61 },
  { emoji: "🎠", size: 44, top: 6,  left: 37 },
];

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient().from("lots").select("*").in("statut", ["actif", "programme"])
      .order("created_at", { ascending: false })
      .then(({ data }) => { setLots(data || []); setLoading(false); });
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
            opacity: 0.3,
            animation: `float ${3 + i * 0.35}s ease-in-out ${i * 0.25}s infinite`,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))",
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
