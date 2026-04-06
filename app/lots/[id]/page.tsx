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
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  useEffect(() => {
    supabaseClient.from("lots")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setGone(true);
        else {
          setLot(data);
          setActiveMedia(data.image_url || (data.medias?.[0] || null));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(0,0,0,0.08)", borderTopColor: "#1d1d1f", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (gone || !lot) return notFound();

  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  const isArchived = lot.statut !== "actif" && lot.statut !== "programme";
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 28px 100px" }}>

      <LotOnlineBadge lotId={id} />

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36, fontSize: 13 }}>
        <Link href="/" style={{ color: "#a1a1a6", textDecoration: "none", transition: "color .2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#1d1d1f"}
          onMouseLeave={e => e.currentTarget.style.color = "#a1a1a6"}
        >
          Lots
        </Link>
        <span style={{ color: "rgba(0,0,0,0.2)" }}>›</span>
        <span style={{ color: "#6e6e73", fontWeight: 500 }}>{lot.nom}</span>
      </div>

      <div className="lot-detail-grid">

        {/* ─── LEFT ─────────────────────────────────── */}
        <div>
          {/* Image principale */}
          <div style={{
            position: "relative", height: 480, borderRadius: 20, overflow: "hidden",
            marginBottom: 16, background: "#f5f5f7",
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            {activeMedia ? (
              isVideo(activeMedia) ? (
                <video src={activeMedia} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Image src={activeMedia} alt={lot.nom} fill style={{ objectFit: "cover" }} priority />
              )
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.1)", fontSize: 80 }}>
                ◇
              </div>
            )}

            {/* Countdown overlay */}
            {lot.date_fin && !isSoldOut && !isArchived && (
              <div style={{
                position: "absolute", bottom: 16, left: 16, right: 16,
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
                borderRadius: 14, padding: "12px 20px",
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
              }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Tirage dans
                </span>
                <CountdownTimer dateFin={lot.date_fin} />
              </div>
            )}
          </div>

          {/* Galerie miniatures */}
          {(lot.image_url || (lot.medias && lot.medias.length > 0)) && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {lot.image_url && (
                <div
                  onClick={() => setActiveMedia(lot.image_url)}
                  style={{
                    position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden",
                    cursor: "pointer",
                    border: `2px solid ${activeMedia === lot.image_url ? "#1d1d1f" : "rgba(0,0,0,0.07)"}`,
                    background: "#f5f5f7", transition: "border-color .2s",
                    flexShrink: 0,
                  }}
                >
                  <img src={lot.image_url} alt="Main" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              {lot.medias?.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setActiveMedia(url)}
                  style={{
                    position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden",
                    cursor: "pointer", flexShrink: 0,
                    border: `2px solid ${activeMedia === url ? "#1d1d1f" : "rgba(0,0,0,0.07)"}`,
                    background: "#f5f5f7", transition: "border-color .2s",
                  }}
                >
                  {isVideo(url) ? (
                    <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={url} alt={`media-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info card */}
          <div style={{
            background: "#ffffff", borderRadius: 16, padding: "28px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <h1 style={{
              fontSize: 22, fontWeight: 600, color: "#1d1d1f",
              letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1.3,
            }}>
              {lot.nom}
            </h1>

            {lot.valeur_estimee && (
              <p style={{ fontSize: 13, color: "#6e6e73", marginBottom: 16 }}>
                Valeur estimée — <span style={{ color: "#8a6000", fontWeight: 600 }}>{Number(lot.valeur_estimee).toLocaleString("fr-FR")} €</span>
              </p>
            )}

            {/* Urgence */}
            {!isSoldOut && !isProgramme && remaining > 0 && remaining < 15 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,59,48,0.06)", padding: "10px 14px",
                borderRadius: 10, border: "1px solid rgba(215,0,21,0.12)",
                marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3b30", flexShrink: 0, animation: "pulse-dot 1.5s infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#d70015" }}>
                  Il reste <strong>{remaining}</strong> ticket{remaining > 1 ? "s" : ""} disponible{remaining > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {lot.description && (
              <p style={{ color: "#6e6e73", fontSize: 14, lineHeight: 1.8, fontWeight: 400 }}>
                {lot.description}
              </p>
            )}
          </div>
        </div>

        {/* ─── RIGHT — formulaire ───────────────────── */}
        <div className="lot-form-sticky" style={{ position: "sticky", top: 80 }}>
          {isProgramme ? (
            <div style={{ background: "#ffffff", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                Prochainement
              </div>
              <p style={{ color: "#6e6e73", fontSize: 14, marginBottom: 24 }}>Ce tirage n&apos;est pas encore ouvert.</p>
              {lot.date_ouverture && (
                <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 12, padding: 20, marginBottom: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Ouverture dans</div>
                  <CountdownTimer dateFin={lot.date_ouverture} />
                </div>
              )}
              <Link href="/" className="btn-outline" style={{ display: "inline-flex" }}>← Retour aux lots</Link>
            </div>
          ) : isArchived ? (
            <div style={{ background: "#ffffff", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                Tirage terminé
              </div>
              <p style={{ color: "#6e6e73", fontSize: 14, marginBottom: 28 }}>La période de participation est clôturée.</p>
              <Link href="/" className="btn-outline" style={{ display: "inline-flex" }}>← Retour aux lots</Link>
            </div>
          ) : isSoldOut ? (
            <div style={{ background: "#ffffff", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                Complet
              </div>
              <p style={{ color: "#6e6e73", fontSize: 14, marginBottom: 28 }}>Tous les tickets ont été vendus.</p>
              <Link href="/" className="btn-outline" style={{ display: "inline-flex" }}>← Retour aux lots</Link>
            </div>
          ) : (
            <div style={{ background: "#ffffff", borderRadius: 20, padding: 28, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                  GoWinGo
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 2 }}>
                  Choisissez vos tickets
                </h2>
                <p style={{ color: "#a1a1a6", fontSize: 12 }}>Paiement sécurisé · Confirmation par email</p>
              </div>
              <ParticipationForm
                lotId={lot.id}
                lotNom={lot.nom}
                lotImage={lot.image_url}
                prixTicket={Number(lot.prix_ticket)}
                maxTickets={Math.min(remaining, 50)}
                totalTickets={lot.total_tickets}
                packs={lot.packs}
                valeurEstimee={lot.valeur_estimee}
              />
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
                {["Paiement sécurisé", "Certifié huissier", "Email immédiat"].map(b => (
                  <span key={b} style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 500 }}>{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  );
}
