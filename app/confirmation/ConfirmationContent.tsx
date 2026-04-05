"use client";

import { useEffect, useState, useCallback } from "react";
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

  const fetchData = useCallback(async (isSilent = false) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/participation?session_id=${encodeURIComponent(sessionId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.participation) {
          setParticipation(data.participation);
          setLoading(false);
          // If confirmed, stop polling and show confetti
          if (data.participation.statut === "confirme") {
            setPolling(false);
            if (!isSilent) launchConfetti();
            return true;
          }
          return false;
        }
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
    return false;
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
        const success = await fetchData();
        if (success) return;
        
        // If we found the participation but not confirmed yet, we stop the initial "hard" loading
        // and let it poll in the background or just show what we have
        if (participation) {
          setLoading(false);
          setPolling(true);
          return;
        }

        attempts++;
        if (attempts < 12) await new Promise(r => setTimeout(r, 2000));
      }
      
      if (isMounted && !participation) {
        setError("Nous n'avons pas encore reçu la confirmation de Stripe. Pas d'inquiétude, cela peut prendre quelques instants !");
        setLoading(false);
        setPolling(true); // Keep polling in background
      }
    };

    initialFetch();
    return () => { isMounted = false; };
  }, [sessionId, fetchData, participation]);

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
    if (generatingPDF) return;
    setGeneratingPDF(true);
    try {
      const element = document.getElementById("recap-card");
      if (!element || !participation) return;

      element.scrollIntoView();
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      const finalWidth = pdfWidth - (margin * 2);
      const finalHeight = (canvas.height * finalWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", margin, margin, finalWidth, finalHeight);
      pdf.save(`GoWinGo-Ticket-${participation.lots?.reference_lot || 'ticket'}.pdf`);
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

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px 80px" }}>

      {/* LOGO & SUCCESS HEADER */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto 24px" }}>
          <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain" }} priority />
        </div>
        
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: "#2D3436", marginBottom: 8 }}>
          {isConfirmed ? "Félicitations, " : "Merci, "}{p.prenom} !
        </h1>
        <p style={{ color: "#636E72", fontSize: 17, fontWeight: 500, lineHeight: 1.5 }}>
          {isConfirmed 
            ? "Votre participation est validée ! Vos numéros sont prêts."
            : "Paiement reçu ! Nous générons vos numéros de tickets..."
          }<br />
          Confirmation envoyée à <strong>{p.email}</strong>
        </p>
      </div>

      {/* RECAP CARD */}
      <div id="recap-card" style={{ 
        background: "white", borderRadius: 32, overflow: "hidden", 
        border: "2px solid rgba(108,92,231,0.08)", 
        boxShadow: "0 22px 60px rgba(108,92,231,0.15)", 
        marginBottom: 24,
        animation: "bounce-in .6s .2s both"
      }}>

        {/* Header gradient - Matching homepage EXACTLY (4 colors) */}
        <div style={{ background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 35%, #FD79A8 70%, #FDCB6E 100%)", padding: "30px 32px", position: "relative" }}>
          {!isConfirmed && (
            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "white", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 10, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "pulse 1s infinite" }}></div>
              Génération...
            </div>
          )}
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 6 }}>
            Récapitulatif de participation
          </p>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "white", marginBottom: 14, textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
            {p.lots?.nom || '---'}
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.25)", color: "white", fontSize: 13, fontWeight: 800, padding: "6px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.35)" }}>
              🏷️ Lot: {p.lots?.reference_lot || '---'}
            </span>
            <span style={{ background: "rgba(255,255,255,0.25)", color: "white", fontSize: 13, fontWeight: 800, padding: "6px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.35)" }}>
              🎮 Jeu: {refJeu.replace("#JEU-", "")}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Participant", val: `${p.prenom} ${p.nom}` },
              { label: "Email", val: p.email },
              { label: "Tickets", val: `${p.quantite} ticket${p.quantite > 1 ? "s" : ""}` },
              { label: "Date", val: new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
            ].map(item => (
              <div key={item.label} style={{ background: "#f8f9ff", borderRadius: 18, padding: "16px 20px", border: "1px solid #f0eeff" }}>
                <div style={{ fontSize: 11, color: "#b2bec3", fontWeight: 800, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.5px" }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#2D3436", wordBreak: "break-all" }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Ticket numbers section - Redesigned to look like "Gold Tickets" */}
          <div style={{ 
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", 
            borderRadius: 24, 
            padding: "28px", 
            border: "3px dashed #FDCB6E",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", right: -12, top: -12, fontSize: 64, opacity: 0.12, transform: "rotate(15deg)" }}>⭐</div>
            
            <p style={{ fontSize: 15, fontWeight: 900, color: "#B45309", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, textTransform: "uppercase", letterSpacing: "1px" }}>
              <span style={{ fontSize: 22 }}>🎟️</span> {isConfirmed ? "Vos numéros officiels" : "Vos numéros réservés"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {isConfirmed && p.ticket_numbers?.length > 0 ? (
                p.ticket_numbers.map((n: number) => (
                  <div key={n} style={{
                    position: "relative",
                    background: "linear-gradient(135deg, #FDCB6E, #F9A825)",
                    color: "white",
                    padding: "3px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(253,203,110,0.4)",
                    transform: "rotate(-2deg)",
                  }}>
                    <div style={{
                      background: "rgba(0,0,0,0.05)",
                      border: "2px dashed rgba(255,255,255,0.4)",
                      borderRadius: "13px",
                      width: 54,
                      height: 54,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: 24,
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                      {n}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", gap: 14 }}>
                  {[...Array(p.quantite)].map((_, i) => (
                    <div key={i} style={{
                      width: 54,
                      height: 54,
                      borderRadius: "16px",
                      background: "#FDE047",
                      opacity: 0.4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      animation: "pulse 1.5s infinite"
                    }}>?</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Mention */}
      <div style={{ 
        background: "#F8F9FF", borderRadius: 24, padding: "20px 24px", 
        border: "2px solid #E0E7FF", marginBottom: 36, 
        display: "flex", gap: 18, alignItems: "center",
        animation: "bounce-in .6s .4s both"
      }}>
        <div style={{ fontSize: 28 }}>⚖️</div>
        <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ fontWeight: 800, color: "#1E293B" }}>Mention légale :</strong> Le tirage est indépendant.
          Les numéros seront officiels une fois le paiement validé (quelques instants).
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 16, animation: "bounce-in .6s .6s both" }}>
        <Link href="/" className="btn-fun" style={{ flex: 1, padding: "18px 24px", fontSize: 16, background: "linear-gradient(135deg, #6C5CE7, #A29BFE)" }}>
          🎁 Lots
        </Link>
        {isConfirmed ? (
          <button
            onClick={generatePDF}
            disabled={generatingPDF}
            className="btn-gold"
            style={{ flex: 1.5, padding: "18px 24px", fontSize: 16, fontWeight: 900, opacity: generatingPDF ? 0.7 : 1, cursor: generatingPDF ? "wait" : "pointer" }}
          >
            {generatingPDF ? "⏳ Génération..." : "📥 PDF Ticket"}
          </button>
        ) : (
          <div style={{ flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5CE7", fontWeight: 800 }}>
             Synchronisation...
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
