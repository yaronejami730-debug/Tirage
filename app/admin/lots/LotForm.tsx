"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lot } from "@/lib/supabase";

interface LotFormProps {
  lot?: Lot;
  mode: "create" | "edit";
}

export default function LotForm({ lot, mode }: LotFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(lot?.image_url || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nom: lot?.nom || "",
    description: lot?.description || "",
    image_url: lot?.image_url || "",
    prix_ticket: lot?.prix_ticket ? String(lot.prix_ticket) : "",
    total_tickets: lot?.total_tickets ? String(lot.total_tickets) : "",
    reference_lot: lot?.reference_lot || "",
    date_fin: lot?.date_fin ? new Date(lot.date_fin).toISOString().slice(0, 16) : "",
    statut: lot?.statut || "actif",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'upload.");
        return;
      }

      setForm((prev) => ({ ...prev, image_url: data.url }));
      setPreview(data.url);
    } catch {
      setError("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = mode === "create" ? "/api/admin/lots" : `/api/admin/lots/${lot!.id}`;
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
      if (!res.ok) { setError(data.error || "Une erreur est survenue."); return; }

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

        {/* Nom */}
        <div className="sm:col-span-2">
          <label className="label">Nom du lot <span className="text-red-500">*</span></label>
          <input name="nom" type="text" value={form.nom} onChange={handleChange}
            placeholder="iPhone 16 Pro 256 Go" className="input-field" required />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Description du lot..." rows={3} className="input-field resize-none" />
        </div>

        {/* Image upload */}
        <div className="sm:col-span-2">
          <label className="label">Photo du lot</label>
          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary-400 cursor-pointer flex items-center justify-center shrink-0 transition-colors"
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center p-2">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400">Cliquez</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="btn-secondary text-sm py-2 px-4 mb-2">
                {uploading ? "Upload en cours..." : preview ? "Changer la photo" : "Choisir une photo"}
              </button>
              <p className="text-xs text-gray-400">JPG, PNG ou WEBP · Max 5 Mo</p>
              {preview && (
                <button type="button" onClick={() => { setPreview(""); setForm(f => ({ ...f, image_url: "" })); }}
                  className="text-xs text-red-500 hover:text-red-700 mt-1 block">
                  Supprimer la photo
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Prix */}
        <div>
          <label className="label">Prix par ticket (€) <span className="text-red-500">*</span></label>
          <input name="prix_ticket" type="number" step="0.01" min="0.01"
            value={form.prix_ticket} onChange={handleChange} placeholder="5.00" className="input-field" required />
        </div>

        {/* Total tickets */}
        <div>
          <label className="label">Nombre total de tickets <span className="text-red-500">*</span></label>
          <input name="total_tickets" type="number" min="1"
            value={form.total_tickets} onChange={handleChange} placeholder="100" className="input-field" required />
        </div>

        {/* Référence */}
        <div>
          <label className="label">Référence du lot <span className="text-red-500">*</span></label>
          <input name="reference_lot" type="text"
            value={form.reference_lot} onChange={handleChange} placeholder="LOT-2024-001" className="input-field" required />
          <p className="text-xs text-gray-500 mt-1">Identifiant unique visible par les participants.</p>
        </div>

        {/* Date fin */}
        <div>
          <label className="label">Date de fin du tirage</label>
          <input name="date_fin" type="datetime-local" value={form.date_fin} onChange={handleChange} className="input-field" />
        </div>

        {/* Statut (edit only) */}
        {mode === "edit" && (
          <div>
            <label className="label">Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange} className="input-field">
              <option value="actif">Actif</option>
              <option value="termine">Terminé</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || uploading} className="btn-primary">
          {loading ? "Enregistrement..." : mode === "create" ? "Créer le lot" : "Enregistrer"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Annuler</button>
      </div>
    </form>
  );
}
