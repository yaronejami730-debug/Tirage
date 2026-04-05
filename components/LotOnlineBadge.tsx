"use client";
import { usePresence } from "@/hooks/usePresence";

export default function LotOnlineBadge({ lotId }: { lotId: string }) {
  const lotCount = usePresence(`lot-${lotId}`);
  const totalCount = usePresence("platform");

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      {lotCount > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#fff3e0", borderRadius: 999,
          padding: "7px 14px", border: "1.5px solid #FF704344",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#FF7043", display: "block",
            boxShadow: "0 0 6px #FF7043",
            animation: "lotPulse 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: "#FF7043", fontFamily: "'Nunito', sans-serif" }}>
            👀 {lotCount} joueur{lotCount > 1 ? "s" : ""} regardent ce lot
          </span>
        </div>
      )}
      {totalCount > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#f0fff8", borderRadius: 999,
          padding: "7px 14px", border: "1.5px solid #00B89444",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#00B894", display: "block",
            boxShadow: "0 0 6px #00B894",
            animation: "lotPulse 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: "#00B894", fontFamily: "'Nunito', sans-serif" }}>
            🌐 {totalCount} joueur{totalCount > 1 ? "s" : ""} sur la plateforme
          </span>
        </div>
      )}
      <style>{`
        @keyframes lotPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
