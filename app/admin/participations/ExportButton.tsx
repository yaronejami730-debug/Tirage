"use client";

interface Participation {
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  quantite: number;
  ticket_numbers: number[];
  created_at: string;
  stripe_payment_id: string | null;
  statut: string;
  lots?: {
    nom: string;
    reference_lot: string;
    prix_ticket: number;
  } | null;
}

interface Props {
  participations: Participation[];
}

export default function ExportButton({ participations }: Props) {
  const handleExport = () => {
    const headers = [
      "nom",
      "prenom",
      "email",
      "telephone",
      "lot",
      "reference_lot",
      "quantite",
      "ticket_numbers",
      "montant",
      "statut",
      "date",
      "stripe_payment_id",
    ];

    const rows = participations.map((p) => [
      p.nom,
      p.prenom,
      p.email,
      p.telephone || "",
      p.lots?.nom || "",
      p.lots?.reference_lot || "",
      p.quantite,
      p.ticket_numbers ? p.ticket_numbers.join(";") : "",
      ((p.lots?.prix_ticket || 0) * p.quantite).toFixed(2),
      p.statut,
      new Date(p.created_at).toLocaleString("fr-FR"),
      p.stripe_payment_id || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="btn-secondary text-sm flex items-center gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Exporter CSV
    </button>
  );
}
