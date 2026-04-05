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

  if (t.expired) return (
    <div style={{ textAlign: "center", color: "#E17055", fontWeight: 800, fontSize: 12, padding: "6px 0" }}>
      ⏰ Tirage terminé
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
          {i > 0 && <span style={{ color: "#FF7043", fontWeight: 900, fontSize: 16, lineHeight: 1 }}>:</span>}
          <div style={{ textAlign: "center", minWidth: 40 }}>
            <div style={{
              background: "linear-gradient(135deg, #FF7043, #FDCB6E)",
              borderRadius: 10, padding: "6px 6px 4px",
              fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "white",
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
              boxShadow: "0 3px 10px rgba(255,112,67,0.3)",
              minWidth: 40,
            }}>
              {String(val).padStart(2, "0")}
            </div>
            <div style={{ fontSize: 9, color: "#FF7043", fontWeight: 700, textTransform: "uppercase", marginTop: 3, letterSpacing: "0.5px" }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
