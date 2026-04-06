import { Lot } from "@/lib/supabase";
import LotCard from "./LotCard";

interface LotGridProps {
  lots: Lot[];
  prochainTirageId?: string;
}

export default function LotGrid({ lots, prochainTirageId }: LotGridProps) {
  if (lots.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucun tirage disponible
        </h3>
        <p className="text-gray-500">
          Revenez bientôt pour découvrir nos prochains lots.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {lots.map((lot, i) => (
        <div 
          key={lot.id} 
          className="fade-up" 
          style={{ animationDelay: `${0.6 + i * 0.1}s` }}
        >
          <LotCard lot={lot} isProchain={lot.id === prochainTirageId} />
        </div>
      ))}
    </div>
  );
}
