import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = supabaseAdmin();

  const [{ data: lots }, { data: participations }] = await Promise.all([
    supabase.from("lots").select("*"),
    supabase
      .from("participations")
      .select("*, lots(nom, prix_ticket)")
      .eq("statut", "confirme"),
  ]);

  const totalLots = lots?.length || 0;
  const activeLots = lots?.filter((l) => l.statut === "actif").length || 0;
  const totalParticipations = participations?.length || 0;
  const totalTickets = participations?.reduce((acc, p) => acc + p.quantite, 0) || 0;
  const totalRevenue =
    participations?.reduce((acc, p) => {
      const prix = p.lots?.prix_ticket || 0;
      return acc + Number(prix) * p.quantite;
    }, 0) || 0;

  // Recent participations
  const recent = participations
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return {
    totalLots,
    activeLots,
    totalParticipations,
    totalTickets,
    totalRevenue,
    recent: recent || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Lots actifs",
      value: `${stats.activeLots} / ${stats.totalLots}`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
      href: "/admin/lots",
    },
    {
      label: "Participations",
      value: stats.totalParticipations,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      href: "/admin/participations",
    },
    {
      label: "Tickets vendus",
      value: stats.totalTickets,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      href: "/admin/participations",
    },
    {
      label: "Revenus totaux",
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
      href: "/admin/participations",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">
            Vue d&apos;ensemble de votre plateforme de tirage
          </p>
        </div>
        <Link href="/admin/lots/new" className="btn-primary text-sm">
          + Nouveau lot
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent participations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Dernières participations
          </h2>
          <Link
            href="/admin/participations"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir tout
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">
            Aucune participation pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recent.map((p) => (
              <div
                key={p.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                    {p.prenom[0]}
                    {p.nom[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {p.prenom} {p.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.lots?.nom} •{" "}
                      {p.quantite} ticket{p.quantite > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {(Number(p.lots?.prix_ticket || 0) * p.quantite).toFixed(2)} €
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
