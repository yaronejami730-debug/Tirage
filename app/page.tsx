"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import LotGrid from "@/components/LotGrid";
import { Lot } from "@/lib/supabase";

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient()
      .from("lots")
      .select("*")
      .eq("statut", "actif")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLots(data || []);
        setLoading(false);
      });
  }, []);

  const totalTickets = lots.reduce((a, l) => a + l.total_tickets, 0);
  const ticketsRestants = lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0);

  return (
    <div>
      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1e0a3c 0%, #2d1258 40%, #1a1035 100%)",
        padding: "72px 24px 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(124,58,237,0.25)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(79,70,229,0.2)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>

          {/* Pill badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 28,
            color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Tirages certifiés · Résultats par huissier indépendant
          </div>

          <h1 style={{
            color: "white", fontWeight: 900, fontSize: "clamp(36px, 6vw, 62px)",
            lineHeight: 1.1, marginBottom: 20, letterSpacing: -1
          }}>
            Gagnez des lots{" "}
            <span style={{
              background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              incroyables
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.6, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Choisissez vos tickets, participez au tirage et tentez de remporter des prix d'exception. Simple, rapide, sécurisé.
          </p>

          {/* Stats */}
          {!loading && (
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              {[
                { val: lots.length, label: "Lots actifs", color: "#a78bfa" },
                { val: totalTickets, label: "Tickets disponibles", color: "#fbbf24" },
                { val: ticketsRestants, label: "Places restantes", color: "#4ade80" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 18, padding: "16px 28px", textAlign: "center", minWidth: 110
                }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LOTS */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : lots.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎟️</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#374151", marginBottom: 8 }}>Aucun lot en cours</h2>
            <p style={{ color: "#9ca3af" }}>Revenez bientôt pour nos prochains tirages !</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111" }}>Lots en cours</h2>
              <span style={{
                background: "rgba(124,58,237,0.1)", color: "#7c3aed",
                fontWeight: 700, fontSize: 13, padding: "3px 12px", borderRadius: 999
              }}>
                {lots.length} actif{lots.length > 1 ? "s" : ""}
              </span>
            </div>
            <LotGrid lots={lots} />
          </>
        )}
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: "white", borderTop: "1px solid #f3f4f6", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 48 }}>
            Comment ça marche ?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { emoji: "🎟️", title: "1. Achetez vos tickets", desc: "Choisissez un lot, sélectionnez le nombre de tickets et payez en toute sécurité via Stripe." },
              { emoji: "⏳", title: "2. Attendez le tirage", desc: "À la clôture du lot, un tirage est effectué par un huissier de justice indépendant." },
              { emoji: "🏆", title: "3. Réclamez votre gain", desc: "Le gagnant est notifié par email et reçoit son lot dans les meilleurs délais." },
            ].map(step => (
              <div key={step.title} style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 16px"
                }}>{step.emoji}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "#111", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }
      `}</style>
    </div>
  );
}
