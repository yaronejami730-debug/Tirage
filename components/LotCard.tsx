"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import { CATEGORY_MAP } from "@/lib/categories";
import CountdownTimer from "./CountdownTimer";

interface LotCardProps { lot: Lot; isProchain?: boolean; }

export default function LotCard({ lot, isProchain = false }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const isUrgent = remaining <= 15 && remaining > 0;
  const cat = lot.categorie || "autre";
  const catInfo = CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP] ?? CATEGORY_MAP["autre"];
  const catColor = catInfo.color;
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  const barColor = pct >= 90 ? "#E17055" : pct >= 70 ? "#FDCB6E" : "#00B894";
  const isNew = lot.created_at
    ? Date.now() - new Date(lot.created_at).getTime() < 48 * 60 * 60 * 1000
    : false;

  const cardInner = (
    <Link href={`/lots/${lot.id}`} style={{ textDecoration: "none", display: "block" }}>
    <div className="lot-card flex flex-col group" style={isProchain ? { position: "relative", zIndex: 1 } : undefined}>
      {/* IMAGE */}
      <div style={{ position: "relative", height: 300, overflow: "hidden", background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)` }}>

        {lot.image_url ? (
          <Image src={lot.image_url} alt={lot.nom} fill style={{ objectFit: "contain", padding: "8px" }} className="group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
            {catInfo.icon}
          </div>
        )}

        {/* Prix par ticket sur la photo */}
        {!isProgramme && (
          <div style={{
            position: "absolute", bottom: 12, left: 12, zIndex: 10,
            background: "linear-gradient(135deg, #FF7043, #FF8C42)",
            color: "white", fontFamily: "'Fredoka One', cursive",
            fontSize: 17, padding: "6px 14px",
            borderRadius: 22, letterSpacing: "0.3px",
            boxShadow: "0 4px 16px rgba(255,112,67,0.55)",
          }}>
            {Number(lot.prix_ticket) % 1 === 0
              ? `${Number(lot.prix_ticket).toFixed(0)} €`
              : `${Number(lot.prix_ticket).toFixed(2)} €`} / ticket
          </div>
        )}

        {/* PROCHAINEMENT overlay */}
        {isProgramme && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(45,52,54,0.7)", backdropFilter: "blur(3px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "16px",
          }}>
            <span style={{
              background: "#6C5CE7", color: "white",
              fontFamily: "'Fredoka One', cursive", fontSize: 22,
              padding: "8px 24px", borderRadius: 16, boxShadow: "0 8px 30px rgba(108,92,231,0.5)",
              marginBottom: 4,
            }}>🔜 Prochainement</span>
            {lot.date_ouverture && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: 6 }}>OUVERTURE DANS</div>
                <CountdownTimer dateFin={lot.date_ouverture} />
              </div>
            )}
          </div>
        )}

        {/* SOLD OUT overlay */}
        {isSoldOut && !isProgramme && (
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

        {/* 1. FIN DU TIRAGE — tout en haut */}
        {lot.date_fin && !isSoldOut && !isProgramme && (
          <div style={{ marginBottom: 14, background: "#fff7f5", borderRadius: 14, padding: "10px 8px", border: "1px solid #ffe0d8" }}>
            <div style={{ fontSize: 10, color: "#FF7043", fontWeight: 700, textTransform: "uppercase", textAlign: "center", marginBottom: 6, letterSpacing: "0.5px" }}>⏰ Fin du tirage</div>
            <CountdownTimer dateFin={lot.date_fin} />
          </div>
        )}

        {/* 2. Nom */}
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 17, color: "#2D3436", lineHeight: 1.3, marginBottom: 8, margin: "0 0 8px 0" }}>
          {lot.nom}
        </h3>

        {/* 3. Description avec fondu */}
        {lot.description && (
          <div style={{ position: "relative", maxHeight: 54, overflow: "hidden", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "#636E72", lineHeight: 1.65, margin: 0, fontFamily: "'Nunito', sans-serif" }}>
              {lot.description}
            </p>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 30,
              background: "linear-gradient(to bottom, transparent, white)"
            }} />
          </div>
        )}

        {/* 4. Urgent */}
        {isUrgent && !isSoldOut && (
          <div style={{ color: "#E17055", fontWeight: 800, fontSize: 11, marginBottom: 10, animation: "pulse 1.5s infinite" }}>
            🔥 Plus que {remaining} tickets !
          </div>
        )}

        {/* 5. Barre de progression */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: "#6C5CE7" }}>🎫 {remaining} restants</span>
            <span style={{ color: barColor }}>{Math.round(pct)}% vendus</span>
          </div>
          <div style={{ height: 8, background: "#f0eeff", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .5s" }} />
          </div>
        </div>

        {/* 6. Catégorie + NOUVEAU + numéro de lot */}
        <div style={{ marginTop: "auto", borderTop: "1px solid #f0eeff", paddingTop: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              background: `${catColor}18`, color: catColor,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 10,
              padding: "4px 10px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase"
            }}>
              {catInfo.icon} {catInfo.label}
            </div>
            {isNew && !isProgramme && (
              <div style={{
                background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                color: "white", fontFamily: "'Nunito', sans-serif",
                fontWeight: 900, fontSize: 10, padding: "4px 10px",
                borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase",
                boxShadow: "0 4px 12px rgba(108,92,231,0.4)",
              }}>
                ✨ Nouveau
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", width: 18, height: 18, borderRadius: 5, overflow: "hidden", background: "white", padding: 2, border: "1px solid #f0eeff", flexShrink: 0 }}>
              <img src="/images/logo-gowingo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#b2bec3", margin: 0, fontFamily: "'Nunito', sans-serif", letterSpacing: "1px" }}>
              #{lot.reference_lot}
            </p>
            {lot.valeur_estimee && (
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: "#636E72" }}>
                Valeur {Number(lot.valeur_estimee).toFixed(0)} €
              </span>
            )}
          </div>
        </div>

        {/* 7. CTA */}
        {isProgramme ? (
          <div style={{ width: "100%", padding: "12px", borderRadius: 14, background: "linear-gradient(135deg, #6C5CE722, #A29BFE22)", color: "#6C5CE7", fontWeight: 800, fontSize: 14, textAlign: "center", fontFamily: "'Nunito', sans-serif", border: "2px dashed #A29BFE" }}>
            🔜 Bientôt disponible
          </div>
        ) : isSoldOut ? (
          <div style={{ width: "100%", padding: "12px", borderRadius: 14, background: "#f8f9ff", color: "#b2bec3", fontWeight: 800, fontSize: 14, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
            😔 Complet
          </div>
        ) : (
          <div style={{
            display: "block", textAlign: "center",
            background: "linear-gradient(135deg, #FF7043, #FF8C42)",
            color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15,
            padding: "13px", borderRadius: 16,
            boxShadow: "0 6px 20px rgba(255,112,67,0.4)",
            transition: "all .2s ease"
          }}>
            JE TENTE MA CHANCE
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes rotateBorder { to { transform: rotate(360deg); } }
        @keyframes badgeFloat { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
      `}</style>
    </div>
  );

  if (!isProchain) return cardInner;

  return (
    <div style={{ position: "relative", marginTop: 18 }}>
      {/* Badge flottant — en dehors du overflow:hidden */}
      <div style={{
        position: "absolute", top: -16, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
        color: "white", fontFamily: "'Fredoka One', cursive",
        fontSize: 13, padding: "5px 18px", borderRadius: 999,
        boxShadow: "0 4px 16px rgba(108,92,231,0.5)",
        whiteSpace: "nowrap", letterSpacing: "0.5px",
        animation: "badgeFloat 2s ease-in-out infinite",
        pointerEvents: "none",
      }}>
        🎯 Prochain tirage
      </div>

      {/* Conteneur du liseré rotatif */}
      <div style={{ padding: 3, borderRadius: 27, overflow: "hidden", position: "relative" }}>
        {/* Gradient rotatif — semi-transparent */}
        <div style={{
          position: "absolute",
          inset: "-100%",
          background: "conic-gradient(from 0deg, #6C5CE7, #A29BFE, #FD79A8, #FDCB6E, #00B894, #6C5CE7)",
          animation: "rotateBorder 3s linear infinite",
          opacity: 0.55,
        }} />
        {/* La carte elle-même */}
        {cardInner}
      </div>
    </div>
  );
}
