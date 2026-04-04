"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import LotGrid from "@/components/LotGrid";
import { Lot } from "@/lib/supabase";

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient()
      .from("lots")
      .select("*")
      .eq("statut", "actif")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLots(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Participez à nos{" "}
          <span className="text-primary-600">tirages au sort</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Achetez vos tickets, tentez votre chance et remportez des lots
          exceptionnels.
        </p>
      </div>

      {lots.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{lots.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Lots actifs</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-primary-600">
              {lots.reduce((acc, lot) => acc + lot.total_tickets, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Total tickets</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-primary-600">
              {lots.reduce((acc, lot) => acc + (lot.total_tickets - lot.tickets_vendus), 0)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Disponibles</div>
          </div>
        </div>
      )}

      <LotGrid lots={lots} />
    </div>
  );
}
