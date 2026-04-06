"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function ParticipationsContent() {
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const initialView = (searchParams?.get("view") as "list" | "clients") || "list";
  const [view, setView] = useState<"list" | "clients">(initialView);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  // Synchronise le state 'view' si le param change (via sidebar)
  useEffect(() => {
    const v = searchParams?.get("view");
    if (v === "clients") setView("clients");
    else setView("list");
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/admin/participations")
      .then((r) => r.json())
      .then((data) => {
        setParticipations(data.participations || []);
        setLoading(false);
      });
  }, []);

  const confirmed = participations.filter((p) => p.statut === "confirme");
  
  const totalRevenue = useMemo(() => 
    confirmed.reduce((acc, p) => acc + Number(p.lots?.prix_ticket || 0) * p.quantite, 0),
    [confirmed]
  );

  const clients = useMemo(() => {
    const groups: Record<string, any> = {};
    participations.forEach((p) => {
      const email = p.email.toLowerCase().trim();
      if (!groups[email]) {
        groups[email] = {
          email,
          nom: p.nom,
          prenom: p.prenom,
          phone: p.telephone,
          totalSpent: 0,
          totalTickets: 0,
          history: [],
        };
      }
      groups[email].history.push(p);
      if (p.statut === "confirme") {
        groups[email].totalSpent += Number(p.lots?.prix_ticket || 0) * p.quantite;
        groups[email].totalTickets += p.quantite;
      }
    });
    return Object.values(groups).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [participations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participations</h1>
          <p className="text-gray-500 text-sm mt-1">
            {participations.length} participation{participations.length > 1 ? "s" : ""} •{" "}
            {clients.length} client{clients.length > 1 ? "s" : ""} unique{clients.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vue Liste
            </button>
            <button
              onClick={() => setView("clients")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === "clients" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vue Clients (CRM)
            </button>
          </div>
          <ExportButton participations={participations} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Confirmées</p>
          <p className="text-xl font-bold text-green-600">{confirmed.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Clients</p>
          <p className="text-xl font-bold text-primary-600">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Revenus</p>
          <p className="text-xl font-bold text-gray-900">{totalRevenue.toFixed(2)} €</p>
        </div>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          {participations.length === 0 ? (
            <div className="py-16 text-center text-gray-500 text-sm">Aucune participation.</div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</th>
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.lots?.nom}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.quantite}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {(Number(p.lots?.prix_ticket || 0) * p.quantite).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutBadge[p.statut] || "bg-gray-100 text-gray-600"}`}>
                        {statutLabel[p.statut] || p.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Achats Confiramés</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tickets</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Dépensé</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client) => (
                <tr key={client.email} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{client.prenom} {client.nom}</p>
                    <p className="text-xs text-gray-500">{client.email}</p>
                    {client.phone && <p className="text-xs text-gray-400 font-medium">{client.phone}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{client.history.filter((h:any) => h.statut === 'confirme').length}</span> participation(s)
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{client.totalTickets}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-600">{client.totalSpent.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="text-primary-600 hover:text-primary-700 text-xs font-bold bg-primary-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Détails client
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Historique Client */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedClient.prenom} {selectedClient.nom}</h2>
                <p className="text-sm text-gray-500">{selectedClient.email}</p>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
                  <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Tickets Confirmés</p>
                  <p className="text-2xl font-black text-primary-700 mt-1">{selectedClient.totalTickets}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Dépenses Totales</p>
                  <p className="text-2xl font-black text-green-700 mt-1">{selectedClient.totalSpent.toFixed(2)} €</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 border-l-4 border-primary-500 pl-3">Historique des achats</h3>
                {selectedClient.history.map((h: any) => (
                  <div key={h.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-primary-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{h.lots?.nom}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{h.lots?.reference_lot}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statutBadge[h.statut]}`}>
                        {statutLabel[h.statut]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                      <div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {h.ticket_numbers && h.ticket_numbers.length > 0 ? (
                            h.ticket_numbers.map((n: number) => (
                              <span key={n} className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full text-[12px] font-black shadow-md border-2 border-white ring-1 ring-gray-200">
                                {n}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">Aucun numéro (statut: {statutLabel[h.statut]})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{h.quantite} ticket(s)</p>
                        <p className="text-sm font-black text-gray-900">{(h.quantite * (h.lots?.prix_ticket || 0)).toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase">Profil client identifié par {selectedClient.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminParticipationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Chargement...</div>}>
      <ParticipationsContent />
    </Suspense>
  );
}
