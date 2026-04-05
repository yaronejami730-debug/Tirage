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
  const isProgramme = lot.statut === "programme";
  const barColor = pct >= 90 ? "#E17055" : pct >= 70 ? "#FDCB6E" : "#00B894";

  return (
    <div className="lot-card flex flex-col group">
      {/* IMAGE (Clean version) */}
      <div style={{ position: "relative", height: 300, overflow: "hidden", background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)` }}>
        {lot.image_url ? (
          <Image src={lot.image_url} alt={lot.nom} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
            {cat === "tech" ? "📱" : cat === "mode" ? "👜" : cat === "gaming" ? "🎮" : cat === "maison" ? "🏠" : cat === "luxe" ? "💎" : "🎁"}
          </div>
        )}

        {/* PROCHAINEMENT overlay */}
        {isProgramme && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(45,52,54,0.65)", backdropFilter: "blur(3px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10
          }}>
            <span style={{
              background: "#6C5CE7", color: "white",
              fontFamily: "'Fredoka One', cursive", fontSize: 22,
              padding: "8px 24px", borderRadius: 16, boxShadow: "0 8px 30px rgba(108,92,231,0.5)"
            }}>🔜 Prochainement</span>
            {lot.date_ouverture && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: 6 }}>OUVERTURE DANS</div>
                <CountdownTimer dateFin={lot.date_ouverture} />
              </div>
            )}
          </div>
        )}

        {/* SOLD OUT Overlay only (keeps it clear when active) */}
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

      {/* CONTENT (Reorganized) */}
      <div style={{ padding: "20px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header Row: Category */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{
            background: `${catColor}15`, color: catColor,
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 10,
            padding: "4px 10px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase"
          }}>
            {CATEGORY_LABELS[cat]}
          </div>
          {isUrgent && !isSoldOut && (
            <div style={{ color: "#E17055", fontWeight: 800, fontSize: 11, animation: "pulse 1.5s infinite" }}>
              🔥 Plus que {remaining} !
            </div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ position: "relative", width: 22, height: 22, borderRadius: 6, overflow: "hidden", background: "white", padding: 2, border: "1px solid #f0eeff" }}>
              <img src="/images/logo-gowingo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#b2bec3", margin: 0, fontFamily: "'Nunito', sans-serif", letterSpacing: "1px" }}>
              #{lot.reference_lot}
            </p>
          </div>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 17, color: "#2D3436", lineHeight: 1.3 }}>
            {lot.nom}
          </h3>
        </div>

        {/* Countdown */}
        {lot.date_fin && !isSoldOut && (
          <div style={{ marginBottom: 14, background: "#f8f7ff", borderRadius: 14, padding: "10px 8px" }}>
            <div style={{ fontSize: 10, color: "#FF7043", fontWeight: 700, textTransform: "uppercase", textAlign: "center", marginBottom: 6, letterSpacing: "0.5px" }}>⏰ Fin du tirage</div>
            <CountdownTimer dateFin={lot.date_fin} />
          </div>
        )}

        {/* Pricing */}
        <div style={{
          background: "#F8F9FF", border: "1.5px dashed #e8e4fa", borderRadius: 16,
          padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 16
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#b2bec3", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Prix du ticket</div>
            <div style={{ color: "#6C5CE7", fontWeight: 900, fontSize: 22, fontFamily: "'Fredoka One', cursive" }}>
              {Number(lot.prix_ticket).toFixed(2)} €
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
             <div style={{ fontSize: 10, color: "#b2bec3", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Valeur lot</div>
             <div style={{ color: "#2D3436", fontWeight: 800, fontSize: 14 }}>
               {lot.valeur_estimee ? `${Number(lot.valeur_estimee).toFixed(0)} €` : "—"}
             </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, fontWeight: 700 }}>
             <span style={{ color: "#6C5CE7" }}>🎫 {remaining} tickets restants</span>
             <span style={{ color: barColor }}>{Math.round(pct)}% vendus</span>
          </div>
          <div style={{ height: 8, background: "#f0eeff", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .5s" }} />
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "auto" }}>
          {isProgramme ? (
            <div style={{ width: "100%", padding: "12px", borderRadius: 14, background: "linear-gradient(135deg, #6C5CE722, #A29BFE22)", color: "#6C5CE7", fontWeight: 800, fontSize: 14, textAlign: "center", fontFamily: "'Nunito', sans-serif", border: "2px dashed #A29BFE" }}>
              🔜 Bientôt disponible
            </div>
          ) : isSoldOut ? (
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
              JE TENTE MA CHANCE
            </Link>
          )}
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
