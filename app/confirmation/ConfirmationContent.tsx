"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Participation, Lot } from "@/lib/supabase";

type ParticipationWithLot = Participation & {
  lots: Pick<Lot, "nom" | "reference_lot" | "image_url">;
};

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [participation, setParticipation] = useState<ParticipationWithLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const confettiFired = useRef(false);

  const fetchData = useCallback(async (isSilent = false): Promise<"confirmed" | "found" | "not_found"> => {
    if (!sessionId) return "not_found";
    try {
      const res = await fetch(`/api/participation?session_id=${encodeURIComponent(sessionId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.participation) {
          setParticipation(data.participation);
          setLoading(false);
          if (data.participation.statut === "confirme") {
            setPolling(false);
            if (!isSilent && !confettiFired.current) {
              confettiFired.current = true;
              launchConfetti();
            }
            return "confirmed";
          }
          return "found";
        }
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
    return "not_found";
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) { setError("Session introuvable."); setLoading(false); return; }
    let isMounted = true;
    const initialFetch = async () => {
      let attempts = 0;
      while (attempts < 12 && isMounted) {
        const result = await fetchData();
        if (result === "confirmed") return;
        if (result === "found") { setPolling(true); return; }
        attempts++;
        if (attempts < 12) await new Promise(r => setTimeout(r, 2000));
      }
      if (isMounted) {
        setError("La confirmation de Stripe n'a pas encore été reçue. Pas d'inquiétude, cela peut prendre quelques instants.");
        setLoading(false);
        setPolling(true);
      }
    };
    initialFetch();
    return () => { isMounted = false; };
  }, [sessionId, fetchData]);

  useEffect(() => {
    if (!polling || !sessionId) return;
    const interval = setInterval(() => { fetchData(true); }, 4000);
    return () => clearInterval(interval);
  }, [polling, sessionId, fetchData]);

  const launchConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      const colors = ["#8a6000", "#C9A84C", "#1d1d1f", "#6e6e73", "#a1a1a6"];
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors });
      setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors }), 400);
      setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors }), 600);
    } catch {}
  };

  const generatePDF = async () => {
    if (generatingPDF || !participation || !sessionId) return;
    setGeneratingPDF(true);
    try {
      const res = await fetch(`/api/ticket-pdf?session_id=${encodeURIComponent(sessionId)}`);
      if (!res.ok) throw new Error("Erreur serveur");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GoWinGo-Ticket-${participation.lots?.reference_lot || "ticket"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.print();
    } finally {
      setGeneratingPDF(false);
    }
  };

  /* ── Loading ──────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ width: 36, height: 36, border: "2px solid rgba(0,0,0,0.08)", borderTopColor: "#1d1d1f", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <p style={{ fontSize: 14, color: "#6e6e73", fontWeight: 400 }}>Finalisation de votre participation…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Erreur sans participation ─────────────────── */
  if (error && !participation) return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 440, background: "#ffffff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(138,96,0,0.07)", border: "1px solid rgba(138,96,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a6000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 10 }}>Traitement en cours</h2>
        <p style={{ color: "#6e6e73", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>{error}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => fetchData()}
            style={{ padding: "13px", borderRadius: 12, border: "none", background: "#1d1d1f", color: "#ffffff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Vérifier maintenant
          </button>
          <Link href="/" style={{ color: "#a1a1a6", fontSize: 13, textDecoration: "none", padding: "8px" }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );

  const p = participation!;
  const isConfirmed = p.statut === "confirme";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 100px" }}>

      {/* ── Header ─────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 24px",
          background: isConfirmed ? "rgba(138,96,0,0.08)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${isConfirmed ? "rgba(138,96,0,0.2)" : "rgba(0,0,0,0.08)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {isConfirmed ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a6000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <div style={{ width: 20, height: 20, border: "2px solid rgba(0,0,0,0.1)", borderTopColor: "#1d1d1f", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          )}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.03em", marginBottom: 8 }}>
          {isConfirmed ? `Félicitations, ${p.prenom}` : `Merci, ${p.prenom}`}
        </h1>
        <p style={{ color: "#6e6e73", fontSize: 14, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
          {isConfirmed
            ? "Votre participation est confirmée. Vos tickets officiels sont attribués."
            : "Votre paiement est reçu. Vos numéros de tickets sont en cours d'attribution…"}
        </p>
      </div>

      {/* ── Carte de confirmation ──────────────── */}
      <div style={{ background: "#ffffff", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>

        {/* Header carte */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: isConfirmed ? "rgba(138,96,0,0.04)" : "rgba(0,0,0,0.02)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
            {isConfirmed ? "Participation confirmée" : "En cours de validation"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>
            {p.lots?.nom || "—"}
          </div>
          <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.04)", padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 500 }}>Réf.</span>
            <span style={{ fontSize: 11, color: "#6e6e73", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{p.lots?.reference_lot}</span>
          </div>
        </div>

        {/* Détails */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Participant", val: `${p.prenom} ${p.nom}` },
            { label: "E-mail", val: p.email },
            { label: "Tickets", val: `${p.quantite} ticket${p.quantite > 1 ? "s" : ""}` },
            { label: "Date", val: new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0",
              borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}>
              <span style={{ fontSize: 13, color: "#a1a1a6", fontWeight: 400 }}>{item.label}</span>
              <span style={{ fontSize: 13, color: "#1d1d1f", fontWeight: 500 }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Tickets */}
        <div style={{ padding: "20px 28px 28px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            {isConfirmed ? "Vos numéros officiels" : "Attribution en cours"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {isConfirmed && p.ticket_numbers?.length > 0 ? (
              p.ticket_numbers.map((n: number) => (
                <div key={n} style={{
                  background: "rgba(138,96,0,0.07)",
                  border: "1px solid rgba(138,96,0,0.2)",
                  color: "#8a6000",
                  width: 52, height: 52, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em",
                }}>
                  {n}
                </div>
              ))
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                {[...Array(p.quantite)].map((_, i) => (
                  <div key={i} style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: "rgba(0,0,0,0.03)",
                    border: "1px solid rgba(0,0,0,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: "#a1a1a6",
                    animation: "pulse-slot 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}>—</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Note ─────────────────────────────────── */}
      <p style={{ fontSize: 12, color: "#a1a1a6", textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
        Une copie de ce ticket a été envoyée à votre adresse email.<br />
        Le tirage sera effectué dès que le lot sera complet.
      </p>

      {/* ── Actions ───────────────────────────────── */}
      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/" style={{
          flex: 1, padding: "13px 20px", borderRadius: 12, textDecoration: "none",
          border: "1px solid rgba(0,0,0,0.1)", background: "transparent",
          color: "#6e6e73", fontSize: 13, fontWeight: 500,
          textAlign: "center", transition: "all .2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          Retour aux lots
        </Link>
        {isConfirmed && (
          <button
            onClick={generatePDF}
            disabled={generatingPDF}
            style={{
              flex: 1.5, padding: "13px 20px", borderRadius: 12, border: "none",
              background: generatingPDF ? "rgba(29,29,31,0.5)" : "#1d1d1f",
              color: "#ffffff", fontSize: 13, fontWeight: 600,
              cursor: generatingPDF ? "wait" : "pointer", fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
          >
            {generatingPDF ? "Génération…" : "Télécharger le PDF"}
          </button>
        )}
        {!isConfirmed && (
          <div style={{ flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#a1a1a6", fontSize: 13, fontWeight: 400 }}>
            <div style={{ width: 12, height: 12, border: "1.5px solid rgba(0,0,0,0.1)", borderTopColor: "#1d1d1f", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
            Synchronisation…
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-slot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
