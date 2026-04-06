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
  totalTickets: number;
  packs: { qte: number; reduction: number }[] | null;
  valeurEstimee: number | null;
}

export default function ParticipationForm({
  lotId, lotNom, lotImage, prixTicket, maxTickets, totalTickets, packs, valeurEstimee,
}: ParticipationFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [quantite, setQuantite] = useState(1);

  const [currentQuestion, setCurrentQuestion] = useState<{ q: string; a: string; choices: string[] } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, label: "Sélection" },
    { id: 2, label: "Vérification" },
    { id: 3, label: "Finalisation" },
  ];

  const questionPool = {
    tech: [
      { q: "Qui a révolutionné l'iPhone ?", a: "Apple", wrong: ["Samsung", "Google", "Microsoft"] },
      { q: "Android appartient à quel groupe ?", a: "Google", wrong: ["Apple", "Huawei", "Amazon"] },
      { q: "Qui fabrique les consoles PlayStation ?", a: "Sony", wrong: ["Nintendo", "Microsoft", "Sega"] },
    ],
    cars: [
      { q: "De quel pays vient la marque Porsche ?", a: "Allemagne", wrong: ["Italie", "France", "USA"] },
      { q: "Tesla est spécialisé dans quel domaine ?", a: "Électrique", wrong: ["Diesel", "Hydraulique", "GPL"] },
      { q: "La marque Ferrari est originaire de ?", a: "Italie", wrong: ["Espagne", "France", "UK"] },
    ],
    luxury: [
      { q: "Quelle marque fabrique la Submariner ?", a: "Rolex", wrong: ["Omega", "Seiko", "Cartier"] },
      { q: "Patek Philippe est célèbre pour ses ?", a: "Montres", wrong: ["Sacs", "Voitures", "Bijoux"] },
      { q: "Louis Vuitton est une marque de ?", a: "Luxe", wrong: ["Sport", "Bricolage", "Gaming"] },
    ],
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
      if (!userAnswer) { setError("Veuillez répondre à la question."); return; }
      if (userAnswer !== currentQuestion?.a) { setError("Mauvaise réponse. Réessayez."); return; }
      setStep(3);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { handleNext(); return; }
    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lot_id: lotId, nom: nom.trim(), prenom: prenom.trim(), email: email.trim().toLowerCase(), telephone: telephone.trim() || null, quantite }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Une erreur est survenue."); return; }
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const currentPack = packs?.find(p => p.qte === quantite);
  const reduction = currentPack ? currentPack.reduction : 0;
  const originalTotal = quantite * prixTicket;
  const total = (originalTotal * (1 - reduction / 100)).toFixed(0);

  const spring = { type: "spring" as const, stiffness: 280, damping: 28 };

  const S = {
    input: {
      width: "100%", padding: "13px 16px", borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff",
      fontFamily: "inherit", fontSize: 14, color: "#111111", outline: "none",
      transition: "border-color .2s, box-shadow .2s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    } as React.CSSProperties,
  };

  return (
    <div className="w-full">

      {/* ── Progress ────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: `1px solid ${step >= s.id ? "rgba(123,77,255,0.4)" : "rgba(0,0,0,0.1)"}`,
                  background: step > s.id ? "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)" : step === s.id ? "rgba(123,77,255,0.08)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600,
                  color: step > s.id ? "#ffffff" : step === s.id ? "#7B4DFF" : "#a1a1a6",
                  transition: "all .3s",
                }}>
                  {step > s.id ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.id}
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: step >= s.id ? "#6e6e73" : "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, margin: "0 8px", marginBottom: 20, background: step > s.id ? "rgba(123,77,255,0.25)" : "rgba(0,0,0,0.07)", transition: "background .3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 40 : -40, opacity: 0 }}
            transition={spring}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >

            {/* ─── ÉTAPE 1 : TICKETS ─────────────── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { label: "Prix / ticket", val: `${Number(prixTicket).toFixed(Number(prixTicket) % 1 === 0 ? 0 : 2)} €` },
                    { label: "Total tickets", val: totalTickets },
                    { label: "Valeur lot", val: valeurEstimee ? `${Number(valeurEstimee).toFixed(0)} €` : "—" },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: "#f8f8fa", borderRadius: 10, padding: "12px 10px",
                      textAlign: "center", border: "1px solid rgba(0,0,0,0.06)",
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111111", letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 500, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Packs VIP */}
                {packs && packs.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                      Packs — Meilleur prix
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {packs.map((p, i) => {
                        const isSelected = quantite === p.qte;
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setQuantite(p.qte)}
                            style={{
                              background: isSelected ? "rgba(123,77,255,0.07)" : "#f8f8fa",
                              borderRadius: 12, padding: "16px 14px", textAlign: "center",
                              cursor: "pointer",
                              border: `1px solid ${isSelected ? "rgba(123,77,255,0.3)" : "rgba(0,0,0,0.07)"}`,
                              transition: "all .2s",
                            }}
                          >
                            <div style={{ fontSize: 22, fontWeight: 700, color: isSelected ? "#7B4DFF" : "#1d1d1f", letterSpacing: "-0.02em" }}>
                              {p.qte}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? "#7B4DFF" : "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
                              -{p.reduction}%
                            </div>
                            <div style={{ fontSize: 10, color: "#a0a0a0", marginTop: 4 }}>
                              1/{Math.round(totalTickets / p.qte)} chance
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: "center", margin: "16px 0", fontSize: 12, color: "#a0a0a0" }}>ou choisir manuellement</div>
                  </div>
                )}

                <TicketSelector
                  max={Math.min(50, maxTickets)}
                  value={quantite}
                  onChange={(val) => setQuantite(val)}
                  prixTicket={prixTicket}
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button" onClick={handleNext}
                  style={{
                    width: "100%", background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", color: "#ffffff",
                    padding: "15px", borderRadius: 980, border: "none",
                    fontFamily: "inherit", fontSize: 15, fontWeight: 600,
                    letterSpacing: "-0.01em", cursor: "pointer",
                    transition: "background .2s",
                  }}
                >
                  Continuer
                </motion.button>
              </div>
            )}

            {/* ─── ÉTAPE 2 : QUESTION ─────────────── */}
            {step === 2 && currentQuestion && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ textAlign: "center", paddingBottom: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#a0a0a0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                    Question de qualification
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111111", letterSpacing: "-0.02em", lineHeight: 1.4, margin: 0 }}>
                    {currentQuestion.q}
                  </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {currentQuestion.choices.map((choice, idx) => {
                    const isSelected = userAnswer === choice;
                    return (
                      <motion.button
                        key={idx} type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setUserAnswer(choice); setError(null); }}
                        style={{
                          background: isSelected ? "rgba(123,77,255,0.07)" : "#f8f8fa",
                          color: isSelected ? "#7B4DFF" : "#6e6e73",
                          border: `1px solid ${isSelected ? "rgba(123,77,255,0.3)" : "rgba(0,0,0,0.07)"}`,
                          padding: "16px 12px", borderRadius: 12,
                          fontSize: 14, fontWeight: 500, textAlign: "center",
                          cursor: "pointer", transition: "all .2s", fontFamily: "inherit",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>

                {error && (
                  <div style={{ background: "rgba(255,59,48,0.06)", color: "#d70015", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(215,0,21,0.12)" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={handleBack}
                    style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "transparent", color: "#6b6b6b", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    Retour
                  </button>
                  <button type="button" onClick={handleNext}
                    style={{ flex: 2, padding: "13px", borderRadius: 980, border: "none", background: "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)", color: "#ffffff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em" }}>
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* ─── ÉTAPE 3 : FINALISATION ──────────── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Formulaire */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input
                      type="text" placeholder="Prénom" value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      style={S.input} required
                      onFocus={e => { e.target.style.borderColor = "rgba(123,77,255,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,77,255,0.07)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(0,0,0,0.1)"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                    />
                    <input
                      type="text" placeholder="Nom" value={nom}
                      onChange={e => setNom(e.target.value)}
                      style={S.input} required
                      onFocus={e => { e.target.style.borderColor = "rgba(123,77,255,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,77,255,0.07)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(0,0,0,0.1)"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                    />
                  </div>
                  <input
                    type="email" placeholder="Adresse e-mail" value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={S.input} required
                    onFocus={e => { e.target.style.borderColor = "rgba(123,77,255,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,77,255,0.07)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(0,0,0,0.1)"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                  />
                  <input
                    type="tel" placeholder="Téléphone (optionnel)" value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    style={S.input}
                    onFocus={e => { e.target.style.borderColor = "rgba(123,77,255,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,77,255,0.07)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(0,0,0,0.1)"; e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                  />
                </div>

                {/* Récapitulatif */}
                <div style={{ background: "#f8f8fa", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                    {lotImage && (
                      <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#e8e8ed" }}>
                        <Image src={lotImage} alt={lotNom} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111111", letterSpacing: "-0.01em" }}>{lotNom}</div>
                      <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 2 }}>
                        {quantite} ticket{quantite > 1 ? "s" : ""} × {prixTicket.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#6b6b6b", fontWeight: 500 }}>Total</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {reduction > 0 && (
                        <>
                          <span style={{ fontSize: 12, color: "#a0a0a0", textDecoration: "line-through" }}>{originalTotal.toFixed(0)} €</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#7B4DFF", background: "rgba(123,77,255,0.08)", padding: "2px 8px", borderRadius: 4 }}>-{reduction}%</span>
                        </>
                      )}
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#111111", letterSpacing: "-0.02em" }}>{total} €</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div style={{ background: "rgba(255,59,48,0.06)", color: "#d70015", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(215,0,21,0.12)" }}>
                    {error}
                  </div>
                )}

                {/* CTA paiement */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", background: loading ? "rgba(123,77,255,0.5)" : "linear-gradient(135deg, #4F8CFF 0%, #7B4DFF 100%)",
                    color: "#ffffff", padding: "16px 24px", borderRadius: 12,
                    border: "none", cursor: loading ? "wait" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    fontFamily: "inherit", fontSize: 15, fontWeight: 700,
                    letterSpacing: "-0.01em", transition: "all .2s",
                    boxShadow: "0 10px 20px -10px rgba(123,77,255,0.4)",
                  }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: "spin .8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                      Redirection...
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Procéder au paiement sécurisé — {total} €
                    </>
                  )}
                </motion.button>

                {/* Secure Payment Icons */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: -4 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.8 }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 10, filter: "grayscale(1) brightness(0.5)" }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 16, filter: "grayscale(1) brightness(0.5)" }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: 14, filter: "grayscale(1) brightness(0.5)" }} />
                   </div>
                   <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                     Tirage sécurisé par Stripe
                   </div>
                </div>

                <button type="button" onClick={handleBack}
                  style={{ textAlign: "center", color: "#a0a0a0", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", paddingTop: 4 }}>
                  ← Retour
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </form>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
