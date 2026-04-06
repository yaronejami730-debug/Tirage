"use client";

import { useState } from "react";
import TicketSelector from "./TicketSelector";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ParticipationFormProps {
  lotId: string;
  lotNom: string;
  lotImage: string | null;
  prixTicket: number;
  maxTickets: number;
}

export default function ParticipationForm({
  lotId,
  lotNom,
  lotImage,
  prixTicket,
  maxTickets,
}: ParticipationFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); 
  const [quantite, setQuantite] = useState(1);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: "Choix du ticket" },
    { id: 2, label: "Finalisation" },
  ];

  const handleNext = () => {
    setError(null);
    setDirection(1);
    setStep(2);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }

    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot_id: lotId,
          nom: nom.trim(),
          prenom: prenom.trim(),
          email: email.trim().toLowerCase(),
          telephone: telephone.trim() || null,
          quantite,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      if (data.url) window.location.href = data.url;
    } catch {
      setError("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const total = (quantite * prixTicket).toFixed(0);

  const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="w-full">
      {/* PROGRESS BAR - 2 Steps */}
      <div style={{ paddingBottom: 50, marginBottom: 40, borderBottom: "1px solid #f0eeff" }}>
        <div style={{ position: "relative", maxWidth: 400, margin: "0 auto" }}>
          
          <div style={{ position: "absolute", top: 48, left: "15%", right: "15%", height: 3, background: "#f0eeff", borderRadius: 4, zIndex: 0 }} />
          
          <motion.div 
            initial={false}
            animate={{ width: step === 1 ? "0%" : "70%" }}
            transition={transition}
            style={{ position: "absolute", top: 48, left: "15%", height: 3, background: "#6C5CE7", borderRadius: 4, zIndex: 1 }} 
          />
          
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {steps.map((s) => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120, textAlign: "center" }}>
                <motion.div 
                  animate={{ color: step >= s.id ? "#6C5CE7" : "#b2bec3", scale: step === s.id ? 1.05 : 1 }}
                  style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 18 }}
                >
                  {s.label}
                </motion.div>
                
                <div style={{ position: "relative" }}>
                   {step === s.id && (
                     <motion.div 
                       layoutId="pulse"
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1.8, opacity: 0 }}
                       transition={{ repeat: Infinity, duration: 1.5 }}
                       style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "#6C5CE744" }}
                     />
                   )}
                   <motion.div 
                     animate={{ 
                       background: step >= s.id ? "#6C5CE7" : "white", 
                       borderColor: step >= s.id ? "#6C5CE7" : "#f0eeff",
                       scale: step === s.id ? 1.2 : 1
                     }}
                     style={{ 
                       width: 14, height: 14, borderRadius: "50%", border: "2px solid", zIndex: 3, position: "relative",
                       boxShadow: step === s.id ? "0 0 0 4px white" : "none"
                     }} 
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 50 : -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            
            {/* ÉTAPE 1: SÉLECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <TicketSelector
                  max={Math.min(50, maxTickets)}
                  value={quantite}
                  onChange={setQuantite}
                  prixTicket={prixTicket}
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button" onClick={handleNext} 
                  className="btn-primary w-full" 
                  style={{ background: "#6C5CE7", boxShadow: "0 10px 30px rgba(108, 92, 231, 0.3)", padding: "20px", fontSize: 18 }}
                >
                  Suivant →
                </motion.button>
              </div>
            )}

            {/* ÉTAPE 2: FORMULAIRE + RÉCAPITULATIF */}
            {step === 2 && (
              <div className="space-y-8">
                
                {/* Formulaire */}
                <div style={{ background: "white", borderRadius: 32, padding: "32px", border: "1px solid #f0eeff", boxShadow: "0 22px 60px rgba(108,92,231,0.06)" }}>
                  <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#2D3436", marginBottom: 24, textAlign: "center" }}>
                    Vos informations 👤
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%" }} required />
                    <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%" }} required />
                  </div>
                  <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%", marginBottom: 12 }} required />
                  <input type="tel" placeholder="Téléphone (Optionnel)" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%" }} />
                </div>

                {/* Récapitulatif Style Site */}
                <div style={{ background: "white", borderRadius: 32, padding: "40px", border: "1px solid #f0eeff", boxShadow: "0 30px 80px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#2D3436", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 32 }}>
                    RÉCAPITULATIF COMMANDE
                  </div>
                  
                  <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32 }}>
                     <div style={{ 
                       width: 140, height: 140, background: "#F8F9FF", 
                       borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", 
                       boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden"
                     }}>
                       {lotImage ? (
                         <Image src={lotImage} alt={lotNom} fill style={{ objectFit: "cover" }} />
                       ) : (
                         <span style={{ fontSize: 48 }}>🎁</span>
                       )}
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{ color: "#6C5CE7", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>LOT À REMPORTER</div>
                       <div style={{ color: "#2D3436", fontWeight: 900, fontSize: 20, marginBottom: 6, lineHeight: 1.2 }}>{lotNom}</div>
                       <div style={{ color: "#b2bec3", fontWeight: 800, fontSize: 14 }}>{quantite} TICKETS × {prixTicket.toFixed(2)} €</div>
                     </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, paddingTop: 24, borderTop: "1px dashed #f0eeff" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#636E72" }}>TOTAL :</span>
                    <span style={{ fontSize: 36, fontWeight: 900, color: "#2D3436" }}>{total} €</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", background: loading ? "#1a6b52" : "#124b38", color: "white", padding: "20px 24px", borderRadius: 24,
                      border: "none", cursor: loading ? "wait" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                      boxShadow: "0 15px 40px rgba(18,75,56,0.3)",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {loading ? (
                        <svg style={{ animation: "spin .8s linear infinite" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      )}
                      <span style={{ fontWeight: 900, fontSize: 18 }}>
                        {loading ? "Redirection en cours..." : "Continuer vers le paiement"}
                      </span>
                    </div>
                    {!loading && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.5px" }}>
                        🔒 Paiement 100% sécurisé par Stripe
                      </span>
                    )}
                  </motion.button>
                  
                  {/* Logos de paiement */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
                    {/* VISA */}
                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", height: 36 }}>
                      <svg viewBox="0 0 48 16" width="48" height="16" style={{ display: "block" }}>
                        <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#1434CB" letterSpacing="-0.5">VISA</text>
                      </svg>
                    </div>

                    {/* MASTERCARD */}
                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", height: 36 }}>
                      <svg viewBox="0 0 38 24" width="38" height="24" style={{ display: "block" }}>
                        <circle cx="13" cy="12" r="11" fill="#EB001B" />
                        <circle cx="25" cy="12" r="11" fill="#F79E1B" />
                        <path d="M19 4.7a11 11 0 0 1 0 14.6A11 11 0 0 1 19 4.7z" fill="#FF5F00" />
                      </svg>
                    </div>

                    {/* CB */}
                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", height: 36 }}>
                      <svg viewBox="0 0 32 24" width="32" height="24" style={{ display: "block" }}>
                        <rect x="2" y="4" width="28" height="16" rx="3" fill="#003189" />
                        <text x="16" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="9" fill="white" textAnchor="middle">CB</text>
                      </svg>
                    </div>

                    {/* GOOGLE PAY */}
                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5, height: 36 }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" style={{ display: "block" }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#3c4043", fontFamily: "Arial, sans-serif" }}>Pay</span>
                    </div>

                    {/* APPLE PAY */}
                    <div style={{ background: "black", border: "1px solid #1a1a1a", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 5, height: 36 }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" style={{ display: "block" }}>
                        <path fill="white" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif" }}>Pay</span>
                    </div>

                    {/* STRIPE */}
                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", height: 36 }}>
                      <svg viewBox="0 0 60 25" width="40" height="17" style={{ display: "block" }}>
                        <text x="0" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#635BFF">stripe</text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button type="button" onClick={handleBack} style={{ color: "#6C5CE7", fontWeight: 800, fontSize: 14, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    ← Modifier ma sélection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "20px", borderRadius: 20, background: "#fff5f5", color: "#c53030", fontSize: 14, fontWeight: 800, border: "2px solid #fed7d7", textAlign: "center", marginTop: 24 }}>
            ⚠️ {error}
          </motion.div>
        )}
      </form>
    </div>
  );
}
