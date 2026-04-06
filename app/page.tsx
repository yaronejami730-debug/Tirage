"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseClient, Lot } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import LotGrid from "@/components/LotGrid";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div style={{ scrollBehavior: "smooth" }}>
      {/* ─── HERO ─────────────────────────────────────── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "120px 28px 140px",
        background: "#0a0a0b",
        color: "#ffffff",
      }}>
        {/* Abstract Background Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }} 
        />

        {/* Decorative mask */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "40%",
          background: "linear-gradient(to top, #ffffff 0%, transparent 100%)",
          zIndex: 1,
        }} />

        <div style={{ 
          maxWidth: 900, margin: "0 auto", textAlign: "center",
          position: "relative", zIndex: 10,
        }}>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Eyebrow / Trust Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 32, padding: "8px 20px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 99,
            }}>
              <span style={{ 
                width: 8, height: 8, borderRadius: "50%", 
                background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", 
                display: "inline-block",
                boxShadow: "0 0 12px #4F8CFF"
              }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>
                Tirages certifiés · Paiement 100% sécurisé
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(44px, 7vw, 84px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              marginBottom: 24,
            }}>
              Tentez votre chance
              <br />
              <span style={{ 
                background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 400
              }}>
                sur des lots d'exception
              </span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.6)", 
              fontSize: "clamp(16px, 2.5vw, 19px)",
              fontWeight: 400, lineHeight: 1.6, 
              maxWidth: 580, margin: "0 auto 48px",
            }}>
              Vivez l'adrénaline de nos tirages exclusifs. 
              Une sélection rigoureuse de produits premium, encadrée par huissier.
            </p>

            <div>
              <a 
                href="#lots" 
                onClick={handleSmoothScroll}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", color: "#ffffff",
                  fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em",
                  padding: "18px 40px", borderRadius: 980, textDecoration: "none",
                  transition: "all .3s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: "0 10px 40px rgba(79,140,255,0.35)",
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; 
                  e.currentTarget.style.boxShadow = "0 15px 50px rgba(79,140,255,0.5)"; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = "translateY(0) scale(1)"; 
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(79,140,255,0.35)"; 
                }}
              >
                Découvrir les lots
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Trust indicators */}
            <div style={{ 
              marginTop: 64, 
              display: "flex", justifyContent: "center", gap: 40,
              opacity: 0.7
            }}>
              {[
                { label: "Certifié par Huissier", icon: "⚖️" },
                { label: "Paiement Stripe", icon: "💳" },
                { label: "Support 7j/7", icon: "💬" }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── LOTS ─────────────────────────────────────── */}
      <motion.div 
        id="lots" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          maxWidth: 1200, margin: "0 auto", 
          padding: "80px 28px 100px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
            <div className="spin" style={{ width: 32, height: 32, border: "2px solid rgba(0,0,0,0.08)", borderTopColor: "#4F8CFF", borderRadius: "50%" }} />
          </div>
        ) : lots.length === 0 ? (
          <div style={{ textAlign: "center", padding: 100, background: "#f8f8fa", borderRadius: 32, border: "1px dashed rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#a1a1a6", letterSpacing: "0.05em", marginBottom: 16, textTransform: "uppercase" }}>
              Aucun lot en cours
            </div>
            <p style={{ color: "#a1a1a6", fontSize: 15, fontWeight: 400 }}>Revenez bientôt pour nos prochains tirages d'exception.</p>
          </div>
        ) : (
          <>
            {/* Header section */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#111111", letterSpacing: "-0.04em", marginBottom: 8 }}>
                  Explorer les lots
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ 
                    fontSize: 13, color: "#4F8CFF", fontWeight: 600,
                    background: "rgba(79,140,255,0.08)", padding: "4px 10px", borderRadius: 6
                  }}>
                    {lots.length} Tirages Actifs
                  </span>
                  <span style={{ fontSize: 13, color: "#a1a1a6", fontWeight: 400 }}>
                    · {lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0)} tickets restants
                  </span>
                </div>
              </div>

              {/* Filtres catégories */}
              {(() => {
                const presentCats = Array.from(new Set(lots.map(l => l.categorie)));
                const filteredCats = CATEGORIES.filter(c => presentCats.includes(c.val as Lot["categorie"]));
                if (filteredCats.length < 2) return null;
                return (
                  <div style={{ 
                    display: "flex", gap: 8, flexWrap: "wrap",
                    background: "#f1f1f3", padding: 6, borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.03)"
                  }}>
                    <button
                      onClick={() => { setActiveCategory(null); router.replace("/", { scroll: false }); }}
                      style={{
                        padding: "8px 18px", borderRadius: 10,
                        fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                        cursor: "pointer", border: "none",
                        background: activeCategory === null ? "#ffffff" : "transparent",
                        color: activeCategory === null ? "#111111" : "#6b6b6b",
                        boxShadow: activeCategory === null ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                        transition: "all .2s cubic-bezier(0.16,1,0.3,1)",
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
                            padding: "8px 18px", borderRadius: 10,
                            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                            cursor: "pointer", border: "none",
                            background: active ? "#ffffff" : "transparent",
                            color: active ? "#111111" : "#6b6b6b",
                            boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                            transition: "all .2s cubic-bezier(0.16,1,0.3,1)",
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
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
