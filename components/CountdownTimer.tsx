"use client";

import { useEffect, useState } from "react";

interface Props { dateFin: string; variant?: "hero"; }

export default function CountdownTimer({ dateFin, variant }: Props) {
  const isHero = variant === "hero";
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dateFin).getTime() - Date.now();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [dateFin]);

  if (t.expired) return (
    <div style={{ textAlign: "center", color: "#6e6e73", fontWeight: 600, fontSize: 12, padding: "6px 0" }}>
      Tirage terminé
    </div>
  );

  const units = [
    { val: t.d, label: "jours" },
    { val: t.h, label: "heures" },
    { val: t.m, label: "min" },
    { val: t.s, label: "sec" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
      {units.map(({ val, label }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && (
            <span style={{
              color: isHero ? "rgba(255,255,255,0.4)" : "#d2d2d7",
              fontWeight: 500, fontSize: 14, lineHeight: 1,
            }}>:</span>
          )}
          <div style={{ textAlign: "center", minWidth: 36 }}>
            <div style={{
              background: isHero ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
              border: isHero ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.07)",
              borderRadius: 8, padding: "5px 6px 4px",
              fontFamily: "inherit",
              fontSize: 17, fontWeight: 600,
              color: isHero ? "#ffffff" : "#1d1d1f",
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
              minWidth: 36, letterSpacing: "-0.02em",
            }}>
              {String(val).padStart(2, "0")}
            </div>
            <div style={{
              fontSize: 9, fontWeight: 500,
              color: isHero ? "rgba(255,255,255,0.5)" : "#a1a1a6",
              textTransform: "uppercase", marginTop: 3, letterSpacing: "0.05em",
            }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
