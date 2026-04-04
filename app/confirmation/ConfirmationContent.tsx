"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Participation, Lot } from "@/lib/supabase";

type ParticipationWithLot = Participation & {
  lots: Pick<Lot, "nom" | "reference_lot" | "image_url">;
};

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [participation, setParticipation] =
    useState<ParticipationWithLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Aucun identifiant de session.");
      setLoading(false);
      return;
    }

    const fetchParticipation = async () => {
      let attempts = 0;
      const maxAttempts = 8;

      while (attempts < maxAttempts) {
        try {
          const res = await fetch(
            `/api/participation?session_id=${encodeURIComponent(sessionId)}`
          );
          const data = await res.json();

          if (res.ok && data.participation) {
            if (data.participation.statut === "confirme") {
              setParticipation(data.participation);
              setLoading(false);
              return;
            }
          }
        } catch {
          // continue polling
        }

        attempts++;
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // After all attempts, show best-effort message
      setError(
        "Votre paiement a été reçu. Vous recevrez un email de confirmation avec vos numéros de tickets dans quelques instants."
      );
      setLoading(false);
    };

    fetchParticipation();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary-600 animate-spin"
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
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirmation en cours...
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Nous traitons votre paiement et attribuons vos tickets.
            Cela prend quelques secondes.
          </p>
        </div>
      </div>
    );
  }

  if (error || !participation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Paiement confirmé !
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {error}
          </p>
          <Link href="/" className="btn-primary inline-block">
            Retour aux lots
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Participation confirmée !
        </h1>
        <p className="text-gray-500">
          Un email de confirmation vous a été envoyé à{" "}
          <strong>{participation.email}</strong>.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Lot info header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
          <p className="text-primary-200 text-sm mb-1">Lot</p>
          <h2 className="text-xl font-bold">{participation.lots.nom}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-primary-200 text-sm">Référence :</span>
            <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-sm">
              {participation.lots.reference_lot}
            </span>
          </div>
        </div>

        {/* Participation details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Participant</p>
              <p className="font-semibold text-gray-900">
                {participation.prenom} {participation.nom}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="font-semibold text-gray-900 text-sm break-all">
                {participation.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nombre de tickets</p>
              <p className="font-semibold text-gray-900">
                {participation.quantite} ticket
                {participation.quantite > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date de participation</p>
              <p className="font-semibold text-gray-900 text-sm">
                {new Date(participation.created_at).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          {/* Ticket numbers */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Vos numéros de tickets
            </p>
            <div className="flex flex-wrap gap-2">
              {participation.ticket_numbers.map((num) => (
                <span
                  key={num}
                  className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm leading-relaxed">
          <strong>Mention légale :</strong> Le tirage sera effectué par un
          organisme externe indépendant. Les résultats vous seront communiqués
          par email. Conservez cet email comme preuve de participation.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary flex-1 text-center">
          Voir d&apos;autres lots
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Imprimer
        </button>
      </div>
    </div>
  );
}
