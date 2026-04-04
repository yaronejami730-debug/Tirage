"use client";

import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";
import CountdownTimer from "./CountdownTimer";

interface LotCardProps {
  lot: Lot;
}

export default function LotCard({ lot }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;
  const pct = Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100);

  return (
    <div className="card flex flex-col group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-700 to-indigo-800">
        {lot.image_url ? (
          <Image
            src={lot.image_url}
            alt={lot.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
          {Number(lot.prix_ticket).toFixed(2)} € / ticket
        </div>

        {/* Sold out */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-extrabold text-xl bg-red-600 px-5 py-2 rounded-2xl rotate-[-5deg] shadow-xl">
              COMPLET
            </span>
          </div>
        )}

        {/* Countdown badge */}
        {lot.date_fin && !isSoldOut && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <CountdownTimer dateFin={lot.date_fin} />
          </div>
        )}

        {/* Urgency badge */}
        {!isSoldOut && remaining <= 10 && remaining > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse-slow">
            🔥 Plus que {remaining} !
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1 group-hover:text-primary-700 transition-colors">
          {lot.nom}
        </h3>
        {lot.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{lot.description}</p>
        )}

        <div className="mt-auto space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{lot.tickets_vendus} vendus</span>
              <span className={remaining <= 10 ? "text-red-500 font-semibold" : ""}>{remaining} restants</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-orange-500" : "bg-gradient-to-r from-primary-500 to-primary-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          {isSoldOut ? (
            <button disabled className="w-full btn-primary opacity-40 cursor-not-allowed">
              Complet
            </button>
          ) : (
            <Link href={`/lots/${lot.id}`} className="w-full btn-primary text-center block">
              🎟️ Participer
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
