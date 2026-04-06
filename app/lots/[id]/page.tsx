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

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);

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
          {/* Image Principale Rehaussée */}
          <div style={{ position: "relative", height: 500, borderRadius: 32, overflow: "hidden", marginBottom: 20, boxShadow: "0 22px 70px rgba(108,92,231,0.18)", background: "#F8F9FF", border: "1px solid #f0eeff" }}>
            {activeMedia ? (
              isVideo(activeMedia) ? (
                <video src={activeMedia} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Image src={activeMedia} alt={lot.nom} fill style={{ objectFit: "cover" }} priority />
              )
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>
                🎁
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)" }} />

            {/* Countdown Banner - Premium Dark Aesthetic matching screenshot */}
            {lot.date_fin && !isSoldOut && !isArchived && (
              <div style={{
                position: "absolute", bottom: 20, left: 20, right: 20,
                background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)",
                borderRadius: 22, padding: "12px 20px", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
              }}>
                <div style={{ fontSize: 24 }}>⏰</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Tirage dans :</div>
                <CountdownTimer dateFin={lot.date_fin} />
              </div>
            )}
          </div>

          {/* Galerie médias Interactive */}
          {(lot.image_url || (lot.medias && lot.medias.length > 0)) && (
            <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {/* Main Image in gallery */}
              {lot.image_url && (
                <div 
                  onClick={() => setActiveMedia(lot.image_url)}
                  style={{ 
                    position: "relative", width: 90, height: 90, borderRadius: 18, overflow: "hidden", 
                    cursor: "pointer", border: activeMedia === lot.image_url ? "3px solid #6C5CE7" : "1px solid #f0eeff",
                    transition: "all 0.2s ease"
                  }}
                >
                  <img src={lot.image_url} alt="Main" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              {/* Other Medias */}
              {lot.medias?.map((url, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveMedia(url)}
                  style={{ 
                    position: "relative", width: 90, height: 90, borderRadius: 18, overflow: "hidden", 
                    cursor: "pointer", border: activeMedia === url ? "3px solid #6C5CE7" : "1px solid #f0eeff",
                    transition: "all 0.2s ease", transform: activeMedia === url ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  {isVideo(url) ? (
                    <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={url} alt={`media-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {isVideo(url) && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ color: "white", fontSize: 20 }}>▶</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info card */}
          <div style={{ background: "white", borderRadius: 24, padding: 24, border: "2px solid #f0eeff", boxShadow: "0 4px 20px rgba(108,92,231,0.08)" }}>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#2D3436", marginBottom: 10, lineHeight: 1.2 }}>
              {lot.nom}
            </h1>

            {/* 🔥 URGENCY TICKET BADGE — Only show if < 15 tickets */}
            {!isSoldOut && !isProgramme && remaining > 0 && remaining < 15 && (
              <div style={{
                display: "flex", 
                alignItems: "center", 
                gap: 7,
                background: "linear-gradient(135deg, #fff3f0, #fff8f6)",
                padding: "8px 12px",
                width: "fit-content",
                borderRadius: 12,
                border: "1px solid #ffe0d8",
                marginBottom: 20,
                animation: "detailsPulse 2s infinite"
              }}>
                <span style={{ fontSize: 18 }}>🔥</span>
                <span style={{ 
                  fontSize: 14, 
                  fontWeight: 800, 
                  color: "#E17055",
                  fontFamily: "'Nunito', sans-serif"
                }}>
                  Il reste plus que <strong style={{ color: "#D63031", fontSize: 16 }}>{remaining}</strong> tickets !
                </span>
                <style>{`@keyframes detailsPulse { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:.8; transform:scale(1.02)} }`}</style>
              </div>
            )}

            {lot.description ? (
              <p style={{ fontFamily: "'Nunito', sans-serif", color: "#636E72", lineHeight: 1.75, fontSize: 15, marginBottom: 20, fontWeight: 600 }}>
                {lot.description}
              </p>
            ) : (
              <p style={{ fontFamily: "'Nunito', sans-serif", color: "#b2bec3", fontSize: 14, marginBottom: 20, fontStyle: "italic" }}>
                Aucune description disponible pour ce lot.
              </p>
            )}

            {/* Description */}
            {(lot.description || lot.reglement_url) && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#2D3436", marginBottom: 16 }}>À propos de ce lot</h3>
                <div style={{ color: "#636E72", lineHeight: 1.8, fontSize: 16, whiteSpace: "pre-wrap" }}>
                  {lot.description}
                </div>
              </div>
            )}
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
                lotImage={lot.image_url}
                prixTicket={Number(lot.prix_ticket)}
                maxTickets={Math.min(remaining, 50)}
                totalTickets={lot.total_tickets}
                packs={lot.packs}
                valeurEstimee={lot.valeur_estimee}
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
