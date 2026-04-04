import Image from "next/image";
import Link from "next/link";
import { Lot } from "@/lib/supabase";
import ProgressBar from "./ProgressBar";

interface LotCardProps {
  lot: Lot;
}

export default function LotCard({ lot }: LotCardProps) {
  const remaining = lot.total_tickets - lot.tickets_vendus;
  const isSoldOut = remaining <= 0;

  return (
    <div className="card flex flex-col group">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        {lot.image_url ? (
          <Image
            src={lot.image_url}
            alt={lot.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-primary-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-full">
              Complet
            </span>
          </div>
        )}
        {lot.date_fin && !isSoldOut && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            Fin le{" "}
            {new Date(lot.date_fin).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
          {lot.nom}
        </h3>
        {lot.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {lot.description}
          </p>
        )}

        <div className="mt-auto space-y-4">
          <ProgressBar total={lot.total_tickets} sold={lot.tickets_vendus} />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {Number(lot.prix_ticket).toFixed(2)} €
              </span>
              <span className="text-sm text-gray-500 ml-1">/ ticket</span>
            </div>

            {isSoldOut ? (
              <button
                disabled
                className="btn-primary opacity-50 cursor-not-allowed text-sm py-2 px-4"
              >
                Complet
              </button>
            ) : (
              <Link
                href={`/lots/${lot.id}`}
                className="btn-primary text-sm py-2 px-4 inline-block text-center"
              >
                Participer
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
