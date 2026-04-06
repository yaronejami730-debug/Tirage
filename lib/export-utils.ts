import { Lot, Participation } from "./supabase";

export function generateCSV(lot: Lot, participations: Participation[]) {
  const headers = ["Prénom", "Nom", "Email", "Téléphone", "Quantité", "N° tickets", "Statut", "Date"];
  const rows = participations.map((p) => [
    p.prenom,
    p.nom,
    p.email,
    p.telephone ?? "",
    p.quantite,
    (p.ticket_numbers ?? []).join(" | "),
    p.statut,
    new Date(p.created_at).toLocaleString("fr-FR"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
