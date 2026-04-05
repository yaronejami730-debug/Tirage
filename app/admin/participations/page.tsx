"use client";

import { useEffect, useState } from "react";
import ExportButton from "./ExportButton";

const statutBadge: Record<string, string> = {
  confirme: "bg-green-100 text-green-700",
  en_attente: "bg-yellow-100 text-yellow-700",
  annule: "bg-red-100 text-red-600",
};

const statutLabel: Record<string, string> = {
  confirme: "Confirmé",
  en_attente: "En attente",
  annule: "Annulé",
};

export default function AdminParticipationsPage() {
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/participations")
      .then((r) => r.json())
      .then((data) => {
        setParticipations(data.participations || []);
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

  const confirmed = participations.filter((p) => p.statut === "confirme");
  const totalRevenue = confirmed.reduce(
    (acc, p) => acc + Number(p.lots?.prix_ticket || 0) * p.quantite,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participations</h1>
          <p className="text-gray-500 text-sm mt-1">
            {participations.length} participation{participations.length > 1 ? "s" : ""} •{" "}
            {confirmed.length} confirmée{confirmed.length > 1 ? "s" : ""}
          </p>
        </div>
        <ExportButton participations={participations} />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Confirmées</p>
          <p className="text-xl font-bold text-green-600">{confirmed.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">En attente</p>
          <p className="text-xl font-bold text-yellow-600">
            {participations.filter((p) => p.statut === "en_attente").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Revenus confirmés</p>
          <p className="text-xl font-bold text-gray-900">{totalRevenue.toFixed(2)} €</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {participations.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Aucune participation pour le moment.</div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéros</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {participations.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{p.prenom} {p.nom}</p>
                    <p className="text-xs text-gray-500">{p.email}</p>
                    {p.telephone && <p className="text-xs text-gray-400">{p.telephone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{p.lots?.nom}</p>
                    <p className="text-xs font-mono text-gray-500">{p.lots?.reference_lot}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.quantite}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.ticket_numbers && p.ticket_numbers.length > 0 ? (
                        p.ticket_numbers.map((n: number) => (
                          <span key={n} className="inline-flex items-center justify-center w-7 h-7 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold">
                            {n}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {(Number(p.lots?.prix_ticket || 0) * p.quantite).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutBadge[p.statut] || "bg-gray-100 text-gray-600"}`}>
                      {statutLabel[p.statut] || p.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    <br />
                    {new Date(p.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
