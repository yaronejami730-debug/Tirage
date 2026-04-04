"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lot } from "@/lib/supabase";

interface LotFormProps {
  lot?: Lot;
  mode: "create" | "edit";
}

export default function LotForm({ lot, mode }: LotFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: lot?.nom || "",
    description: lot?.description || "",
    image_url: lot?.image_url || "",
    prix_ticket: lot?.prix_ticket ? String(lot.prix_ticket) : "",
    total_tickets: lot?.total_tickets ? String(lot.total_tickets) : "",
    reference_lot: lot?.reference_lot || "",
    date_fin: lot?.date_fin
      ? new Date(lot.date_fin).toISOString().slice(0, 16)
      : "",
    statut: lot?.statut || "actif",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/lots"
          : `/api/admin/lots/${lot!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          prix_ticket: parseFloat(form.prix_ticket),
          total_tickets: parseInt(form.total_tickets),
          date_fin: form.date_fin ? new Date(form.date_fin).toISOString() : null,
          image_url: form.image_url || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      router.push("/admin/lots");
      router.refresh();
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="label">
            Nom du lot <span className="text-red-500">*</span>
          </label>
          <input
            name="nom"
            type="text"
            value={form.nom}
            onChange={handleChange}
            placeholder="iPhone 16 Pro 256 Go"
            className="input-field"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description du lot..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">URL de l&apos;image</label>
          <input
            name="image_url"
            type="url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://exemple.com/image.jpg"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">
            Prix par ticket (€) <span className="text-red-500">*</span>
          </label>
          <input
            name="prix_ticket"
            type="number"
            step="0.01"
            min="0.01"
            value={form.prix_ticket}
            onChange={handleChange}
            placeholder="5.00"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">
            Nombre total de tickets <span className="text-red-500">*</span>
          </label>
          <input
            name="total_tickets"
            type="number"
            min="1"
            value={form.total_tickets}
            onChange={handleChange}
            placeholder="100"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">
            Référence du lot <span className="text-red-500">*</span>
          </label>
          <input
            name="reference_lot"
            type="text"
            value={form.reference_lot}
            onChange={handleChange}
            placeholder="LOT-2024-001"
            className="input-field"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Identifiant unique visible par les participants.
          </p>
        </div>

        <div>
          <label className="label">Date de fin</label>
          <input
            name="date_fin"
            type="datetime-local"
            value={form.date_fin}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {mode === "edit" && (
          <div>
            <label className="label">Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="input-field"
            >
              <option value="actif">Actif</option>
              <option value="termine">Terminé</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading
            ? "Enregistrement..."
            : mode === "create"
            ? "Créer le lot"
            : "Enregistrer les modifications"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
