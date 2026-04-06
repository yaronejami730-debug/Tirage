"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import CountdownTimer from "./CountdownTimer";

interface LotCardProps { lot: Lot; isProchain?: boolean; }

export default function LotCard({ lot, isProchain = false }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const isUrgent = remaining <= 10 && remaining > 0;
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  const isNew = lot.created_at
    ? Date.now() - new Date(lot.created_at).getTime() < 48 * 60 * 60 * 1000
    : false;

  return (
    <Link href={`/lots/${lot.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="lot-card flex flex-col group" style={{ position: "relative" }}>

        {/* Badges absolus */}
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, display: "flex", gap: 6 }}>
          {isProchain && (
            <span style={{
              background: "#8a6000", color: "#ffffff",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
            }}>
              Prochain tirage
            </span>
          )}
          {isNew && !isProgramme && (
            <span style={{
              background: "rgba(255,255,255,0.9)", color: "#1d1d1f",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
              textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.08)",
            }}>
              Nouveau
            </span>
          )}
          {isUrgent && !isSoldOut && (
            <span style={{
              background: "rgba(255,59,48,0.1)", color: "#d70015",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
              textTransform: "uppercase", padding: "4px 10px", borderRadius: 6,
              border: "1px solid rgba(215,0,21,0.15)",
            }}>
              Presque complet
            </span>
          )}
        </div>

        {/* Prix */}
        {!isProgramme && !isSoldOut && (
          <div style={{
            position: "absolute", top: 14, right: 14, zIndex: 10,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
            color: "#8a6000", fontSize: 13, fontWeight: 600,
            padding: "5px 12px", borderRadius: 8,
            border: "1px solid rgba(138,96,0,0.15)",
            letterSpacing: "-0.01em",
          }}>
            {Number(lot.prix_ticket) % 1 === 0
              ? `${Number(lot.prix_ticket).toFixed(0)} €`
              : `${Number(lot.prix_ticket).toFixed(2)} €`}
            <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>/ticket</span>
          </div>
        )}

        {/* IMAGE */}
        <div style={{
          position: "relative", height: 260, overflow: "hidden",
          background: "#f5f5f7",
        }}>
          {lot.image_url ? (
            <Image
              src={lot.image_url} alt={lot.nom} fill
              style={{ objectFit: "cover", transition: "transform .6s cubic-bezier(0.16,1,0.3,1)" }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "rgba(0,0,0,0.1)", fontSize: 48,
            }}>
              ◇
            </div>
          )}

          {/* Gradient bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: "linear-gradient(to top, rgba(255,255,255,0.5), transparent)",
          }} />

          {/* Prochainement overlay */}
          {isProgramme && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(251,251,253,0.80)", backdropFilter: "blur(4px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <span style={{
                background: "rgba(255,255,255,0.95)", color: "#6e6e73",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "6px 18px", borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
              }}>
                Prochainement
              </span>
              {lot.date_ouverture && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#a1a1a6", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ouverture dans</div>
                  <CountdownTimer dateFin={lot.date_ouverture} />
                </div>
              )}
            </div>
          )}

          {/* Sold out overlay */}
          {isSoldOut && !isProgramme && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(251,251,253,0.80)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                color: "#a1a1a6", fontSize: 12,
                fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
              }}>
                Complet
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div style={{ padding: "20px 20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Countdown */}
          {lot.date_fin && !isSoldOut && !isProgramme && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <span style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 }}>
                Fin dans
              </span>
              <CountdownTimer dateFin={lot.date_fin} />
            </div>
          )}

          {/* Title */}
          <div>
            <h3 style={{
              fontWeight: 600, fontSize: 15, color: "#1d1d1f",
              lineHeight: 1.4, margin: 0, letterSpacing: "-0.01em",
            }}>
              {lot.nom}
            </h3>
            {lot.valeur_estimee && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a1a1a6", fontWeight: 400 }}>
                Valeur estimée — {Number(lot.valeur_estimee).toLocaleString("fr-FR")} €
              </p>
            )}
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 500 }}>
                {lot.tickets_vendus} / {lot.total_tickets} tickets
              </span>
              <span style={{ fontSize: 11, color: pct >= 90 ? "#d70015" : "#a1a1a6", fontWeight: 600 }}>
                {Math.round(pct)}%
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(0,0,0,0.07)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: pct >= 90 ? "#ff3b30" : "#1d1d1f",
                width: `${pct}%`,
                transition: "width .6s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: "auto" }}>
            {isProgramme ? (
              <div style={{
                width: "100%", padding: "11px", borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#a1a1a6", fontSize: 13, fontWeight: 500,
                textAlign: "center",
              }}>
                Bientôt disponible
              </div>
            ) : isSoldOut ? (
              <div style={{
                width: "100%", padding: "11px", borderRadius: 10,
                background: "rgba(0,0,0,0.03)",
                color: "#a1a1a6", fontSize: 13, fontWeight: 500,
                textAlign: "center",
              }}>
                Complet
              </div>
            ) : (
              <div style={{
                width: "100%", padding: "12px", borderRadius: 10, textAlign: "center",
                background: "#1d1d1f", color: "#ffffff",
                fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em",
                transition: "background .2s",
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
