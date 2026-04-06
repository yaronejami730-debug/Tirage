"use client";

import { useState } from "react";
import { generateCSV, downloadCSV } from "@/lib/export-utils";
import { Lot, Participation } from "@/lib/supabase";

interface BailiffButtonProps {
  lotId: string;
  lotNom: string;
}

export default function BailiffButton({ lotId, lotNom }: BailiffButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("bailiff@gowingo.fr");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const validateEmail = () => {
    if (!email.trim() || !email.includes("@")) {
      setErrorDetails("Veuillez entrer un e-mail valide.");
      setStatus("error");
      return false;
    }
    return true;
  };

  const handleSendBrevo = async () => {
    if (!validateEmail()) return;

    setStatus("sending");
    setLoading(true);
    setErrorDetails(null);

    try {
      const res = await fetch(`/api/admin/lots/${lotId}/bailiff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bailiffEmail: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
      setStatus("success");
    } catch (err: any) {
      setErrorDetails(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGmail = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    setErrorDetails(null);

    try {
      // 1. Fetch current lot and participations (need full objects for generator)
      const [lotRes, partRes] = await Promise.all([
        fetch(`/api/admin/lots`).then(r => r.json()), // we'll find our lot in there
        fetch(`/api/admin/participations?lot_id=${lotId}`).then(r => r.json()),
      ]);

      const lot = lotRes.lots.find((l: Lot) => l.id === lotId);
      const participations = (partRes.participations || []).filter((p: Participation) => p.statut === "confirme");

      if (!lot || participations.length === 0) {
        throw new Error("Impossible de générer le CSV (lot introuvable ou aucun participant).");
      }

      // 2. Generate and download CSV
      const csv = generateCSV(lot, participations);
      downloadCSV(csv, `participants_${lot.reference_lot}.csv`);

      // 3. Open Gmail
      const subject = encodeURIComponent(`Liste des participants - ${lotNom} - ${lot.reference_lot}`);
      const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint la liste des participants pour le lot "${lotNom}".\n\n(Le fichier CSV a été téléchargé sur votre ordinateur, n'oubliez pas de l'attacher !)`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email.trim()}&su=${subject}&body=${body}`;
      
      window.open(gmailUrl, "_blank");
      setStatus("idle");
      setOpen(false);
    } catch (err: any) {
      setErrorDetails(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        background: "linear-gradient(135deg, #6C5CE7, #A29BFE)", color: "white",
        border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        fontWeight: 800, fontSize: 11, padding: "6px 12px", borderRadius: 10,
        boxShadow: "0 3px 10px rgba(108,92,231,0.25)", transition: "all .2s",
        display: "flex", alignItems: "center", gap: 6
      }}
    >
      📧 Envoyer à l'huissier
    </button>
  );

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20
      }} onClick={status !== "sending" ? () => { setOpen(false); setStatus("idle"); setErrorDetails(null); } : undefined}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "white", borderRadius: 28, padding: 36, maxWidth: 500, width: "100%",
            boxShadow: "0 30px 80px rgba(108,92,231,0.3)", textAlign: "center"
          }}
        >
          {status !== "success" ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#2D3436", marginBottom: 8 }}>
                Envoyer la liste à l'huissier
              </h3>
              <p style={{ color: "#636E72", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                Choisissez votre méthode d'envoi pour le lot <span style={{ color: "#6C5CE7", fontWeight: 800 }}>{lotNom}</span>.
              </p>

              <div style={{ marginBottom: 24, textAlign: "left" }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#b2bec3", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }}>E-mail de l'huissier</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="bailiff@example.com"
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 14, border: "2px solid #f0eeff",
                    fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none", transition: "border .2s"
                  }}
                  disabled={loading}
                />
              </div>

              {status === "error" && (
                <div style={{ background: "#fff5f5", color: "#e17055", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 20, border: "1px solid #ff000018" }}>
                  ⚠️ {errorDetails || "Une erreur est survenue."}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <button
                  onClick={handleSendBrevo}
                  disabled={loading}
                  style={{
                    background: loading ? "#ddd" : "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                    color: "white", border: "none", cursor: loading ? "wait" : "pointer",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                    padding: "16px 20px", borderRadius: 16,
                    boxShadow: !loading ? "0 6px 15px rgba(108,92,231,0.25)" : "none"
                  }}
                >
                  {status === "sending" ? "Envoi en cours..." : "🚀 Envoi automatique (via Brevo)"}
                </button>
                
                <button
                  onClick={handleGmail}
                  disabled={loading}
                  style={{
                    background: "#f0eeff", color: "#6C5CE7", border: "none",
                    cursor: loading ? "wait" : "pointer", fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800, fontSize: 14, padding: "16px 20px", borderRadius: 16
                  }}
                >
                  ✉️ Ouvrir dans Gmail (Manuel)
                </button>

                <button
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  style={{
                    marginTop: 8, color: "#b2bec3", background: "none", border: "none",
                    cursor: "pointer", fontSize: 13, fontWeight: 700, textDecoration: "underline"
                  }}
                >
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 64, marginBottom: 16, animation: "bounce-in .5s ease" }}>✨</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#00B894", marginBottom: 12 }}>
                E-mail envoyé !
              </h3>
              <div style={{ background: "#f0fff4", borderRadius: 20, padding: 20, marginBottom: 24, border: "2px solid #00B894" }}>
                <p style={{ fontSize: 14, color: "#2d3436", fontWeight: 700, margin: 0 }}>
                  La liste des participants a été transmise avec succès à :
                </p>
                <p style={{ fontSize: 16, color: "#00B894", fontWeight: 900, marginTop: 8 }}>{email}</p>
              </div>
              <button
                onClick={() => { setOpen(false); setStatus("idle"); }}
                style={{
                  background: "#00B894", color: "white", border: "none", cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
                  padding: "14px 40px", borderRadius: 16, boxShadow: "0 8px 20px rgba(0,184,148,0.3)"
                }}
              >
                Parfait
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-in { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </>
  );
}
