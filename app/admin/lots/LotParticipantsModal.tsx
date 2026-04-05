"use client";

import { useEffect, useState } from "react";
import { Lot, Participation } from "@/lib/supabase";

function exportCSV(lot: Lot, participations: Participation[]) {
  const headers = ["Prénom", "Nom", "Email", "Téléphone", "Quantité", "N° tickets", "Statut", "Date"];
  const rows = participations.map((p) => [
    p.prenom,
    p.nom,
    p.email,
    p.telephone ?? "",
    p.quantite,
    (p.ticket_numbers ?? []).join(" | "),
    p.statut,
    new Date(p.created_at).toLocaleString("fr-FR"),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `participants_${lot.reference_lot}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const statutColor: Record<string, string> = {
  confirme: "#00B894",
  en_attente: "#FDCB6E",
  annule: "#E17055",
};

export default function LotParticipantsModal({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/participations?lot_id=${lot.id}`)
      .then((r) => r.json())
      .then(({ participations: p }) => {
        setParticipations(p ?? []);
        setLoading(false);
      });

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lot.id, onClose]);

  const confirmes = participations.filter((p) => p.statut === "confirme");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(45,52,54,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20, width: "100%", maxWidth: 780,
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(108,92,231,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#2D3436", margin: 0 }}>{lot.nom}</h2>
            <p style={{ fontSize: 12, color: "#b2bec3", fontFamily: "'Nunito', sans-serif", margin: "2px 0 0", fontWeight: 600 }}>
              {lot.reference_lot} · {confirmes.length} participant{confirmes.length > 1 ? "s" : ""} confirmé{confirmes.length > 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => exportCSV(lot, confirmes)}
              disabled={confirmes.length === 0}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "none", cursor: confirmes.length === 0 ? "not-allowed" : "pointer",
                background: confirmes.length === 0 ? "#f0eeff" : "linear-gradient(135deg, #6C5CE7, #FD79A8)",
                color: confirmes.length === 0 ? "#b2bec3" : "white",
                fontWeight: 800, fontSize: 13, fontFamily: "'Nunito', sans-serif",
                boxShadow: confirmes.length === 0 ? "none" : "0 4px 12px rgba(108,92,231,0.3)",
              }}
            >
              ⬇ Exporter CSV
            </button>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 10, border: "none", background: "#f8f7ff", cursor: "pointer", fontSize: 18, color: "#636e72", display: "flex", alignItems: "center", justifyContent: "center" }}
            >×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflow: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
              <div style={{ width: 32, height: 32, border: "3px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : participations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#b2bec3", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
              Aucune participation pour ce lot.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Nunito', sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f7ff" }}>
                  {["Participant", "Email", "Tickets", "N° tickets", "Statut", "Date"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#A29BFE", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participations.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid #f0eeff" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontWeight: 700, color: "#2D3436", margin: 0 }}>{p.prenom} {p.nom}</p>
                      {p.telephone && <p style={{ fontSize: 11, color: "#b2bec3", margin: "2px 0 0" }}>{p.telephone}</p>}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#636e72" }}>{p.email}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#6C5CE7", textAlign: "center" }}>{p.quantite}</td>
                    <td style={{ padding: "12px 16px", color: "#636e72", fontFamily: "monospace", fontSize: 12 }}>
                      {(p.ticket_numbers ?? []).join(", ")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                        background: `${statutColor[p.statut]}22`,
                        color: statutColor[p.statut],
                      }}>
                        {p.statut === "confirme" ? "Confirmé" : p.statut === "en_attente" ? "En attente" : "Annulé"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#b2bec3", whiteSpace: "nowrap" }}>
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
