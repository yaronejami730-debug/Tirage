"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient, Lot } from "@/lib/supabase";
import ParticipationForm from "@/components/ParticipationForm";
import CountdownTimer from "@/components/CountdownTimer";

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
      <div style={{ width: 40, height: 40, border: "3px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (gone || !lot) return notFound();

  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const isArchived = lot.statut !== "actif";
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : "#7c3aed";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 13, color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>Lots</Link>
        <span>›</span>
        <span style={{ color: "#374151", fontWeight: 600 }}>{lot.nom}</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

        {/* LEFT — image + infos */}
        <div>
          {/* Image */}
          <div style={{ position: "relative", height: 380, borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg,#4c1d95,#1e1b4b)", marginBottom: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {lot.image_url ? (
              <Image src={lot.image_url} alt={lot.nom} fill style={{ objectFit: "cover" }} priority />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.1)" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />

            {/* Countdown overlay */}
            {lot.date_fin && !isSoldOut && (
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
                borderRadius: 14, padding: "8px 16px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Tirage dans</span>
                <CountdownTimer dateFin={lot.date_fin} />
              </div>
            )}

            {/* Ref badge */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
              borderRadius: 10, padding: "5px 12px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, fontFamily: "monospace"
            }}>
              {lot.reference_lot}
            </div>
          </div>

          {/* Info card */}
          <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 10, lineHeight: 1.3 }}>{lot.nom}</h1>
            {lot.description && <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 14, marginBottom: 20 }}>{lot.description}</p>}

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Prix / ticket", val: `${Number(lot.prix_ticket).toFixed(2)} €`, color: "#f59e0b" },
                { label: "Total tickets", val: lot.total_tickets, color: "#7c3aed" },
                { label: "Restants", val: remaining > 0 ? remaining : "Complet", color: remaining <= 10 ? "#ef4444" : "#10b981" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fafafa", borderRadius: 14, padding: "12px 14px", textAlign: "center", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
                <span>{lot.tickets_vendus} vendus</span>
                <span style={{ fontWeight: 600, color: barColor }}>{Math.round(pct)}% rempli</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .5s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div style={{ position: "sticky", top: 80 }}>
          {isArchived ? (
            <div style={{ background: "white", borderRadius: 24, padding: 40, textAlign: "center", border: "1px solid #f3f4f6", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Ce tirage est terminé</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>La période de participation est clôturée.</p>
              <Link href="/" className="btn-primary">Voir les autres lots</Link>
            </div>
          ) : isSoldOut ? (
            <div style={{ background: "white", borderRadius: 24, padding: 40, textAlign: "center", border: "1px solid #f3f4f6", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Complet !</h3>
              <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>Tous les tickets ont été vendus.</p>
              <Link href="/" className="btn-primary">Voir les autres lots</Link>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid #f3f4f6", boxShadow: "0 8px 40px rgba(124,58,237,.12)" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontWeight: 900, fontSize: 20, color: "#111", marginBottom: 4 }}>Choisissez vos tickets</h2>
                <p style={{ color: "#9ca3af", fontSize: 13 }}>Paiement sécurisé via Stripe · Email de confirmation immédiat</p>
              </div>
              <ParticipationForm
                lotId={lot.id}
                lotNom={lot.nom}
                prixTicket={Number(lot.prix_ticket)}
                maxTickets={Math.min(remaining, 10)}
              />
            </div>
          )}

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {["🔒 Paiement sécurisé", "✅ Tirage certifié", "📧 Confirmation email"].map(b => (
              <span key={b} style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
