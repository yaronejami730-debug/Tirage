"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import CountdownTimer from "./CountdownTimer";

interface LotCardProps {
  lot: Lot;
}

export default function LotCard({ lot }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const isUrgent = remaining <= 15 && remaining > 0;

  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : "#7c3aed";

  return (
    <div className="card flex flex-col group" style={{ cursor: "default" }}>

      {/* Image zone */}
      <div style={{ position: "relative", height: 220, overflow: "hidden", background: "linear-gradient(135deg, #4c1d95, #1e1b4b)" }}>
        {lot.image_url ? (
          <Image
            src={lot.image_url}
            alt={lot.nom}
            fill
            style={{ objectFit: "cover", transition: "transform .5s ease" }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.15)" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        )}

        {/* Dark overlay gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />

        {/* Urgency badge */}
        {isUrgent && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#ef4444", color: "white",
            fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
            animation: "pulse 2s infinite"
          }}>
            🔥 Plus que {remaining} !
          </div>
        )}

        {/* Countdown badge */}
        {lot.date_fin && !isSoldOut && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            borderRadius: 12, padding: "5px 10px",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <CountdownTimer dateFin={lot.date_fin} />
          </div>
        )}

        {/* Price badge */}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white", fontWeight: 800, fontSize: 15,
          padding: "6px 14px", borderRadius: 12,
          boxShadow: "0 3px 10px rgba(245,158,11,0.5)"
        }}>
          {Number(lot.prix_ticket).toFixed(2)} €
          <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.85, marginLeft: 4 }}>/ ticket</span>
        </div>

        {/* Sold out overlay */}
        {isSoldOut && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#ef4444", color: "white", fontWeight: 900, fontSize: 22,
              padding: "10px 28px", borderRadius: 16, transform: "rotate(-4deg)",
              boxShadow: "0 8px 30px rgba(239,68,68,0.6)", letterSpacing: 2
            }}>
              COMPLET
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontWeight: 800, fontSize: 17, color: "#111", lineHeight: 1.3, marginBottom: 6 }}>
          {lot.nom}
        </h3>
        {lot.description && (
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 14,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
            {lot.description}
          </p>
        )}

        {/* Progress */}
        <div style={{ marginTop: "auto", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: "#9ca3af" }}>{lot.tickets_vendus} vendus</span>
            <span style={{ color: isUrgent ? "#ef4444" : "#9ca3af", fontWeight: isUrgent ? 700 : 400 }}>
              {remaining > 0 ? `${remaining} restants` : "Complet"}
            </span>
          </div>
          <div style={{ height: 6, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: barColor,
              borderRadius: 999,
              transition: "width .5s ease"
            }} />
          </div>
        </div>

        {/* CTA */}
        {isSoldOut ? (
          <button disabled style={{
            width: "100%", padding: "12px", borderRadius: 14, border: "none",
            background: "#f3f4f6", color: "#9ca3af", fontWeight: 700, fontSize: 15, cursor: "not-allowed"
          }}>
            Complet
          </button>
        ) : (
          <Link href={`/lots/${lot.id}`} style={{
            display: "block", textAlign: "center", textDecoration: "none",
            width: "100%", padding: "13px", borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
            color: "white", fontWeight: 800, fontSize: 15,
            boxShadow: "0 4px 15px rgba(124,58,237,0.35)",
            transition: "all .2s ease"
          }}
          className="hover:shadow-xl active:scale-95"
          >
            🎟️ Participer
          </Link>
        )}
      </div>
    </div>
  );
}
