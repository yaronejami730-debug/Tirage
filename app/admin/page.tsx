"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalLots: number;
  activeLots: number;
  totalParticipations: number;
  totalTickets: number;
  totalRevenue: number;
  recent: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/lots").then((r) => r.json()),
      fetch("/api/admin/participations").then((r) => r.json()),
    ]).then(([lotsData, participationsData]) => {
      const lots = lotsData.lots || [];
      const participations = (participationsData.participations || []).filter(
        (p: any) => p.statut === "confirme"
      );

      setStats({
        totalLots: lots.length,
        activeLots: lots.filter((l: any) => l.statut === "actif").length,
        totalParticipations: participations.length,
        totalTickets: participations.reduce((acc: number, p: any) => acc + p.quantite, 0),
        totalRevenue: participations.reduce(
          (acc: number, p: any) => acc + Number(p.lots?.prix_ticket || 0) * p.quantite,
          0
        ),
        recent: [...participations]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Lots actifs", value: `${stats.activeLots} / ${stats.totalLots}`, href: "/admin/lots", color: "bg-purple-50 text-purple-600" },
    { label: "Participations", value: stats.totalParticipations, href: "/admin/participations", color: "bg-blue-50 text-blue-600" },
    { label: "Tickets vendus", value: stats.totalTickets, href: "/admin/participations", color: "bg-green-50 text-green-600" },
    { label: "Revenus totaux", value: `${stats.totalRevenue.toFixed(2)} €`, href: "/admin/participations", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble de votre plateforme de tirage</p>
        </div>
        <Link href="/admin/lots/new" className="btn-primary text-sm">+ Nouveau lot</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <span className="text-xl font-bold">{typeof card.value === "string" ? card.value[0] : card.value}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Dernières participations</h2>
          <Link href="/admin/participations" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Voir tout
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">Aucune participation pour le moment.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recent.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                    {p.prenom[0]}{p.nom[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.prenom} {p.nom}</p>
                    <p className="text-xs text-gray-500">{p.lots?.nom} • {p.quantite} ticket{p.quantite > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {(Number(p.lots?.prix_ticket || 0) * p.quantite).toFixed(2)} €
                  </p>
                  <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
