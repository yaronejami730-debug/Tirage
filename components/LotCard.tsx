"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import CountdownTimer from "./CountdownTimer";

interface LotCardProps { lot: Lot; isProchain?: boolean; }

export default function LotCard({ lot, isProchain = false }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const isUrgent = remaining <= 10 && remaining > 0;
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  const isNew = lot.created_at
    ? Date.now() - new Date(lot.created_at).getTime() < 48 * 60 * 60 * 1000
    : false;

  return (
    <Link href={`/lots/${lot.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="lot-card flex flex-col group">

        {/* ── IMAGE ───────────────────────────────── */}
        <div style={{ position: "relative", height: 260, overflow: "hidden", background: "#f8f8fa" }}>
          {lot.image_url ? (
            <Image
              src={lot.image_url} alt={lot.nom} fill
              style={{ objectFit: "cover", transition: "transform .6s cubic-bezier(0.16,1,0.3,1)" }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.1)", fontSize: 48 }}>◇</div>
          )}

          {/* Gradient bas */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }} />

          {/* Badges — haut gauche */}
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {isProchain && (
              <span style={{
                background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", color: "#ffffff",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
                boxShadow: "0 2px 8px rgba(123,77,255,0.3)",
              }}>Prochain tirage</span>
            )}
            {isNew && !isProgramme && (
              <span style={{
                background: "rgba(255,255,255,0.92)", color: "#111111",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
                textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
                border: "1px solid rgba(0,0,0,0.1)",
              }}>Nouveau</span>
            )}
            {isUrgent && !isSoldOut && (
              <span style={{
                background: "rgba(255,59,48,0.12)", color: "#d70015",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
                textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
                border: "1px solid rgba(215,0,21,0.15)",
              }}>Presque complet</span>
            )}
          </div>

          {/* Prix — bas droite de l'image */}
          {!isProgramme && !isSoldOut && (
            <div style={{
              position: "absolute", bottom: 12, right: 12, zIndex: 10,
              background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
              color: "#111111", fontSize: 13, fontWeight: 700,
              padding: "5px 11px", borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)",
              letterSpacing: "-0.02em",
            }}>
              {Number(lot.prix_ticket) % 1 === 0
                ? `${Number(lot.prix_ticket).toFixed(0)} €`
                : `${Number(lot.prix_ticket).toFixed(2)} €`}
              <span style={{ fontSize: 11, color: "#a0a0a0", fontWeight: 400, marginLeft: 2 }}>/ticket</span>
            </div>
          )}

          {/* Overlay "Prochainement" */}
          {isProgramme && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <span style={{
                background: "#ffffff", color: "#6b6b6b",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "6px 18px", borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
              }}>Prochainement</span>
              {lot.date_ouverture && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ouverture dans</div>
                  <CountdownTimer dateFin={lot.date_ouverture} />
                </div>
              )}
            </div>
          )}

          {/* Overlay "Complet" */}
          {isSoldOut && !isProgramme && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.82)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#a0a0a0", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Complet</span>
            </div>
          )}
        </div>

        {/* ── CONTENU ─────────────────────────────── */}
        <div style={{ padding: "18px 20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Countdown */}
          {lot.date_fin && !isSoldOut && !isProgramme && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(0,0,0,0.025)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <span style={{ fontSize: 11, color: "#a0a0a0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 }}>
                Fin dans
              </span>
              <div style={{ flex: 1 }}>
                <CountdownTimer dateFin={lot.date_fin} />
              </div>
            </div>
          )}

          {/* Titre + description + valeur */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
            <h3 style={{ fontWeight: 600, fontSize: 15, color: "#111111", lineHeight: 1.4, margin: 0, letterSpacing: "-0.01em" }}>
              {lot.nom}
            </h3>
            {lot.description && (
              <p style={{
                margin: 0, fontSize: 13, color: "#6b6b6b", lineHeight: 1.6, fontWeight: 400,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              } as React.CSSProperties}>
                {lot.description}
              </p>
            )}
            {lot.valeur_estimee && (
              <p style={{ margin: 0, fontSize: 12, color: "#a0a0a0", fontWeight: 400 }}>
                Valeur estimée — {Number(lot.valeur_estimee).toLocaleString("fr-FR")} €
              </p>
            )}
          </div>

          {/* Urgence ≤ 10 tickets */}
          {!isSoldOut && !isProgramme && remaining <= 10 && remaining > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 12px", borderRadius: 8,
              background: "rgba(255,59,48,0.06)", border: "1px solid rgba(215,0,21,0.1)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3b30", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#d70015" }}>
                Il reste {remaining} ticket{remaining > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: "auto" }}>
            {isProgramme ? (
              <div style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", color: "#a0a0a0", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
                Bientôt disponible
              </div>
            ) : isSoldOut ? (
              <div style={{ width: "100%", padding: "11px", borderRadius: 10, background: "rgba(0,0,0,0.03)", color: "#a0a0a0", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
                Complet
              </div>
            ) : (
              <div style={{
                width: "100%", padding: "12px", borderRadius: 10, textAlign: "center",
                background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)",
                color: "#ffffff", fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                boxShadow: "0 4px 14px rgba(123,77,255,0.22)",
              }}>
                Participer
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
