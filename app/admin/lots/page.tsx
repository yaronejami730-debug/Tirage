"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteLotButton from "./DeleteLotButton";
import BailiffButton from "./BailiffButton";
import LotParticipantsModal from "./LotParticipantsModal";
import { Lot, supabaseClient } from "@/lib/supabase";

const statutBadge: Record<string, string> = {
  actif: "bg-green-100 text-green-700",
  termine: "bg-gray-100 text-gray-600",
  archive: "bg-yellow-100 text-yellow-700",
  programme: "bg-blue-100 text-blue-700",
};

function getStatutDisplay(lot: Lot) {
  const isProgramme = !!(lot.date_ouverture && new Date(lot.date_ouverture) > new Date());
  if (isProgramme) return { key: "programme", label: "Programmé" };
  if (lot.statut === "actif") return { key: "actif", label: "Actif" };
  if (lot.statut === "termine") return { key: "termine", label: "Terminé" };
  return { key: "archive", label: "Archivé" };
}

export default function AdminLotsPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  useEffect(() => {
    fetch("/api/admin/lots")
      .then((r) => r.json())
      .then((data) => {
        setLots(data.lots || []);
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Lots</h1>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/lots/new" className="btn-primary text-sm whitespace-nowrap">+ Nouveau lot</Link>
          </div>
        </div>

        {lots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <p className="text-gray-500 mb-4">Aucun lot créé.</p>
            <Link href="/admin/lots/new" className="btn-primary text-sm">Créer votre premier lot</Link>
          </div>
        ) : (
          <>
            {/* Table desktop */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix / ticket</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lots.map((lot) => (
                    <tr 
                      key={lot.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLot(lot)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-primary-600 hover:underline">{lot.nom}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{lot.reference_lot}</p>
                        {!lot.description && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            ⚠️ Description manquante
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{Number(lot.prix_ticket).toFixed(2)} €</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">{lot.tickets_vendus}</span>
                          <span className="text-gray-500"> / {lot.total_tickets}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100)}%` }} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(() => { const s = getStatutDisplay(lot); return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutBadge[s.key]}`}>{s.label}</span>; })()}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Link href={`/lots/${lot.id}`} target="_blank" className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">Voir</Link>
                          <Link href={`/admin/lots/${lot.id}/edit`} className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors">Modifier</Link>
                          {lot.statut === "actif" && lot.tickets_vendus > 0 && (
                            <BailiffButton lotId={lot.id} lotNom={lot.nom} />
                          )}
                          <DeleteLotButton lotId={lot.id} lotNom={lot.nom} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-3">
              {lots.map((lot) => (
                <div 
                  key={lot.id} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer active:bg-gray-50 transition-colors"
                  onClick={() => setSelectedLot(lot)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-600 text-sm leading-tight">{lot.nom}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{lot.reference_lot}</p>
                      {!lot.description && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          ⚠️ Description manquante
                        </span>
                      )}
                    </div>
                    {(() => { const s = getStatutDisplay(lot); return <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutBadge[s.key]}`}>{s.label}</span>; })()}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Prix / ticket</p>
                      <p className="text-sm font-bold text-gray-900">{Number(lot.prix_ticket).toFixed(2)} €</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Tickets : <span className="font-semibold text-gray-700">{lot.tickets_vendus} / {lot.total_tickets}</span></p>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((lot.tickets_vendus / lot.total_tickets) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/lots/${lot.id}`} target="_blank" className="text-xs text-gray-500 font-medium px-3 py-1.5 rounded-lg bg-gray-50 transition-colors">Voir</Link>
                    <Link href={`/admin/lots/${lot.id}/edit`} className="text-xs text-primary-600 font-medium px-3 py-1.5 rounded-lg bg-primary-50 transition-colors">Modifier</Link>
                    {lot.statut === "actif" && lot.tickets_vendus > 0 && (
                      <BailiffButton lotId={lot.id} lotNom={lot.nom} />
                    )}
                    <DeleteLotButton lotId={lot.id} lotNom={lot.nom} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedLot && (
          <LotParticipantsModal lot={selectedLot} onClose={() => setSelectedLot(null)} />
        )}
      </div>
    </>
  );
}
