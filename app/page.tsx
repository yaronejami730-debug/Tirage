"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseClient, Lot } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import LotGrid from "@/components/LotGrid";

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("cat")
  );

  // Sync avec le param URL quand on revient du menu hamburger
  useEffect(() => {
    setActiveCategory(searchParams.get("cat"));
  }, [searchParams]);

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

  const prochainTirage = useMemo(() => {
    const now = Date.now();
    return lots
      .filter(l => {
        const isProgramme = !!(l.date_ouverture && new Date(l.date_ouverture) > new Date());
        return !isProgramme && l.date_fin && new Date(l.date_fin).getTime() > now;
      })
      .sort((a, b) => new Date(a.date_fin!).getTime() - new Date(b.date_fin!).getTime())[0] ?? null;
  }, [lots]);

  const lotsSorted = useMemo(() => {
    if (!prochainTirage) return lots;
    return [prochainTirage, ...lots.filter(l => l.id !== prochainTirage.id)];
  }, [lots, prochainTirage]);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────── */}
      <div style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "100px 28px 96px",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>

          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 28, padding: "6px 16px",
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: 99,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b", letterSpacing: "0.04em" }}>
              Tirage certifié · Paiement sécurisé
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 20,
          }}>
            Tentez votre chance
            <br />
            <span style={{ color: "#a1a1a6", fontWeight: 300 }}>sur des lots d'exception</span>
          </h1>

          <p style={{
            color: "#6b6b6b", fontSize: "clamp(14px, 2vw, 17px)",
            fontWeight: 400, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 44px",
          }}>
            Sélection exclusive de produits haut de gamme.
            <br className="hero-br" />
            Simple, rapide, et encadré par huissier.
          </p>

          <a href="#lots" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", color: "#ffffff",
            fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em",
            padding: "15px 32px", borderRadius: 980, textDecoration: "none",
            transition: "all .2s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 4px 16px rgba(123,77,255,0.3)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0077ed"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,113,227,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(123,77,255,0.3)"; }}
          >
            Voir les lots
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ─── LOTS ─────────────────────────────────────── */}
      <div id="lots" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 28px 100px" }}>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
            <div style={{ width: 32, height: 32, border: "2px solid rgba(0,0,0,0.08)", borderTopColor: "#111111", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          </div>
        ) : lots.length === 0 ? (
          <div style={{ textAlign: "center", padding: 100 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#a1a1a6", letterSpacing: "0.05em", marginBottom: 16, textTransform: "uppercase" }}>
              Aucun lot en cours
            </div>
            <p style={{ color: "#a1a1a6", fontSize: 14 }}>Revenez bientôt pour nos prochains tirages.</p>
          </div>
        ) : (
          <>
            {/* Header section */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111111", letterSpacing: "-0.03em", marginBottom: 4 }}>
                  Lots disponibles
                </h2>
                <p style={{ fontSize: 13, color: "#a1a1a6", fontWeight: 400 }}>
                  {lots.length} lot{lots.length > 1 ? "s" : ""} · {lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0)} tickets disponibles
                </p>
              </div>

              {/* Filtres catégories */}
              {(() => {
                const presentCats = Array.from(new Set(lots.map(l => l.categorie)));
                const filteredCats = CATEGORIES.filter(c => presentCats.includes(c.val as Lot["categorie"]));
                if (filteredCats.length < 2) return null;
                return (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setActiveCategory(null); router.replace("/", { scroll: false }); }}
                      style={{
                        padding: "7px 16px", borderRadius: 980,
                        fontFamily: "inherit", fontWeight: 500, fontSize: 13,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: activeCategory === null ? "rgba(0,113,227,0.35)" : "rgba(0,0,0,0.1)",
                        background: activeCategory === null ? "rgba(0,113,227,0.07)" : "transparent",
                        color: activeCategory === null ? "#0071e3" : "#6b6b6b",
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
                          onClick={() => {
                            const next = active ? null : cat.val;
                            setActiveCategory(next);
                            router.replace(next ? `/?cat=${next}` : "/", { scroll: false });
                          }}
                          style={{
                            padding: "7px 16px", borderRadius: 980,
                            fontFamily: "inherit", fontWeight: 500, fontSize: 13,
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: active ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                            background: active ? "rgba(0,0,0,0.05)" : "transparent",
                            color: active ? "#111111" : "#6b6b6b",
                            transition: "all .15s",
                          }}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <LotGrid
              lots={activeCategory ? lotsSorted.filter(l => l.categorie === activeCategory) : lotsSorted}
              prochainTirageId={prochainTirage?.id}
            />
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
