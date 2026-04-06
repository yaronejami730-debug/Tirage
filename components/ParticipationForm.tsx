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
  totalTickets: number; // Added for chance calculation
  packs: { qte: number; reduction: number }[] | null; // Added for VIP Packs
  valeurEstimee: number | null; // Added for stats
}

export default function ParticipationForm({
  lotId,
  lotNom,
  lotImage,
  prixTicket,
  maxTickets,
  totalTickets,
  packs,
  valeurEstimee,
}: ParticipationFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); 
  const [quantite, setQuantite] = useState(1);
  const [selectedPackIdx, setSelectedPackIdx] = useState<number | null>(null);
  
  // Question & Answers
  const [currentQuestion, setCurrentQuestion] = useState<{ q: string, a: string, choices: string[] } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: "Tickets" },
    { id: 2, label: "Question" },
    { id: 3, label: "Finalisation" },
  ];

  // Questions generator data
  const questionPool = {
    tech: [
      { q: "Qui a révolutionné l'iPhone ?", a: "Apple", wrong: ["Samsung", "Google", "Microsoft"] },
      { q: "Android appartient à quel groupe ?", a: "Google", wrong: ["Apple", "Huawei", "Amazon"] },
      { q: "Qui fabrique les consoles PlayStation ?", a: "Sony", wrong: ["Nintendo", "Microsoft", "Sega"] }
    ],
    cars: [
      { q: "De quel pays vient la marque Porsche ?", a: "Allemagne", wrong: ["Italie", "France", "USA"] },
      { q: "Tesla est spécialisé dans quel domaine ?", a: "Électrique", wrong: ["Diesel", "Hydraulique", "GPL"] },
      { q: "La marque Ferrari est originaire de ?", a: "Italie", wrong: ["Espagne", "France", "UK"] }
    ],
    luxury: [
      { q: "Quelle marque fabrique la Submariner ?", a: "Rolex", wrong: ["Omega", "Seiko", "Cartier"] },
      { q: "Patek Philippe est célèbre pour ses ?", a: "Montres", wrong: ["Sacs", "Voitures", "Bijoux"] },
      { q: "Louis Vuitton est une marque de ?", a: "Luxe", wrong: ["Sport", "Bricolage", "Gaming"] }
    ]
  };

  const generateQuestion = () => {
    const themes = Object.keys(questionPool) as Array<keyof typeof questionPool>;
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const qList = questionPool[theme];
    const item = qList[Math.floor(Math.random() * qList.length)];
    const choices = [item.a, ...item.wrong].sort(() => Math.random() - 0.5);
    setCurrentQuestion({ q: item.q, a: item.a, choices });
  };

  const handleNext = () => {
    setError(null);
    setDirection(1);
    if (step === 1) {
      if (!currentQuestion) generateQuestion();
      setStep(2);
    } else if (step === 2) {
      if (!userAnswer) {
        setError("Veuillez répondre à la question pour continuer.");
        return;
      }
      if (userAnswer !== currentQuestion?.a) {
        setIsWrong(true);
        setError("Mauvaise réponse ! Réessayez.");
        return;
      }
      setStep(3);
    }
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleBack = () => {
    setDirection(-1);
    setIsWrong(false);
    setError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
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

  const currentPack = packs?.find(p => p.qte === quantite);
  const reduction = currentPack ? currentPack.reduction : 0;
  const originalTotal = quantite * prixTicket;
  const total = (originalTotal * (1 - reduction / 100)).toFixed(0);

  const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <div className="w-full">
      {/* PROGRESS BAR - 3 Steps */}
      <div style={{ marginBottom: 60, padding: "40px 10% 0" }}>
        <div style={{ position: "relative" }}>
          {/* Background line */}
          <div style={{ 
            position: "absolute", top: "50%", left: 0, right: 0, height: 2, 
            background: "#f0eeff", transform: "translateY(-50%)", zIndex: 0 
          }} />
          
          {/* Active part line */}
          <motion.div 
            initial={false}
            animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            transition={transition}
            style={{ 
              position: "absolute", top: "50%", left: 0, height: 4, 
              background: "linear-gradient(90deg, #6C5CE7, #A29BFE)", 
              transform: "translateY(-50%)", zIndex: 1, 
              borderRadius: 4 
            }} 
          />
          
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {steps.map((s) => (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {/* Labels above */}
                <motion.div 
                  animate={{ 
                    color: step >= s.id ? "#6C5CE7" : "#b2bec3", 
                    scale: step === s.id ? 1.05 : 1,
                    y: step === s.id ? -10 : 0
                  }}
                  style={{ 
                    position: "absolute", bottom: 25, width: 120, textAlign: "center",
                    fontSize: 10, fontWeight: 900, textTransform: "uppercase", 
                    letterSpacing: "1px", whiteSpace: "nowrap"
                  }}
                >
                  {s.label}
                </motion.div>
                
                {/* Dot */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   {step === s.id && (
                     <motion.div 
                       layoutId="pulse"
                       animate={{ 
                         scale: [1, 1.8, 1],
                         opacity: [0.6, 0.2, 0.6]
                       }}
                       transition={{ repeat: Infinity, duration: 2 }}
                       style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "#6C5CE744" }}
                     />
                   )}
                   <motion.div 
                     animate={{ 
                       background: step >= s.id ? "#6C5CE7" : "white", 
                       borderColor: step >= s.id ? "#6C5CE7" : "#f0eeff",
                       scale: step === s.id ? 1.3 : 1,
                       boxShadow: step === s.id ? "0 4px 15px rgba(108,92,231,0.4)" : "none"
                     }}
                     style={{ 
                       width: 14, height: 14, borderRadius: "50%", border: "2px solid", 
                       zIndex: 3, position: "relative", transition: "all 0.3s ease",
                       display: "flex", alignItems: "center", justifyContent: "center"
                     }} 
                   >
                      {step > s.id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: "white", fontSize: 8 }}>✓</motion.span>}
                   </motion.div>
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
              <div className="space-y-8">
                {/* Stats du lot - Rapportées ici */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                  <div style={{ background: "#fff9e6", borderRadius: 16, padding: "12px 8px", textAlign: "center", border: "1.5px solid #FDCB6E33" }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>💰</div>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#e6a817", lineHeight: 1 }}>{Number(prixTicket).toFixed(2)} €</div>
                    <div style={{ fontSize: 9, color: "#636E72", fontWeight: 800, marginTop: 4, textTransform: "uppercase" }}>Prix / ticket</div>
                  </div>
                  <div style={{ background: "#f0eeff", borderRadius: 16, padding: "12px 8px", textAlign: "center", border: "1.5px solid #A29BFE33" }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>📊</div>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#6C5CE7", lineHeight: 1 }}>{totalTickets}</div>
                    <div style={{ fontSize: 9, color: "#636E72", fontWeight: 800, marginTop: 4, textTransform: "uppercase" }}>Total tickets</div>
                  </div>
                  <div style={{ background: "#fff9e6", borderRadius: 16, padding: "12px 8px", textAlign: "center", border: "1.5px solid #FDCB6E33" }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>💎</div>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#e6a817", lineHeight: 1 }}>{Number(valeurEstimee || 0).toFixed(0)} €</div>
                    <div style={{ fontSize: 9, color: "#636E72", fontWeight: 800, marginTop: 4, textTransform: "uppercase" }}>Valeur lot</div>
                  </div>
                </div>

                {/* Packs VIP */}
                {packs && packs.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 24 }}>💎</span>
                      <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#2D3436", margin: 0 }}>VIP PACK</h3>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                      {packs.map((p, i) => {
                        const chance = Math.round(totalTickets / p.qte);
                        const isSelected = quantite === p.qte;
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setQuantite(p.qte);
                              setSelectedPackIdx(i);
                            }}
                            style={{
                              background: isSelected ? "linear-gradient(135deg, #6C5CE7, #A29BFE)" : "white",
                              borderRadius: 20,
                              padding: "20px 15px",
                              textAlign: "center",
                              cursor: "pointer",
                              border: isSelected ? "none" : "2px solid #f0eeff",
                              boxShadow: isSelected ? "0 10px 25px rgba(108,92,231,0.3)" : "none",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div style={{ fontSize: 28, fontFamily: "'Fredoka One', cursive", color: isSelected ? "white" : "#2D3436", marginBottom: 4 }}>
                              {p.qte}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: isSelected ? "rgba(255,255,255,0.9)" : "#6C5CE7", textTransform: "uppercase", marginBottom: 8 }}>
                              {p.reduction}% OFF
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.7)" : "#b2bec3" }}>
                              1/{chance} chance de gagner
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Séparateur conditionnel */}
                {packs && packs.length > 0 && (
                  <div style={{ textAlign: "center", position: "relative", margin: "40px 0" }}>
                     <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#f0eeff", zIndex: 0 }} />
                     <span style={{ 
                       position: "relative", zIndex: 1, background: "white", padding: "0 20px", 
                       fontSize: 12, fontWeight: 900, color: "#b2bec3", 
                       textTransform: "uppercase", letterSpacing: "2px" 
                     }}>
                       OU MANUEL
                     </span>
                  </div>
                )}

                <TicketSelector
                  max={Math.min(50, maxTickets)}
                  value={quantite}
                  onChange={(val) => {
                    setQuantite(val);
                    setSelectedPackIdx(null);
                  }}
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

            {/* ÉTAPE 2: QUESTION */}
            {step === 2 && currentQuestion && (
              <motion.div 
                key="step2" 
                custom={direction}
                initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 50 : -50, opacity: 0 }}
                transition={transition}
                className="space-y-8"
              >
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                  <div style={{ 
                    display: "inline-block", background: "#f0eeff", color: "#6C5CE7", 
                    padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 900, 
                    marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" 
                  }}>
                    Vérification de participation
                  </div>
                  <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#2D3436", margin: 0 }}>
                    {currentQuestion.q}
                  </h3>
                  <p style={{ color: "#636E72", fontSize: 14, marginTop: 10 }}>
                    Répondez correctement pour valider votre éligibilité.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.choices.map((choice, idx) => {
                    const isSelected = userAnswer === choice;
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setUserAnswer(choice);
                          setIsWrong(false);
                          setError(null);
                        }}
                        style={{
                          background: isSelected ? "#6C5CE7" : "white",
                          color: isSelected ? "white" : "#2D3436",
                          border: isSelected ? "none" : "2px solid #f0eeff",
                          padding: "20px",
                          borderRadius: 20,
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 8px 20px rgba(108,92,231,0.25)" : "none"
                        }}
                      >
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ background: "#fff5f5", color: "#e17055", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: "center", border: "1px solid #ff000022" }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleBack} className="btn-fun-secondary" style={{ flex: 1, height: 55 }}>Retour</button>
                  <button type="button" onClick={handleNext} className="btn-fun shadow-lg" style={{ flex: 2, height: 55 }}>Suivant</button>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 3: FINALISATION */}
            {step === 3 && (
              <motion.div 
                key="step3" 
                custom={direction}
                initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 50 : -50, opacity: 0 }}
                transition={transition}
                className="space-y-8"
              >
                {/* Formulaire */}
                <div style={{ background: "white", borderRadius: 32, padding: "32px", border: "1px solid #f0eeff", boxShadow: "0 22px 60px rgba(108,92,231,0.06)" }}>
                  <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#2D3436", marginBottom: 24, textAlign: "center" }}>
                    Vos informations 👤
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%" }} required={step === 3} />
                    <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%" }} required={step === 3} />
                  </div>
                  <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #f0eeff", width: "100%", marginBottom: 12 }} required={step === 3} />
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

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, paddingTop: 24, borderTop: "1px dashed #f0eeff" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: "#636E72", display: "block", marginBottom: 4 }}>TOTAL À PAYER :</span>
                      {reduction > 0 && (
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#b2bec3", textDecoration: "line-through", marginRight: 10 }}>
                          {originalTotal.toFixed(0)} €
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {reduction > 0 && (
                        <span style={{ 
                          background: "#E17055", color: "white", padding: "4px 10px", 
                          borderRadius: 8, fontSize: 11, fontWeight: 900, 
                          verticalAlign: "middle", marginRight: 10
                        }}>
                          -{reduction}% OFF
                        </span>
                      )}
                      <span style={{ fontSize: 38, fontWeight: 900, color: "#2D3436", lineHeight: 1 }}>{total} €</span>
                    </div>
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

                    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", height: 36, gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#636E72" }}>+ Apple / Google Pay</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button type="button" onClick={handleBack} style={{ color: "#6C5CE7", fontWeight: 800, fontSize: 14, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    ← Retour à la question
                  </button>
                </div>
              </motion.div>
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
