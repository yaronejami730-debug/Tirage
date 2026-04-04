"use client";

import { useState } from "react";
import TicketSelector from "./TicketSelector";

interface ParticipationFormProps {
  lotId: string;
  lotNom: string;
  prixTicket: number;
  maxTickets: number;
}

export default function ParticipationForm({
  lotId,
  lotNom,
  prixTicket,
  maxTickets,
}: ParticipationFormProps) {
  const [quantite, setQuantite] = useState(1);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Adresse email invalide.");
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

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const total = quantite * prixTicket;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ticket selector */}
      <TicketSelector
        max={Math.min(10, maxTickets)}
        value={quantite}
        onChange={setQuantite}
        prixTicket={prixTicket}
      />

      {/* Personal info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Vos informations</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="label">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Jean"
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="nom" className="label">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Dupont"
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean.dupont@email.com"
            className="input-field"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Vos tickets vous seront envoyés à cette adresse.
          </p>
        </div>

        <div>
          <label htmlFor="telephone" className="label">
            Téléphone{" "}
            <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="input-field"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Legal */}
      <p className="text-xs text-gray-500 leading-relaxed">
        En procédant au paiement, vous acceptez que vos données soient
        utilisées pour la gestion de votre participation. Le tirage sera
        effectué par un organisme externe indépendant.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || maxTickets === 0}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Redirection vers le paiement...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Acheter {quantite} ticket{quantite > 1 ? "s" : ""} — {total.toFixed(2)} €
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Paiement sécurisé par Stripe
      </div>
    </form>
  );
}
