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

  const totalTickets = lots.reduce((a, l) => a + l.total_tickets, 0);
  const ticketsRestants = lots.reduce((a, l) => a + (l.total_tickets - l.tickets_vendus), 0);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 py-20 px-4">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            🎉 Tirages équitables · Résultats certifiés huissier
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
            Tentez votre chance &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
              gagnez des lots incroyables
            </span>
          </h1>

          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Achetez vos tickets, suivez le tirage en direct et remportez des prix exceptionnels. Simple, transparent, certifié.
          </p>

          {/* Stats */}
          {!loading && lots.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
                <div className="text-3xl font-black text-white">{lots.length}</div>
                <div className="text-xs text-white/60 mt-0.5">Lots actifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
                <div className="text-3xl font-black text-gold-400">{totalTickets}</div>
                <div className="text-xs text-white/60 mt-0.5">Tickets au total</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
                <div className="text-3xl font-black text-green-400">{ticketsRestants}</div>
                <div className="text-xs text-white/60 mt-0.5">Places restantes</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lots.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎟️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucun lot en cours</h2>
            <p className="text-gray-500">Revenez bientôt pour découvrir nos prochains tirages !</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
              Lots en cours
              <span className="ml-3 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                {lots.length} actif{lots.length > 1 ? "s" : ""}
              </span>
            </h2>
            <LotGrid lots={lots} />
          </>
        )}
      </div>

      {/* How it works */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-10">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "🎟️", title: "Achetez vos tickets", desc: "Choisissez un lot et achetez le nombre de tickets souhaité en toute sécurité." },
              { icon: "⏳", title: "Attendez le tirage", desc: "Le tirage est réalisé par un huissier indépendant à la clôture du lot." },
              { icon: "🏆", title: "Réclamez votre lot", desc: "Le gagnant est contacté par email et reçoit son lot rapidement." },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
