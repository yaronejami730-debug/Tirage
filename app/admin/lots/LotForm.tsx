"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lot } from "@/lib/supabase";

const CATEGORIES = [
  { val: "tech", label: "Tech 📱" },
  { val: "mode", label: "Mode 👜" },
  { val: "gaming", label: "Gaming 🎮" },
  { val: "maison", label: "Maison 🏠" },
  { val: "luxe", label: "Luxe 💎" },
  { val: "autre", label: "Autre 🎁" },
];

interface LotFormProps { lot?: Lot; mode: "create" | "edit"; }

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
    categorie: lot?.categorie || "autre",
    valeur_estimee: lot?.valeur_estimee ? String(lot.valeur_estimee) : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur upload."); return; }
      setForm(prev => ({ ...prev, image_url: data.url }));
      setPreview(data.url);
    } catch { setError("Erreur upload."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const url = mode === "create" ? "/api/admin/lots" : `/api/admin/lots/${lot!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          prix_ticket: parseFloat(form.prix_ticket),
          total_tickets: parseInt(form.total_tickets),
          date_fin: form.date_fin ? new Date(form.date_fin).toISOString() : null,
          image_url: form.image_url || null,
          valeur_estimee: form.valeur_estimee ? parseFloat(form.valeur_estimee) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur."); return; }
      router.push("/admin/lots"); router.refresh();
    } catch { setError("Erreur de connexion."); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e0d9ff", fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none" };
  const labelStyle = { display: "block", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#2D3436", marginBottom: 6 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Nom */}
      <div>
        <label style={labelStyle}>Nom du lot *</label>
        <input name="nom" type="text" value={form.nom} onChange={handleChange} placeholder="iPhone 16 Pro Max 256Go" style={inputStyle} required />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description détaillée..." rows={3} style={{ ...inputStyle, resize: "none" }} />
      </div>

      {/* Catégorie + valeur */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Catégorie *</label>
          <select name="categorie" value={form.categorie} onChange={handleChange} style={inputStyle}>
            {CATEGORIES.map(c => <option key={c.val} value={c.val}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Valeur estimée (€)</label>
          <input name="valeur_estimee" type="number" step="0.01" min="0" value={form.valeur_estimee} onChange={handleChange} placeholder="999.00" style={inputStyle} />
        </div>
      </div>

      {/* Photo */}
      <div>
        <label style={labelStyle}>Photo du lot</label>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 120, height: 120, borderRadius: 16, overflow: "hidden",
              border: "2px dashed #A29BFE", cursor: "pointer", position: "relative",
              background: "#f8f5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", padding: 8 }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
                <span style={{ fontSize: 11, color: "#A29BFE", fontWeight: 700 }}>Cliquez</span>
              </div>
            )}
            {uploading && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(108,92,231,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 24, height: 24, border: "3px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
              </div>
            )}
          </div>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              background: "#f0eeff", color: "#6C5CE7", border: "none", cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
              padding: "9px 16px", borderRadius: 10, display: "block", marginBottom: 6
            }}>
              {uploading ? "Upload..." : preview ? "Changer la photo" : "Choisir une photo"}
            </button>
            <p style={{ fontSize: 12, color: "#b2bec3", fontFamily: "'Nunito', sans-serif" }}>JPG, PNG, WEBP · Max 5 Mo</p>
            {preview && <button type="button" onClick={() => { setPreview(""); setForm(f => ({ ...f, image_url: "" })); }} style={{ fontSize: 12, color: "#E17055", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>Supprimer</button>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
      </div>

      {/* Prix + tickets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Prix / ticket (€) *</label>
          <input name="prix_ticket" type="number" step="0.01" min="0.01" value={form.prix_ticket} onChange={handleChange} placeholder="5.00" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Nb total tickets *</label>
          <input name="total_tickets" type="number" min="1" value={form.total_tickets} onChange={handleChange} placeholder="100" style={inputStyle} required />
        </div>
      </div>

      {/* Ref + date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Référence *</label>
          <input name="reference_lot" type="text" value={form.reference_lot} onChange={handleChange} placeholder="LOT-2026-001" style={inputStyle} required />
          <p style={{ fontSize: 11, color: "#b2bec3", marginTop: 4, fontFamily: "'Nunito', sans-serif" }}>Visible par les participants</p>
        </div>
        <div>
          <label style={labelStyle}>Date du tirage</label>
          <input name="date_fin" type="datetime-local" value={form.date_fin} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* Statut (edit) */}
      {mode === "edit" && (
        <div>
          <label style={labelStyle}>Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange} style={inputStyle}>
            <option value="actif">🟢 Actif</option>
            <option value="termine">🔴 Terminé</option>
            <option value="archive">📦 Archivé</option>
          </select>
        </div>
      )}

      {error && (
        <div style={{ background: "#fff3f0", border: "2px solid #E17055", borderRadius: 14, padding: "12px 16px", color: "#E17055", fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button type="submit" disabled={loading || uploading} className="btn-fun">
          {loading ? "⏳ Enregistrement..." : mode === "create" ? "🎁 Créer le lot" : "💾 Enregistrer"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Annuler</button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </form>
  );
}
