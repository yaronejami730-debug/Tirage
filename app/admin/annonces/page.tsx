"use client";

import { useEffect, useState } from "react";
import { Annonce } from "@/lib/supabase";

const COULEURS = [
  { label: "Violet", value: "#6C5CE7" },
  { label: "Rose", value: "#FD79A8" },
  { label: "Or", value: "#FDCB6E" },
  { label: "Vert", value: "#00B894" },
  { label: "Rouge", value: "#E17055" },
  { label: "Bleu", value: "#0984E3" },
  { label: "Sombre", value: "#2D3436" },
];

export default function AnnoncesAdminPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ texte: "", emoji: "", couleur: "#6C5CE7", actif: true });
  const [error, setError] = useState("");

  const load = () =>
    fetch("/api/admin/annonces")
      .then((r) => r.json())
      .then(({ annonces: a }) => { setAnnonces(a ?? []); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setForm({ texte: "", emoji: "", couleur: "#6C5CE7", actif: true });
    load();
  };

  const toggleActif = async (a: Annonce) => {
    await fetch(`/api/admin/annonces/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !a.actif }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    await fetch(`/api/admin/annonces/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez la bannière d&apos;annonce affichée en haut du site</p>
      </div>

      {/* Création */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Nouvelle annonce</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex gap-3">
            <div style={{ flex: "0 0 80px" }}>
              <label className="label-fun">Emoji</label>
              <input
                className="input-fun text-center text-xl"
                placeholder="🎉"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                maxLength={4}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label-fun">Texte de l&apos;annonce *</label>
              <input
                className="input-fun"
                placeholder="Ex : Nouveau lot disponible ! Ne manquez pas notre tirage spécial…"
                value={form.texte}
                onChange={(e) => setForm((f) => ({ ...f, texte: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="label-fun">Couleur de fond</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              {COULEURS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, couleur: c.value }))}
                  style={{
                    width: 36, height: 36, borderRadius: 10, background: c.value, border: "none", cursor: "pointer",
                    outline: form.couleur === c.value ? `3px solid ${c.value}` : "3px solid transparent",
                    outlineOffset: 2,
                    boxShadow: form.couleur === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
                    transition: "all .15s",
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.actif}
                onChange={(e) => setForm((f) => ({ ...f, actif: e.target.checked }))}
                className="w-4 h-4 accent-purple-600"
              />
              <span className="label-fun" style={{ margin: 0 }}>Afficher immédiatement</span>
            </label>
          </div>

          {error && <p style={{ color: "#E17055", fontSize: 13 }}>{error}</p>}

          {/* Prévisualisation */}
          {form.texte && (
            <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid #f0eeff" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#A29BFE", padding: "6px 12px", background: "#f8f7ff" }}>Aperçu</p>
              <div style={{
                background: form.couleur, color: "white",
                padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                fontSize: 14, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
              }}>
                {form.emoji && <span style={{ fontSize: 18 }}>{form.emoji}</span>}
                <span>{form.texte}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-fun" disabled={saving}>
            {saving ? "Enregistrement…" : "➕ Créer l'annonce"}
          </button>
        </form>
      </div>

      {/* Liste */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Annonces ({annonces.length})</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : annonces.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">Aucune annonce créée.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {annonces.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                {/* Color dot */}
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: a.couleur, flexShrink: 0 }} />

                {/* Preview strip */}
                <div style={{
                  background: a.couleur, borderRadius: 8, padding: "5px 12px",
                  display: "flex", alignItems: "center", gap: 8,
                  flex: 1, overflow: "hidden",
                }}>
                  {a.emoji && <span style={{ fontSize: 16 }}>{a.emoji}</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {a.texte}
                  </span>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleActif(a)}
                  style={{
                    padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                    fontWeight: 800, fontSize: 12, fontFamily: "'Nunito', sans-serif",
                    background: a.actif ? "#00B89422" : "#f0eeff",
                    color: a.actif ? "#00B894" : "#A29BFE",
                  }}
                >
                  {a.actif ? "✅ Actif" : "⏸ Inactif"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{
                    padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    fontWeight: 800, fontSize: 12, background: "#fff3f0", color: "#E17055",
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
