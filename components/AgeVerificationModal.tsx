"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AgeVerificationModal() {
  const [show, setShow] = useState(false);
  const [isOver18, setIsOver18] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem("gowingo_age_verified");
    if (!verified) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleConfirm = () => {
    if (isOver18 === true) {
      localStorage.setItem("gowingo_age_verified", "true");
      setShow(false);
      document.body.style.overflow = "auto";
    } else if (isOver18 === false) {
      alert("Désolé, vous devez avoir plus de 18 ans pour accéder à GoWinGo.");
      window.location.href = "https://www.google.com";
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(108,92,231,0.2)", backdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fade-in 0.6s ease"
    }}>
      {/* Container */}
      <div style={{
        width: "100%", maxWidth: 480, background: "white", borderRadius: 32, 
        overflow: "hidden", boxShadow: "0 40px 100px rgba(108,92,231,0.25)",
        border: "1px solid rgba(108,92,231,0.1)",
        animation: "bounce-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        
        {/* HEADER - Brand Gradient */}
        <div style={{ 
          background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)", 
          padding: "48px 24px", textAlign: "center", position: "relative" 
        }}>
          {/* Decorative shapes */}
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
          <div style={{ position: "absolute", bottom: -10, left: -10, width: 60, height: 60, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
          
          <div style={{ position: "relative", width: 200, height: 60, margin: "0 auto 16px" }}>
             <Image src="/images/logo-gowingo.png" alt="GoWinGo" fill style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <div style={{ 
            color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 800, 
            letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Nunito', sans-serif" 
          }}>
            # BIENVENUE SUR GOWINGO 🎰
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "40px 40px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "#2D3436", marginBottom: 12 }}>
            Vérification d&apos;âge
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#636E72", fontSize: 16, marginBottom: 32, lineHeight: 1.6, fontWeight: 600 }}>
            Veuillez confirmer que vous avez plus de 18 ans pour accéder aux tirages en cours.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left", marginBottom: 36 }}>
            <label style={{ 
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer", 
              fontSize: 16, color: "#2D3436", fontWeight: 800, padding: "16px 20px",
              background: isOver18 === true ? "#f8f7ff" : "white",
              borderRadius: 16, border: "2px solid",
              borderColor: isOver18 === true ? "#6C5CE7" : "#f0eeff",
              transition: "all 0.2s"
            }}>
              <input 
                type="radio" 
                name="age" 
                checked={isOver18 === true}
                onChange={() => setIsOver18(true)}
                style={{ width: 22, height: 22, accentColor: "#6C5CE7" }} 
              />
              Oui, j&apos;ai plus de 18 ans
            </label>
            <label style={{ 
             display: "flex", alignItems: "center", gap: 14, cursor: "pointer", 
             fontSize: 16, color: "#2D3436", fontWeight: 800, padding: "16px 20px",
             background: isOver18 === false ? "#fff5f5" : "white",
             borderRadius: 16, border: "2px solid",
             borderColor: isOver18 === false ? "#ff4757" : "#f0eeff",
             transition: "all 0.2s"
            }}>
              <input 
                type="radio" 
                name="age" 
                checked={isOver18 === false}
                onChange={() => setIsOver18(false)}
                style={{ width: 22, height: 22, accentColor: "#ff4757" }} 
              />
              Non, je suis mineur
            </label>
          </div>

          <button 
            onClick={handleConfirm}
            style={{
              width: "100%", padding: "20px", 
              background: "linear-gradient(135deg, #6C5CE7, #A29BFE)", 
              color: "white", borderRadius: 20,
              fontSize: 18, fontWeight: 900, cursor: isOver18 === null ? "not-allowed" : "pointer",
              transition: "all 0.3s", opacity: isOver18 === null ? 0.5 : 1,
              boxShadow: isOver18 === true ? "0 10px 30px rgba(108,92,231,0.4)" : "none",
              border: "none", fontFamily: "'Fredoka One', cursive"
            }}
          >
            Accéder au site
          </button>

          <p style={{ color: "#b2bec3", fontSize: 11, marginTop: 40, lineHeight: 1.6, textAlign: "center", fontWeight: 700 }}>
            Les participants doivent confirmer être majeurs avant de jouer. GoWinGo se réserve le droit de vérifier l&apos;identité lors de la remise des lots.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-in { 
          from { opacity: 0; transform: scale(0.9) translateY(40px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </div>
  );
}
