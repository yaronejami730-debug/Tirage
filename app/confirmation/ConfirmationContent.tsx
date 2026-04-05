"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!sessionId) { setError("Session introuvable."); setLoading(false); return; }

    const fetchData = async () => {
      let attempts = 0;
      while (attempts < 8) {
        try {
          const res = await fetch(`/api/participation?session_id=${encodeURIComponent(sessionId)}`);
          const data = await res.json();
          if (res.ok && data.participation?.statut === "confirme") {
            setParticipation(data.participation);
            setLoading(false);
            // Confetti!
            setTimeout(() => launchConfetti(), 300);
            return;
          }
        } catch {}
        attempts++;
        if (attempts < 8) await new Promise(r => setTimeout(r, 2000));
      }
      setError("Votre paiement a été reçu ! Vous recevrez votre confirmation par email dans quelques instants.");
      setLoading(false);
    };
    fetchData();
  }, [sessionId]);

  const launchConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      const colors = ["#6C5CE7", "#FD79A8", "#FDCB6E", "#00B894", "#A29BFE"];
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 400);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 600);
    } catch {}
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 48, height: 48, border: "4px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#6C5CE7" }}>Confirmation en cours... 🎫</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !participation) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 480, background: "white", borderRadius: 28, padding: 40, textAlign: "center", border: "2px solid #f0eeff", boxShadow: "0 12px 50px rgba(108,92,231,0.12)" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#6C5CE7", marginBottom: 12 }}>Paiement reçu !</h2>
        <p style={{ color: "#636E72", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{error}</p>
        <Link href="/" className="btn-fun">← Retour aux lots</Link>
      </div>
    </div>
  );

  const p = participation;
  const refJeu = p.reference_jeu || `#JEU-${new Date(p.created_at).toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random()*9000)+1000}`;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px 80px" }}>

      {/* SUCCESS HEADER */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, #6C5CE7, #FD79A8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, margin: "0 auto 16px",
          boxShadow: "0 12px 40px rgba(108,92,231,0.4)",
          animation: "bounce-in .5s ease"
        }}>🎉</div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 34, color: "#2D3436", marginBottom: 6 }}>
          Bravo, {p.prenom} !
        </h1>
        <p style={{ color: "#636E72", fontSize: 15 }}>
          Votre participation est bien enregistrée !<br />
          Un email a été envoyé à <strong>{p.email}</strong>
        </p>
      </div>

      {/* RECAP CARD */}
      <div style={{ background: "white", borderRadius: 28, overflow: "hidden", border: "2px solid #f0eeff", boxShadow: "0 12px 50px rgba(108,92,231,0.12)", marginBottom: 20 }}>

        {/* Header gradient */}
        <div style={{ background: "linear-gradient(135deg, #6C5CE7, #FD79A8)", padding: "20px 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 2 }}>Lot remporté</p>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "white", marginBottom: 6 }}>{p.lots.nom}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)" }}>
              🏷️ {p.lots.reference_lot}
            </span>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)" }}>
              🎮 {refJeu}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Participant", val: `${p.prenom} ${p.nom}` },
              { label: "Email", val: p.email },
              { label: "Tickets achetés", val: `${p.quantite} ticket${p.quantite > 1 ? "s" : ""}` },
              { label: "Date", val: new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
            ].map(item => (
              <div key={item.label} style={{ background: "#f8f9ff", borderRadius: 14, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#b2bec3", fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#2D3436", wordBreak: "break-all" }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Ticket numbers */}
          {p.ticket_numbers?.length > 0 && (
            <div style={{ background: "linear-gradient(135deg, #f0eeff, #fff0f6)", borderRadius: 18, padding: "16px 18px", border: "2px dashed #A29BFE" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#6C5CE7", marginBottom: 10 }}>🎫 Vos numéros de tickets</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.ticket_numbers.map((n: number) => (
                  <span key={n} style={{
                    background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                    color: "white", fontFamily: "'Fredoka One', cursive",
                    fontSize: 18, width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 12, boxShadow: "0 4px 12px rgba(108,92,231,0.35)"
                  }}>{n}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal */}
      <div style={{ background: "#fffbee", borderRadius: 18, padding: "14px 18px", border: "2px solid #FDCB6E44", marginBottom: 28 }}>
        <p style={{ color: "#92400e", fontSize: 12, lineHeight: 1.6 }}>
          <strong>⚖️ Mention légale :</strong> Le tirage est effectué par un organisme externe indépendant.
          Conservez cet email comme preuve de participation. Résultats communiqués par email.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/" className="btn-fun" style={{ flex: 1, justifyContent: "center" }}>
          🎁 Voir d'autres lots
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-secondary"
          style={{ flex: 1, justifyContent: "center" }}
        >
          🖨️ Imprimer
        </button>
      </div>

      <style>{`@keyframes bounce-in{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
