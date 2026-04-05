"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseClient, Lot } from "@/lib/supabase";
import LotGrid from "@/components/LotGrid";

const FLOATING_EMOJIS = ["🎁", "🎫", "⭐", "🏆", "🎉", "🎊", "💎", "🎯"];

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient().from("lots").select("*").in("statut", ["actif", "programme"])
      .order("created_at", { ascending: false })
      .then(({ data }) => { setLots(data || []); setLoading(false); });
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", padding: "clamp(40px, 8vw, 70px) clamp(16px, 5vw, 24px) clamp(48px, 8vw, 80px)", background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 40%, #FD79A8 70%, #FDCB6E 100%)" }}>

        {/* Floating emoji */}
        {FLOATING_EMOJIS.map((e, i) => (
          <div key={i} style={{
            position: "absolute", fontSize: `${20 + (i % 3) * 10}px`,
            top: `${10 + (i * 11) % 75}%`,
            left: `${(i * 13) % 90}%`,
            opacity: 0.18,
            animation: `float ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            pointerEvents: "none"
          }}>{e}</div>
        ))}

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 16px",
            color: "white", fontSize: 13, fontWeight: 800, marginBottom: 24, border: "1px solid rgba(255,255,255,0.3)"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00B894", display: "inline-block" }} />
            {lots.length} lot{lots.length > 1 ? "s" : ""} actif{lots.length > 1 ? "s" : ""} en ce moment !
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", width: 120, height: 80, borderRadius: 20, overflow: "hidden", background: "white", padding: 6, boxShadow: "0 15px 40px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.4)" }}>
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
            Tentez votre chance !
          </h1>

          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600, marginBottom: 36, lineHeight: 1.6 }}>
            Achetez vos tickets et remportez des lots incroyables !<br className="hero-br" />
            {" "}Simple, rapide, et certifié huissier. 🏆
          </p>

          <a href="#lots" className="btn-gold" style={{ fontSize: 17, padding: "16px 36px" }}>
            Voir les lots ✨
          </a>

          {/* Stats */}
          {!loading && lots.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
              {[
                { val: lots.length, label: "Lots actifs", bg: "rgba(255,255,255,0.15)" },
                { val: lots.reduce((a, l) => a + l.total_tickets, 0), label: "Tickets dispo", bg: "rgba(255,255,255,0.15)" },
                { val: lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0), label: "Places restantes", bg: "rgba(255,255,255,0.15)" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: "14px 22px", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "white" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#2D3436" }}>🎁 Lots à gagner</h2>
              <span style={{ background: "#f0eeff", color: "#6C5CE7", fontWeight: 800, fontSize: 13, padding: "4px 14px", borderRadius: 999 }}>
                {lots.length} actif{lots.length > 1 ? "s" : ""}
              </span>
            </div>
            <LotGrid lots={lots} />
          </>
        )}
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ background: "white", borderTop: "2px solid #f0eeff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#2D3436", marginBottom: 12 }}>
            ❓ Comment jouer ?
          </h2>
          <p style={{ color: "#636E72", fontSize: 15, marginBottom: 48 }}>3 étapes simples pour tenter votre chance !</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {[
              { emoji: "🔍", color: "#6C5CE7", bg: "#f0eeff", title: "1. Choisissez", desc: "Parcourez nos lots disponibles et choisissez celui qui vous fait rêver !" },
              { emoji: "🎫", color: "#FD79A8", bg: "#fff0f6", title: "2. Achetez", desc: "Sélectionnez le nombre de tickets, remplissez votre nom et payez en sécurité." },
              { emoji: "🏆", color: "#FDCB6E", bg: "#fffbee", title: "3. Gagnez !", desc: "Au tirage, si votre ticket est tiré, on vous contacte et vous recevez votre lot !" },
            ].map(step => (
              <div key={step.title} style={{ padding: "28px 20px", borderRadius: 24, background: step.bg, border: `2px solid ${step.color}22` }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>{step.emoji}</div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: step.color, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#636E72", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
      `}</style>
    </div>
  );
}
