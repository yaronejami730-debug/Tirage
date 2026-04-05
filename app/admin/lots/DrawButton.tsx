"use client";

import { useState } from "react";

interface DrawButtonProps {
  lotId: string;
  lotNom: string;
  onDone: () => void;
}

interface WinnerResult {
  prenom: string;
  nom: string;
  email: string;
  winning_ticket: number;
  total_tickets: number;
  total_players: number;
  drawn_at: string;
}

export default function DrawButton({ lotId, lotNom, onDone }: DrawButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<WinnerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"confirm" | "drawing" | "result">("confirm");

  const handleDraw = async () => {
    setPhase("drawing");
    setLoading(true);
    setError(null);

    await new Promise(r => setTimeout(r, 2500)); // dramatic pause

    try {
      const res = await fetch(`/api/admin/lots/${lotId}/draw`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur."); setPhase("confirm"); return; }
      setWinner(data.winner);
      setPhase("result");
    } catch {
      setError("Erreur de connexion.");
      setPhase("confirm");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        background: "linear-gradient(135deg, #FDCB6E, #f9a825)", color: "#2D3436",
        border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
        fontWeight: 800, fontSize: 12, padding: "6px 12px", borderRadius: 10,
        boxShadow: "0 3px 10px rgba(253,203,110,0.4)", transition: "all .2s"
      }}
    >
      🎲 Tirer au sort
    </button>
  );

  return (
    <>
      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20
      }} onClick={phase !== "drawing" ? () => { setOpen(false); setPhase("confirm"); setWinner(null); } : undefined}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "white", borderRadius: 28, padding: 36, maxWidth: 460, width: "100%",
            boxShadow: "0 30px 80px rgba(108,92,231,0.3)", textAlign: "center"
          }}
        >
          {phase === "confirm" && (
            <>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎲</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#2D3436", marginBottom: 8 }}>
                Lancer le tirage
              </h3>
              <p style={{ color: "#636E72", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
                Vous allez tirer au sort le gagnant pour :
              </p>
              <p style={{ fontWeight: 900, fontSize: 16, color: "#6C5CE7", marginBottom: 20 }}>{lotNom}</p>
              {error && <p style={{ color: "#E17055", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</p>}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={handleDraw} style={{
                  background: "linear-gradient(135deg, #6C5CE7, #A29BFE)", color: "white",
                  border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800, fontSize: 15, padding: "13px 28px", borderRadius: 16
                }}>
                  🎰 Confirmer le tirage
                </button>
                <button onClick={() => { setOpen(false); setPhase("confirm"); }} style={{
                  background: "#f8f9ff", color: "#636E72", border: "2px solid #e0d9ff",
                  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700, fontSize: 14, padding: "13px 20px", borderRadius: 16
                }}>
                  Annuler
                </button>
              </div>
            </>
          )}

          {phase === "drawing" && (
            <>
              <div style={{ fontSize: 64, marginBottom: 20, animation: "spin 0.5s linear infinite" }}>🎰</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#6C5CE7", marginBottom: 8 }}>
                Tirage en cours...
              </h3>
              <p style={{ color: "#636E72", fontSize: 14 }}>Le système choisit le ticket gagnant !</p>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: "50%", background: "#6C5CE7",
                    animation: `bounce 0.8s ease ${i * 0.15}s infinite`
                  }} />
                ))}
              </div>
            </>
          )}

          {phase === "result" && winner && (
            <>
              <div style={{ fontSize: 64, marginBottom: 12, animation: "bounce-in .5s ease" }}>🏆</div>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#6C5CE7", marginBottom: 16 }}>
                Gagnant trouvé !
              </h3>
              <div style={{ background: "linear-gradient(135deg, #f0eeff, #fff0f6)", borderRadius: 20, padding: 20, marginBottom: 20, border: "2px solid #A29BFE" }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#2D3436", marginBottom: 4 }}>
                  🎉 {winner.prenom} {winner.nom}
                </div>
                <div style={{ fontSize: 13, color: "#636E72", marginBottom: 8 }}>{winner.email}</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <span style={{ background: "#FDCB6E", color: "#2D3436", fontWeight: 800, fontSize: 13, padding: "4px 14px", borderRadius: 20 }}>
                    🎫 Ticket #{winner.winning_ticket}
                  </span>
                  <span style={{ background: "#f0eeff", color: "#6C5CE7", fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>
                    {winner.total_players} participants · {winner.total_tickets} tickets
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#b2bec3", marginBottom: 20 }}>
                Tirage effectué le {new Date(winner.drawn_at).toLocaleString("fr-FR")} via crypto-rng
              </p>
              <button onClick={() => { setOpen(false); setPhase("confirm"); setWinner(null); onDone(); }} style={{
                background: "linear-gradient(135deg, #00B894, #00a381)", color: "white",
                border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: 15, padding: "13px 28px", borderRadius: 16,
                boxShadow: "0 6px 20px rgba(0,184,148,0.4)"
              }}>
                ✅ Fermer
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bounce-in { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </>
  );
}
