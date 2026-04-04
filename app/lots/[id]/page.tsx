"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient, Lot } from "@/lib/supabase";
import ProgressBar from "@/components/ProgressBar";
import ParticipationForm from "@/components/ParticipationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function LotDetailPage({ params }: Props) {
  const { id } = use(params);
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    supabaseClient()
      .from("lots")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFoundState(true);
        } else {
          setLot(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFoundState || !lot) return notFound();

  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const isArchived = lot.statut !== "actif";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          Lots
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">{lot.nom}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
            {lot.image_url ? (
              <Image src={lot.image_url} alt={lot.nom} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-28 h-28 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">{lot.nom}</h1>
              <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Réf. {lot.reference_lot}
              </span>
            </div>

            {lot.description && (
              <p className="text-gray-600 leading-relaxed">{lot.description}</p>
            )}

            {lot.date_fin && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tirage le{" "}
                {new Date(lot.date_fin).toLocaleDateString("fr-FR", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </div>
            )}

            <div className="pt-2">
              <ProgressBar total={lot.total_tickets} sold={lot.tickets_vendus} />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-gray-900">{lot.total_tickets}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total tickets</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-primary-600">{remaining > 0 ? remaining : 0}</div>
                <div className="text-xs text-gray-500 mt-0.5">Disponibles</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl font-bold text-gray-900">{Number(lot.prix_ticket).toFixed(2)} €</div>
                <div className="text-xs text-gray-500 mt-0.5">Par ticket</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {isArchived ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ce tirage est terminé</h3>
              <p className="text-gray-500 text-sm mb-6">La période de participation est clôturée.</p>
              <Link href="/" className="btn-primary inline-block">Voir les autres lots</Link>
            </div>
          ) : isSoldOut ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complet</h3>
              <p className="text-gray-500 text-sm mb-6">Tous les tickets ont été vendus.</p>
              <Link href="/" className="btn-primary inline-block">Voir les autres lots</Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Choisissez vos tickets</h2>
              <ParticipationForm
                lotId={lot.id}
                lotNom={lot.nom}
                prixTicket={Number(lot.prix_ticket)}
                maxTickets={Math.min(remaining, 10)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
