"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient, Lot } from "@/lib/supabase";
import ParticipationForm from "@/components/ParticipationForm";
import CountdownTimer from "@/components/CountdownTimer";
import LotOnlineBadge from "@/components/LotOnlineBadge";

interface Props { params: Promise<{ id: string }>; }

export default function LotDetailPage({ params }: Props) {
  const { id } = use(params);
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    supabaseClient().from("lots").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (error || !data) setGone(true);
        else setLot(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 44, height: 44, border: "4px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (gone || !lot) return notFound();

  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  const isArchived = lot.statut !== "actif" && lot.statut !== "programme";
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const barColor = pct >= 90 ? "#E17055" : pct >= 70 ? "#FDCB6E" : "#00B894";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

      {/* Badges joueurs en ligne */}
      <LotOnlineBadge lotId={id} />

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13 }}>
        <Link href="/" style={{ color: "#6C5CE7", textDecoration: "none", fontWeight: 700 }}>🎁 Lots</Link>
        <span style={{ color: "#b2bec3" }}>›</span>
        <span style={{ color: "#2D3436", fontWeight: 700 }}>{lot.nom}</span>
      </div>

      <div className="lot-detail-grid">

        {/* LEFT */}
        <div>
          {/* Image */}
          <div style={{ position: "relative", height: 480, borderRadius: 32, overflow: "hidden", marginBottom: 24, boxShadow: "0 22px 70px rgba(108,92,231,0.22)", background: "linear-gradient(135deg, #f0eeff, #fff0f6)" }}>
            {lot.image_url ? (
              <Image src={lot.image_url} alt={lot.nom} fill style={{ objectFit: "cover" }} priority />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>
                🎁
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />

            {/* Countdown */}
            {lot.date_fin && !isSoldOut && (
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
                borderRadius: 16, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <span>⏰</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700 }}>Tirage dans :</span>
                <CountdownTimer dateFin={lot.date_fin} />
              </div>
            )}

            {/* Ref */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "5px 12px", color: "#A29BFE",
              fontSize: 12, fontWeight: 800, border: "1px solid rgba(255,255,255,0.15)"
            }}>
              🏷️ {lot.reference_lot}
            </div>
          </div>

          {/* Galerie médias */}
          {lot.medias && lot.medias.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {lot.medias.map((url, i) => {
                  const vid = /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
                  return (
                    <div key={i} style={{ position: "relative", width: 100, height: 100, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: "2px solid #f0eeff", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      {vid ? (
                        <video src={url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <img src={url} alt={`media-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      {vid && (
                        <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "2px 6px", fontSize: 10, color: "white", fontWeight: 700 }}>▶</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info card */}
          <div style={{ background: "white", borderRadius: 24, padding: 24, border: "2px solid #f0eeff", boxShadow: "0 4px 20px rgba(108,92,231,0.08)" }}>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#2D3436", marginBottom: 10, lineHeight: 1.2 }}>
              {lot.nom}
            </h1>
            {lot.description && (
              <p style={{ fontFamily: "'Nunito', sans-serif", color: "#636E72", lineHeight: 1.75, fontSize: 15, marginBottom: 20, fontWeight: 600 }}>
                {lot.description}
              </p>
            )}

            {/* Stats grid */}
            <div className="stats-grid-3">
              {[
                {
                  label: "Prix / ticket",
                  val: `${Number(lot.prix_ticket).toFixed(2)} €`,
                  bg: "linear-gradient(135deg, #fff9e6, #fffbee)",
                  color: "#e6a817",
                  border: "#FDCB6E",
                  icon: "💰",
                },
                {
                  label: remaining <= 0 ? "Complet" : "Tickets restants",
                  val: remaining > 0 ? remaining : "—",
                  bg: remaining <= 10 ? "linear-gradient(135deg, #fff3f0, #fff8f6)" : "linear-gradient(135deg, #f0fff8, #eafff4)",
                  color: remaining <= 10 ? "#E17055" : "#00B894",
                  border: remaining <= 10 ? "#E17055" : "#00B894",
                  icon: "🎫",
                },
                {
                  label: "Total tickets",
                  val: lot.total_tickets,
                  bg: "linear-gradient(135deg, #f0eeff, #f5f0ff)",
                  color: "#6C5CE7",
                  border: "#A29BFE",
                  icon: "📊",
                },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: "14px 10px", textAlign: "center", border: `2px solid ${s.border}33` }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#636E72", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Valeur estimée */}
            {lot.valeur_estimee && (
              <div style={{ background: "linear-gradient(135deg, #fff9e6, #fffbee)", borderRadius: 16, padding: "14px 18px", marginBottom: 16, border: "2px solid #FDCB6E55", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>💎</span>
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: "#b2bec3", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Valeur estimée du lot</div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#e6a817" }}>{Number(lot.valeur_estimee).toFixed(0)} €</div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: "#636E72", marginBottom: 8 }}>
                <span>{lot.tickets_vendus} vendus</span>
                <span style={{ color: barColor }}>{Math.round(pct)}% rempli</span>
              </div>
              <div style={{ height: 10, background: "#f0eeff", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .5s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="lot-form-sticky" style={{ position: "sticky", top: 84 }}>
          {isProgramme ? (
            <div style={{ background: "white", borderRadius: 28, padding: 40, textAlign: "center", border: "2px solid #f0eeff", boxShadow: "0 8px 40px rgba(108,92,231,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "center" }}>
                <div style={{ position: "relative", width: 44, height: 44, borderRadius: 12, border: "1px solid #f0eeff", background: "white", padding: 4, flexShrink: 0 }}>
                  <img src="/images/logo-gowingo.png" alt="GoWinGo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#6C5CE7", marginBottom: 0 }}>Prochainement</h3>
              </div>
              <p style={{ color: "#636E72", fontSize: 14, marginBottom: 20 }}>Ce tirage n&apos;est pas encore ouvert.</p>
              {lot.date_ouverture && (
                <div style={{ background: "#f8f7ff", borderRadius: 16, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#A29BFE", fontWeight: 700, marginBottom: 8 }}>OUVERTURE DANS</div>
                  <CountdownTimer dateFin={lot.date_ouverture} />
                </div>
              )}
              <Link href="/" className="btn-fun">← Voir les autres lots</Link>
            </div>
          ) : isArchived ? (
            <div style={{ background: "white", borderRadius: 28, padding: 40, textAlign: "center", border: "2px solid #f0eeff", boxShadow: "0 8px 40px rgba(108,92,231,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "center" }}>
                <div style={{ position: "relative", width: 44, height: 44, borderRadius: 12, border: "1px solid #f0eeff", background: "white", padding: 4, flexShrink: 0 }}>
                  <img src="/images/logo-gowingo.png" alt="GoWinGo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#2D3436", marginBottom: 0 }}>Tirage terminé</h3>
              </div>
              <p style={{ color: "#636E72", fontSize: 14, marginBottom: 24 }}>La période de participation est clôturée.</p>
              <Link href="/" className="btn-fun">← Voir les autres lots</Link>
            </div>
          ) : isSoldOut ? (
            <div style={{ background: "white", borderRadius: 28, padding: 40, textAlign: "center", border: "2px solid #fff3f0", boxShadow: "0 8px 40px rgba(225,112,85,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "center" }}>
                <div style={{ position: "relative", width: 44, height: 44, borderRadius: 12, border: "1px solid #f0eeff", background: "white", padding: 4, flexShrink: 0 }}>
                  <img src="/images/logo-gowingo.png" alt="GoWinGo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#2D3436", marginBottom: 0 }}>Complet !</h3>
              </div>
              <p style={{ color: "#636E72", fontSize: 14, marginBottom: 24 }}>Tous les tickets ont été vendus.</p>
              <Link href="/" className="btn-fun">← Voir les autres lots</Link>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 28, padding: 28, border: "2px solid #f0eeff", boxShadow: "0 12px 50px rgba(108,92,231,0.15)" }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ position: "relative", width: 120, height: 60, borderRadius: 12, border: "1.5px solid #f0eeff", background: "white", padding: 6, flexShrink: 0, boxShadow: "0 6px 15px rgba(108,92,231,0.12)" }}>
                    <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 21, color: "#2D3436", marginBottom: 2 }}>
                      Choisissez vos tickets
                    </h2>
                    <p style={{ color: "#636E72", fontSize: 12, margin: 0 }}>Paiement sécurisé · Confirmation email immédiate</p>
                  </div>
                </div>
              </div>
              <ParticipationForm
                lotId={lot.id}
                lotNom={lot.nom}
                prixTicket={Number(lot.prix_ticket)}
                maxTickets={Math.min(remaining, 50)}
              />
              {/* Trust */}
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
                {["🔒 Paiement sécurisé", "✅ Tirage certifié", "📧 Email immédiat"].map(b => (
                  <span key={b} style={{ fontSize: 11, color: "#b2bec3", fontWeight: 700 }}>{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
