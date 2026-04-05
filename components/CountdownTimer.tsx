"use client";

import { useEffect, useState } from "react";

interface Props { dateFin: string; }

export default function CountdownTimer({ dateFin }: Props) {
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

  if (t.expired) return <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 700 }}>Terminé</span>;

  const parts = t.d > 0
    ? [[t.d, "j"], [t.h, "h"], [t.m, "m"], [t.s, "s"]]
    : [[t.h, "h"], [t.m, "m"], [t.s, "s"]];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {parts.map(([val, unit], i) => (
        <span key={unit as string} style={{ display: "inline-flex", alignItems: "baseline", gap: 1 }}>
          {i > 0 && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginRight: 2 }}>:</span>}
          <span style={{ color: "white", fontWeight: 800, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
            {String(val).padStart(2, "0")}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{unit}</span>
        </span>
      ))}
    </span>
  );
}
