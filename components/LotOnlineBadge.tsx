"use client";
import { usePresence } from "@/hooks/usePresence";

export default function LotOnlineBadge({ lotId }: { lotId: string }) {
  const lotCount = usePresence(`lot-${lotId}`);

  if (lotCount < 2) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(0,0,0,0.04)", borderRadius: 999,
        padding: "7px 14px", border: "1px solid rgba(0,0,0,0.08)",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#34c759", display: "block",
          flexShrink: 0,
          animation: "lotPulse 2s ease-in-out infinite",
        }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#6e6e73", fontFamily: "inherit" }}>
          {lotCount} personne{lotCount > 1 ? "s" : ""} regard{lotCount > 1 ? "ent" : "e"} ce lot
        </span>
      </div>
      <style>{`
        @keyframes lotPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
