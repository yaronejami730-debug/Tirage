"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    if (!sessionId) {
      setError("Session introuvable.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initialFetch = async () => {
      let attempts = 0;
      while (attempts < 12 && isMounted) {
        const result = await fetchData();
        if (result === "confirmed") return;
        if (result === "found") {
          setPolling(true);
          return;
        }
        attempts++;
        if (attempts < 12) await new Promise(r => setTimeout(r, 2000));
      }

      if (isMounted) {
        setError("Nous n'avons pas encore reçu la confirmation de Stripe. Pas d'inquiétude, cela peut prendre quelques instants !");
        setLoading(false);
        setPolling(true);
      }
    };

    initialFetch();
    return () => { isMounted = false; };
  }, [sessionId, fetchData]);

  // Background polling if not confirmed
  useEffect(() => {
    if (!polling || !sessionId) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [polling, sessionId, fetchData]);

  const launchConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      const colors = ["#6C5CE7", "#FD79A8", "#FDCB6E", "#00B894", "#A29BFE"];
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 400);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 600);
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
    } catch (err) {
      console.error("PDF generation failed", err);
      window.print();
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 48, height: 48, border: "4px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#6C5CE7" }}>Finalisation de votre participation... 🎫</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // If we have an error but NO participation data at all
  if (error && !participation) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 480, background: "white", borderRadius: 28, padding: 40, textAlign: "center", border: "2px solid #f0eeff", boxShadow: "0 12px 50px rgba(108,92,231,0.12)" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>⏳</div>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#6C5CE7", marginBottom: 12 }}>Presque fini !</h2>
        <p style={{ color: "#636E72", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{error}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => fetchData()} className="btn-fun">🔄 Réessayer maintenant</button>
          <Link href="/" style={{ color: "#b2bec3", fontSize: 13, textDecoration: "underline" }}>Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );

  const p = participation!;
  const refJeu = p.reference_jeu || `#JEU-${new Date(p.created_at).toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random()*9000)+1000}`;
  const isConfirmed = p.statut === "confirme";

  const detailItems = [
    { label: "Participant", val: `${p.prenom} ${p.nom}`, bg: "rgba(162, 155, 254, 0.12)", color: "#6C5CE7" },
    { label: "E-mail", val: p.email, bg: "rgba(253, 203, 110, 0.12)", color: "#B45309" },
    { label: "Quantité", val: `${p.quantite} ticket${p.quantite > 1 ? "s" : ""}`, bg: "rgba(0, 184, 148, 0.12)", color: "#00B894" },
    { label: "Date", val: new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), bg: "rgba(255, 112, 67, 0.1)", color: "#E17055" },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 20px 100px" }}>

      {/* LOGO & SUCCESS HEADER */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 16px" }}>
          <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} priority />
        </div>
        
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#2D3436", marginBottom: 12 }}>
          {isConfirmed ? "Félicitations, " : "Merci, "}{p.prenom} !
        </h1>
        <p style={{ color: "#636E72", fontSize: 16, fontWeight: 500, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
          {isConfirmed 
            ? "Votre participation est validée ! Vous pouvez maintenant télécharger votre ticket officiel."
            : "Votre paiement a été reçu. Nous générons vos numéros de tickets officiels en ce moment même..."
          }
        </p>
      </div>

      {/* RECAP CARD */}
      <div id="recap-card" style={{ 
        background: "white", borderRadius: 32, overflow: "hidden", 
        border: "1px solid #f0eeff", 
        boxShadow: "0 30px 80px rgba(108,92,231,0.08)", 
        marginBottom: 32,
        animation: "bounce-in .6s .2s both"
      }}>

        {/* Header - Cleaner, matching site cards */}
        <div style={{ 
          background: isConfirmed ? "linear-gradient(135deg, #6C5CE7 0%, #8E7CFF 100%)" : "linear-gradient(135deg, #FF7043 0%, #FF9E80 100%)", 
          padding: "32px 36px", 
          position: "relative" 
        }}>
          {!isConfirmed && (
            <div style={{ 
              position: "absolute", top: 16, right: 16, 
              background: "rgba(0,0,0,0.15)", backdropFilter: "blur(8px)", 
              color: "white", fontSize: 10, fontWeight: 900, 
              padding: "5px 12px", borderRadius: 12, 
              textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "pulse 1s infinite" }}></div>
              Validation
            </div>
          )}
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>
            Récapitulatif de commande
          </p>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "white", marginBottom: 12, lineHeight: 1.2 }}>
            {p.lots?.nom || 'Chargement...'}
          </h2>
          <div style={{
            background: "rgba(255,255,255,0.15)", color: "white", 
            display: "inline-block", fontSize: 13, fontWeight: 800, 
            padding: "5px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)"
          }}>
            🏷️ Lot: {p.lots?.reference_lot || '---'}
          </div>
        </div>

        {/* Details Grid - Matching Pastel aesthetic */}
        <div style={{ padding: "36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {detailItems.map(item => (
              <div key={item.label} style={{ 
                background: item.bg, borderRadius: 20, padding: "18px 24px", 
                border: `1px solid ${item.color}15`,
                display: "flex", flexDirection: "column", gap: 4
              }}>
                <div style={{ fontSize: 10, color: item.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.8 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#2D3436", wordBreak: "break-all" }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Ticket numbers section - Golden Ticket but aligned with site's gold */}
          <div style={{ 
            background: "rgba(253, 203, 110, 0.08)", 
            borderRadius: 24, 
            padding: "24px 32px", 
            border: "2px dashed #FDCB6E",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", right: -10, top: -10, fontSize: 56, opacity: 0.1, transform: "rotate(15deg)" }}>🏆</div>
            
            <p style={{ fontSize: 14, fontWeight: 900, color: "#B45309", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, textTransform: "uppercase", letterSpacing: "1px" }}>
              <span style={{ fontSize: 20 }}>🎟️</span> {isConfirmed ? "Vos numéros officiels" : "Vos numéros réservés"}
            </p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {isConfirmed && p.ticket_numbers?.length > 0 ? (
                p.ticket_numbers.map((n: number) => (
                  <div key={n} style={{
                    position: "relative",
                    background: "linear-gradient(135deg, #FDCB6E, #F9B021)",
                    color: "white",
                    width: 58,
                    height: 58,
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 24,
                    boxShadow: "0 6px 15px rgba(253,203,110,0.4)",
                    border: "2px solid rgba(255,255,255,0.2)"
                  }}>
                    {n}
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", gap: 12 }}>
                  {[...Array(p.quantite)].map((_, i) => (
                    <div key={i} style={{
                      width: 58,
                      height: 58,
                      borderRadius: "18px",
                      background: "#FDE047",
                      opacity: 0.3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      animation: "pulse 1.5s infinite"
                    }}>?</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ color: "#b2bec3", fontSize: 13, lineHeight: 1.6, margin: "0 auto", maxWidth: 440 }}>
          <strong style={{ color: "#636E72" }}>Besoin d'aide ?</strong> Une copie de ce ticket vous a été envoyée par email. Le tirage sera effectué dès que le lot sera complet.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 16, animation: "bounce-in .6s .6s both" }}>
        <Link href="/" className="btn-fun" style={{ flex: 1, padding: "18px 24px", fontSize: 16, background: "white", color: "#6C5CE7", border: "2px solid #6C5CE7", boxShadow: "none" }}>
          🎁 Retour aux lots
        </Link>
        {isConfirmed ? (
          <button
            onClick={generatePDF}
            disabled={generatingPDF}
            className="btn-gold"
            style={{ 
              flex: 1.5, padding: "18px 24px", fontSize: 16, fontWeight: 900,
              background: "linear-gradient(135deg, #6C5CE7, #8E7CFF)",
              opacity: generatingPDF ? 0.7 : 1, 
              cursor: generatingPDF ? "wait" : "pointer"
            }}
          >
            {generatingPDF ? "⏳ Génération..." : "📥 Télécharger le PDF"}
          </button>
        ) : (
          <div style={{ flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5CE7", fontWeight: 800 }}>
             <div style={{ width: 14, height: 14, border: "2px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", marginRight: 10 }} />
             Synchronisation...
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.95); opacity: 0; }
          60% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
