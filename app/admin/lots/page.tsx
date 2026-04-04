import { supabaseAdmin, Lot } from "@/lib/supabase";
import Link from "next/link";
import DeleteLotButton from "./DeleteLotButton";

async function getLots(): Promise<Lot[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

const statutBadge = {
  actif: "bg-green-100 text-green-700",
  termine: "bg-gray-100 text-gray-600",
  archive: "bg-yellow-100 text-yellow-700",
};

export default async function AdminLotsPage() {
  const lots = await getLots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lots</h1>
          <p className="text-gray-500 text-sm mt-1">
            {lots.length} lot{lots.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/admin/lots/new" className="btn-primary text-sm">
          + Nouveau lot
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {lots.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 mb-4">Aucun lot créé.</p>
            <Link href="/admin/lots/new" className="btn-primary text-sm">
              Créer votre premier lot
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lot
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Prix / ticket
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{lot.nom}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {lot.reference_lot}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {Number(lot.prix_ticket).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {lot.tickets_vendus}
                      </span>
                      <span className="text-gray-500">
                        {" "}/ {lot.total_tickets}
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (lot.tickets_vendus / lot.total_tickets) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statutBadge[lot.statut]
                      }`}
                    >
                      {lot.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/lots/${lot.id}`}
                        target="_blank"
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/admin/lots/${lot.id}/edit`}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        Modifier
                      </Link>
                      <DeleteLotButton lotId={lot.id} lotNom={lot.nom} />
                    </div>
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
