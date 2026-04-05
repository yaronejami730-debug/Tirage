"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import CountdownTimer from "./CountdownTimer";

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Tech 📱", mode: "Mode 👜", gaming: "Gaming 🎮",
  maison: "Maison 🏠", luxe: "Luxe 💎", autre: "Autre 🎁",
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: "#6C5CE7", mode: "#FD79A8", gaming: "#00B894",
  maison: "#FDCB6E", luxe: "#E17055", autre: "#A29BFE",
};

interface LotCardProps { lot: Lot; }

export default function LotCard({ lot }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const isUrgent = remaining <= 15 && remaining > 0;
  const cat = lot.categorie || "autre";
  const catColor = CATEGORY_COLORS[cat] || "#A29BFE";

  const barColor = pct >= 90 ? "#E17055" : pct >= 70 ? "#FDCB6E" : "#00B894";

  return (
    <div className="lot-card flex flex-col">
      {/* IMAGE */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)` }}>
        {lot.image_url ? (
          <Image src={lot.image_url} alt={lot.nom} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
            {cat === "tech" ? "📱" : cat === "mode" ? "👜" : cat === "gaming" ? "🎮" : cat === "maison" ? "🏠" : cat === "luxe" ? "💎" : "🎁"}
          </div>
        )}

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />

        {/* Category badge — top left */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: catColor, color: "white",
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
          padding: "4px 10px", borderRadius: 20, boxShadow: `0 2px 8px ${catColor}66`
        }}>
          {CATEGORY_LABELS[cat]}
        </div>

        {/* Countdown — top right */}
        {lot.date_fin && !isSoldOut && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            borderRadius: 12, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", gap: 5
          }}>
            <span style={{ fontSize: 11 }}>⏰</span>
            <CountdownTimer dateFin={lot.date_fin} />
          </div>
        )}

        {/* Urgency — top right (below countdown if no date) */}
        {isUrgent && !isSoldOut && !lot.date_fin && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "#E17055", color: "white",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
            padding: "4px 10px", borderRadius: 20, animation: "pulse 1.5s infinite"
          }}>
            🔥 Plus que {remaining} !
          </div>
        )}

        {/* Price — bottom left */}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "linear-gradient(135deg, #FDCB6E, #f9a825)",
          color: "#2D3436", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 14,
          padding: "5px 12px", borderRadius: 20, boxShadow: "0 3px 10px rgba(253,203,110,0.5)"
        }}>
          {Number(lot.prix_ticket).toFixed(2)} € / ticket
        </div>

        {/* SOLD OUT */}
        {isSoldOut && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{
              background: "#E17055", color: "white",
              fontFamily: "'Fredoka One', cursive", fontSize: 24,
              padding: "10px 28px", borderRadius: 16, transform: "rotate(-4deg)",
              boxShadow: "0 8px 30px rgba(225,112,85,0.6)"
            }}>COMPLET</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Ref */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#A29BFE", marginBottom: 4, fontFamily: "'Nunito', sans-serif" }}>
          🏷️ {lot.reference_lot}
        </p>

        {/* Title */}
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 16, color: "#2D3436", lineHeight: 1.3, marginBottom: 6 }}>
          {lot.nom}
        </h3>

        {/* Description */}
        {lot.description && (
          <p style={{
            fontSize: 13, color: "#636E72", lineHeight: 1.5, marginBottom: 10,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const
          }}>
            {lot.description}
          </p>
        )}

        {/* Badges: tickets restants / valeur */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ background: "#f0eeff", color: "#6C5CE7", fontWeight: 800, fontSize: 12, padding: "4px 10px", borderRadius: 20, fontFamily: "'Nunito', sans-serif" }}>
            🎫 {remaining > 0 ? `${remaining} restants` : "Complet"}
          </span>
          {lot.valeur_estimee && (
            <span style={{ background: "#fff9e6", color: "#e6b455", fontWeight: 800, fontSize: 12, padding: "4px 10px", borderRadius: 20, fontFamily: "'Nunito', sans-serif" }}>
              💰 Valeur {Number(lot.valeur_estimee).toFixed(0)} €
            </span>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ height: 8, background: "#f0eeff", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .5s" }} />
          </div>
          <p style={{ fontSize: 11, color: "#b2bec3", marginTop: 4, fontFamily: "'Nunito', sans-serif", textAlign: "right" }}>
            {Math.round(pct)}% vendus
          </p>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "auto" }}>
          {isSoldOut ? (
            <div style={{ width: "100%", padding: "12px", borderRadius: 14, background: "#f8f9ff", color: "#b2bec3", fontWeight: 800, fontSize: 14, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
              😔 Complet
            </div>
          ) : (
            <Link href={`/lots/${lot.id}`} style={{
              display: "block", textAlign: "center", textDecoration: "none",
              background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
              color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15,
              padding: "13px", borderRadius: 16,
              boxShadow: "0 6px 20px rgba(108,92,231,0.35)",
              transition: "all .2s ease"
            }}>
              🎫 Acheter des tickets
            </Link>
          )}
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
