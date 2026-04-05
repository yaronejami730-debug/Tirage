"use client";
import { usePresence } from "@/hooks/usePresence";

export default function GlobalOnlineBadge() {
  const count = usePresence("platform");

  return (
    <div style={{
      position: "fixed", top: 14, right: 16, zIndex: 1000,
      display: "flex", alignItems: "center", gap: 7,
      background: "rgba(20,20,30,0.72)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 999,
      padding: "7px 16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "#00B894", display: "block",
        boxShadow: "0 0 8px #00B894",
        animation: "glowPulse 2s ease-in-out infinite",
      }} />
      <span style={{
        fontSize: 12, fontWeight: 800, color: "white",
        fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap",
      }}>
        {count} joueur{count > 1 ? "s" : ""} en ligne
      </span>
      <style>{`
        @keyframes glowPulse {
          0%,100% { opacity: 1; box-shadow: 0 0 8px #00B894; }
          50% { opacity: 0.6; box-shadow: 0 0 16px #00B894; }
        }
      `}</style>
    </div>
  );
}
