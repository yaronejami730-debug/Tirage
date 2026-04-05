"use client";

import { useEffect, useState } from "react";
import { Annonce } from "@/lib/supabase";

export default function AnnouncementBanner() {
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/annonces")
      .then((r) => r.json())
      .then(({ annonce: a }) => {
        if (!a) return;
        const dismissed = sessionStorage.getItem(`annonce-dismissed-${a.id}`);
        if (!dismissed) {
          setAnnonce(a);
          setVisible(true);
        }
      });
  }, []);

  if (!visible || !annonce) return null;

  const dismiss = () => {
    sessionStorage.setItem(`annonce-dismissed-${annonce.id}`, "1");
    setVisible(false);
  };

  // Compute readable text color based on background
  const isDark = (hex: string) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };
  const textColor = isDark(annonce.couleur) ? "white" : "#1a1a1a";

  return (
    <div style={{
      background: annonce.couleur,
      color: textColor,
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 14,
      fontWeight: 700,
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
      minHeight: 42,
    }}>
      {annonce.emoji && <span style={{ fontSize: 18 }}>{annonce.emoji}</span>}
      <span style={{ textAlign: "center", lineHeight: 1.4 }}>{annonce.texte}</span>
      <button
        onClick={dismiss}
        aria-label="Fermer l'annonce"
        style={{
          position: "absolute", right: 12,
          background: "transparent", border: "none", cursor: "pointer",
          color: textColor, opacity: 0.7, fontSize: 18, lineHeight: 1,
          padding: "0 4px",
        }}
      >×</button>
    </div>
  );
}
