"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { Lot } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import { searchProducts, type ProductSuggestion } from "@/lib/product-suggestions";

registerLocale("fr", fr);

interface LotFormProps { lot?: Lot; mode: "create" | "edit"; }

// ── Stripe EU : 1.5% + 0.25€/transaction ──
function calcStripe(revenue: number, nbTransactions: number) {
  return revenue * 0.015 + 0.25 * nbTransactions;
}

function SimulationPanel({
  prixTicket, totalTickets, valeurLot,
}: { prixTicket: number; totalTickets: number; valeurLot: number }) {
  if (!prixTicket || !totalTickets) return null;

  const revenue = prixTicket * totalTickets;
  // Hypothèse : en moyenne 2 tickets par participant
  const estimatedTransactions = Math.ceil(totalTickets / 2);
  const stripeFees = calcStripe(revenue, estimatedTransactions);
  const coutLot = valeurLot || 0;
  const margeNette = revenue - coutLot - stripeFees;
  const tauxMarge = revenue > 0 ? (margeNette / revenue) * 100 : 0;
  const seuilTickets = coutLot > 0 && prixTicket > 0
    ? Math.ceil(coutLot / prixTicket)
    : null;
  const seuilPct = seuilTickets ? Math.round((seuilTickets / totalTickets) * 100) : null;

  const isRentable = margeNette >= 0;
  const accent = isRentable ? "#00B894" : "#E17055";
  const bgAccent = isRentable ? "#f0fff8" : "#fff3f0";

  const row = (label: string, val: string, sub?: string, bold?: boolean, color?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f0eeff" }}>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#636E72", fontWeight: bold ? 800 : 600 }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 15, color: color || "#2D3436" }}>{val}</span>
        {sub && <div style={{ fontSize: 10, color: "#b2bec3", fontFamily: "'Nunito', sans-serif" }}>{sub}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fafafe", border: "2px solid #e0d9ff", borderRadius: 18, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Titre */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>📊</span>
        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: "#6C5CE7" }}>Simulation financière</span>
        <span style={{ fontSize: 11, fontFamily: "'Nunito', sans-serif", color: "#b2bec3", fontWeight: 700, marginLeft: 4 }}>(indicatif)</span>
      </div>

      {row("🎟 Revenus bruts (100% vendus)", `${revenue.toFixed(2)} €`, `${totalTickets} tickets × ${prixTicket.toFixed(2)} €`)}
      {coutLot > 0 && row("🏷 Coût du lot", `− ${coutLot.toFixed(2)} €`, "valeur estimée renseignée", false, "#E17055")}
      {row(
        "💳 Frais Stripe estimés",
        `− ${stripeFees.toFixed(2)} €`,
        `1.5 % + 0.25 €/transaction · ~${estimatedTransactions} transactions estimées`,
        false, "#E17055"
      )}

      {/* Marge nette */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "10px 14px", background: bgAccent, borderRadius: 12, border: `2px solid ${accent}33` }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#2D3436" }}>
          {isRentable ? "✅" : "⚠️"} Marge nette estimée
        </span>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: accent }}>
            {margeNette >= 0 ? "+" : ""}{margeNette.toFixed(2)} €
          </span>
          <div style={{ fontSize: 11, color: accent, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
            {tauxMarge.toFixed(1)} % du chiffre d&apos;affaires
          </div>
        </div>
      </div>

      {/* Seuil de rentabilité */}
      {seuilTickets !== null && seuilPct !== null && (
        <div style={{ marginTop: 10, padding: "8px 14px", background: "#f8f7ff", borderRadius: 10, border: "1px solid #e0d9ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#6C5CE7", fontWeight: 700 }}>
              ⚖️ Seuil de rentabilité
            </span>
            <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: "#6C5CE7" }}>
              {seuilTickets} tickets vendus ({seuilPct}%)
            </span>
          </div>
          {/* Mini barre */}
          <div style={{ height: 6, background: "#e0d9ff", borderRadius: 999, overflow: "hidden", marginTop: 6 }}>
            <div style={{ height: "100%", width: `${Math.min(seuilPct, 100)}%`, background: "linear-gradient(90deg, #6C5CE7, #A29BFE)", borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 10, color: "#b2bec3", fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>
            Il faut vendre au moins {seuilTickets} ticket{seuilTickets > 1 ? "s" : ""} pour couvrir la valeur du lot
          </div>
        </div>
      )}

      <p style={{ fontSize: 10, color: "#b2bec3", fontFamily: "'Nunito', sans-serif", marginTop: 10, textAlign: "center" }}>
        Calcul basé sur 100 % des tickets vendus · Stripe EU 1.5% + 0.25€/transaction · ~2 tickets/participant
      </p>
    </div>
  );
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
}

export default function LotForm({ lot, mode }: LotFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [constraintNames, setConstraintNames] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [preview, setPreview] = useState<string>(lot?.image_url || "");
  const [medias, setMedias] = useState<string[]>(lot?.medias || []);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch real constraint names when a CONSTRAINT error is shown
  useEffect(() => {
    if (error !== "CONSTRAINT") return;
    fetch("/api/admin/migrate")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.constraints) && d.constraints.length > 0) {
          setConstraintNames(d.constraints);
        }
      })
      .catch(() => { /* ignore — fallback SQL will be shown */ });
  }, [error]);

  const generateRef = async () => {
    const res = await fetch("/api/admin/lots");
    const data = await res.json();
    const count = (data.lots?.length ?? 0) + 1;
    const year = new Date().getFullYear();
    const ref = `LOT-${year}-${String(count).padStart(3, "0")}`;
    setForm(f => ({ ...f, reference_lot: ref }));
  };

  const [form, setForm] = useState({
    nom: lot?.nom || "",
    description: lot?.description || "",
    image_url: lot?.image_url || "",
    prix_ticket: lot?.prix_ticket ? String(lot.prix_ticket) : "",
    total_tickets: lot?.total_tickets ? String(lot.total_tickets) : "",
    reference_lot: lot?.reference_lot || "",
    date_fin: lot?.date_fin ? new Date(lot.date_fin).toISOString().slice(0, 16) : "",
    date_ouverture: lot?.date_ouverture ? new Date(lot.date_ouverture).toISOString().slice(0, 16) : "",
    statut: lot?.statut || "actif",
    categorie: lot?.categorie || "autre",
    valeur_estimee: lot?.valeur_estimee ? String(lot.valeur_estimee) : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, nom: val }));
    const results = searchProducts(val);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  };

  const applySuggestion = (s: ProductSuggestion) => {
    setForm(prev => ({
      ...prev,
      nom: s.nom,
      categorie: s.categorie,
      ...(s.valeur ? { valeur_estimee: String(s.valeur) } : {}),
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Calcule le nombre de tickets selon une marge cible
  const calcTickets = (marginPct: number) => {
    const prix = parseFloat(form.prix_ticket);
    const valeur = parseFloat(form.valeur_estimee);
    if (!prix || !valeur) return;
    // revenue = valeur / (1 - margin) pour avoir (rev - valeur) / rev = margin
    // tickets = ceil(revenue / prix)
    const revenue = marginPct >= 1 ? valeur * 10 : valeur / (1 - marginPct);
    const tickets = Math.ceil(revenue / prix);
    setForm(prev => ({ ...prev, total_tickets: String(tickets) }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Erreur upload."); return null; }
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    const url = await uploadFile(file);
    if (url) { setForm(prev => ({ ...prev, image_url: url })); setPreview(url); }
    setUploading(false);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingMedia(true); setError(null);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setMedias(prev => [...prev, ...urls]);
    setUploadingMedia(false);
    if (mediaRef.current) mediaRef.current.value = "";
  };

  const removeMedia = (idx: number) => {
    setMedias(prev => prev.filter((_, i) => i !== idx));
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
          date_ouverture: form.date_ouverture ? new Date(form.date_ouverture).toISOString() : null,
          image_url: form.image_url || null,
          valeur_estimee: form.valeur_estimee ? parseFloat(form.valeur_estimee) : null,
          medias,
        }),
      });
      const data = await res.json();
      if (res.status === 422 && data.error === "CONSTRAINT_ERROR") {
        setError("CONSTRAINT");
        return;
      }
      if (!res.ok) { setError(data.error || "Erreur."); return; }
      router.push("/admin/lots"); router.refresh();
    } catch { setError("Erreur de connexion."); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e0d9ff", fontFamily: "'Nunito', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#2D3436", marginBottom: 6 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Nom avec autocomplétion */}
      <div style={{ position: "relative" }} ref={suggestionsRef}>
        <label style={labelStyle}>Nom du lot *</label>
        <input
          name="nom" type="text" value={form.nom}
          onChange={handleNomChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="iPhone 16 Pro Max, Porsche 911, Rolex..."
          style={inputStyle} required
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
            background: "white", borderRadius: 14, border: "1.5px solid #e0d9ff",
            boxShadow: "0 8px 32px rgba(108,92,231,0.15)", overflow: "hidden", marginTop: 4,
          }}>
            {suggestions.map((s, i) => {
              const cat = CATEGORIES.find(c => c.val === s.categorie);
              return (
                <button
                  key={i} type="button" onClick={() => applySuggestion(s)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", background: "none", border: "none",
                    borderBottom: i < suggestions.length - 1 ? "1px solid #f0eeff" : "none",
                    cursor: "pointer", textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8f7ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{cat?.icon ?? "🎁"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#2D3436", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.nom}</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#b2bec3" }}>{cat?.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description détaillée..." rows={3} style={{ ...inputStyle, resize: "none" }} />
      </div>

      {/* Catégorie + valeur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Catégorie *</label>
          <select name="categorie" value={form.categorie} onChange={handleChange} style={inputStyle}>
            {CATEGORIES.map(c => <option key={c.val} value={c.val}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Valeur estimée (€)</label>
          <input name="valeur_estimee" type="number" step="0.01" min="0" value={form.valeur_estimee} onChange={handleChange} placeholder="999.00" style={inputStyle} />
        </div>
      </div>

      {/* Photo principale */}
      <div>
        <label style={labelStyle}>Photo principale (couverture)</label>
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

      {/* Galerie médias */}
      <div>
        <label style={labelStyle}>Galerie photos & vidéos</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          {medias.map((url, idx) => (
            <div key={idx} style={{ position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden", border: "2px solid #e0d9ff", flexShrink: 0 }}>
              {isVideo(url) ? (
                <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
              ) : (
                <Image src={url} alt={`media-${idx}`} fill style={{ objectFit: "cover" }} />
              )}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
              >
                <button type="button" onClick={() => removeMedia(idx)} style={{ background: "#E17055", color: "white", border: "none", borderRadius: 8, cursor: "pointer", padding: "4px 8px", fontWeight: 800, fontSize: 12 }}>✕</button>
              </div>
              {isVideo(url) && (
                <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "2px 6px", fontSize: 10, color: "white", fontWeight: 700 }}>▶ Vidéo</div>
              )}
            </div>
          ))}
          <div
            onClick={() => mediaRef.current?.click()}
            style={{
              width: 100, height: 100, borderRadius: 12, border: "2px dashed #A29BFE",
              cursor: "pointer", background: "#f8f5ff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4
            }}
          >
            {uploadingMedia ? (
              <div style={{ width: 24, height: 24, border: "3px solid #6C5CE7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
            ) : (
              <>
                <span style={{ fontSize: 24 }}>➕</span>
                <span style={{ fontSize: 10, color: "#A29BFE", fontWeight: 700 }}>Ajouter</span>
              </>
            )}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#b2bec3", fontFamily: "'Nunito', sans-serif" }}>Photos (JPG, PNG, WEBP) · Vidéos (MP4, WEBM, MOV) · Max 100 Mo/vidéo · Sélection multiple</p>
        <input ref={mediaRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleMediaUpload} />
      </div>

      {/* Prix + tickets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Prix / ticket (€) *</label>
          <input name="prix_ticket" type="number" step="0.01" min="0.01" value={form.prix_ticket} onChange={handleChange} placeholder="5.00" style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Nb total tickets *</label>
          <input name="total_tickets" type="number" min="1" value={form.total_tickets} onChange={handleChange} placeholder="100" style={inputStyle} required />
        </div>
      </div>

      {/* Calculateur de tickets */}
      {parseFloat(form.prix_ticket) > 0 && parseFloat(form.valeur_estimee) > 0 && (
        <div style={{ background: "#f8f7ff", borderRadius: 14, padding: "14px 16px", border: "1.5px dashed #A29BFE" }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: "#6C5CE7", marginBottom: 10 }}>
            ⚡ Calculer le nombre de tickets automatiquement
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "À l'équilibre", pct: 0, color: "#636E72", bg: "#f0f0f0" },
              { label: "+15 % de marge", pct: 0.15, color: "#00B894", bg: "#f0fff8" },
              { label: "+20 % de marge", pct: 0.20, color: "#0984E3", bg: "#f0f8ff" },
              { label: "+30 % de marge", pct: 0.30, color: "#6C5CE7", bg: "#f0eeff" },
            ].map(({ label, pct, color, bg }) => {
              const prix = parseFloat(form.prix_ticket);
              const valeur = parseFloat(form.valeur_estimee);
              const rev = pct >= 1 ? valeur * 10 : valeur / (1 - pct);
              const nb = Math.ceil(rev / prix);
              return (
                <button key={label} type="button" onClick={() => calcTickets(pct)}
                  style={{
                    background: bg, color, border: `1.5px solid ${color}44`,
                    borderRadius: 10, padding: "7px 12px", cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 15 }}>{nb} tickets</span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: "#b2bec3", fontFamily: "'Nunito', sans-serif", marginTop: 8 }}>
            Basé sur {parseFloat(form.valeur_estimee).toLocaleString("fr-FR")} € ÷ {parseFloat(form.prix_ticket).toFixed(2)} €/ticket · Hors frais Stripe
          </p>
        </div>
      )}

      {/* Ref + dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Référence *</label>
            <button type="button" onClick={generateRef} style={{
              background: "linear-gradient(135deg, #6C5CE7, #A29BFE)", color: "white",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
              padding: "4px 10px", boxShadow: "0 2px 8px rgba(108,92,231,0.3)"
            }}>⚡ Générer</button>
          </div>
          <input name="reference_lot" type="text" value={form.reference_lot} onChange={handleChange} placeholder="LOT-2026-001" style={inputStyle} required />
          <p style={{ fontSize: 11, color: "#b2bec3", marginTop: 4, fontFamily: "'Nunito', sans-serif" }}>Visible par les participants</p>
        </div>
        <div>
          <label style={labelStyle}>Date de clôture du tirage</label>
          <div className="custom-datepicker-wrapper">
            <DatePicker
              selected={form.date_fin ? new Date(form.date_fin) : null}
              onChange={(date: Date | null) => setForm(f => ({ ...f, date_fin: date ? date.toISOString() : "" }))}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd MMMM yyyy, HH:mm"
              locale="fr"
              placeholderText="Choisir date & heure"
              className="datepicker-input"
            />
          </div>
        </div>
      </div>

      {/* Programmation */}
      <div style={{ background: "#f8f7ff", borderRadius: 16, padding: 16, border: "1.5px dashed #A29BFE" }}>
        <label style={{ ...labelStyle, color: "#6C5CE7" }}>🗓 Programmer l&apos;ouverture du lot</label>
        <p style={{ fontSize: 12, color: "#b2bec3", fontFamily: "'Nunito', sans-serif", marginBottom: 10 }}>
          Le lot s&apos;affichera en mode &quot;Prochainement&quot; avec un compte à rebours jusqu&apos;à cette date.
        </p>
        <div className="custom-datepicker-wrapper">
          <DatePicker
            selected={form.date_ouverture ? new Date(form.date_ouverture) : null}
            onChange={(date: Date | null) => setForm(f => ({ ...f, date_ouverture: date ? date.toISOString() : "" }))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd MMMM yyyy, HH:mm"
            locale="fr"
            placeholderText="Choisir date d'ouverture"
            className="datepicker-input"
          />
        </div>
        {form.date_ouverture && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#6C5CE7", fontWeight: 700 }}>
              ✅ Ouverture programmée — le statut passera automatiquement à &quot;Programmé&quot;
            </span>
            <button type="button" onClick={() => setForm(f => ({ ...f, date_ouverture: "" }))} style={{ fontSize: 11, color: "#E17055", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Annuler</button>
          </div>
        )}
      </div>

      {/* Statut */}
      <div>
        <label style={labelStyle}>Statut</label>
        <select name="statut" value={form.statut} onChange={handleChange} style={inputStyle}>
          <option value="actif">🟢 Actif</option>
          <option value="termine">🔴 Terminé</option>
          <option value="archive">📦 Archivé</option>
        </select>
      </div>

      {/* ── Simulation financière ── */}
      <SimulationPanel
        prixTicket={parseFloat(form.prix_ticket) || 0}
        totalTickets={parseInt(form.total_tickets) || 0}
        valeurLot={parseFloat(form.valeur_estimee) || 0}
      />

      {error === "CONSTRAINT" && (
        <div style={{ background: "#fff3f0", border: "2px solid #E17055", borderRadius: 16, padding: "16px 18px", fontFamily: "'Nunito', sans-serif" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#E17055", marginBottom: 10 }}>
            ⚠️ La base de données doit être mise à jour
          </div>
          <p style={{ fontSize: 13, color: "#636E72", marginBottom: 12, lineHeight: 1.6 }}>
            Les nouvelles catégories et statuts ne sont pas encore autorisés par Supabase.<br />
            Copie ce SQL et colle-le dans{" "}
            <a
              href={`https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "")}/sql/new`}
              target="_blank" rel="noreferrer"
              style={{ color: "#6C5CE7", fontWeight: 800 }}
            >
              Supabase → SQL Editor
            </a>
            , puis réessaie.
          </p>
          <div style={{ position: "relative" }}>
            <pre style={{
              background: "#2D3436", color: "#A29BFE", borderRadius: 12,
              padding: "12px 14px", fontSize: 11, overflowX: "auto",
              lineHeight: 1.6, margin: 0,
            }}>{`DO $$
DECLARE c RECORD;
BEGIN
  FOR c IN
    SELECT constraint_name FROM information_schema.table_constraints
    WHERE table_name = 'lots' AND constraint_type = 'CHECK'
  LOOP
    EXECUTE 'ALTER TABLE lots DROP CONSTRAINT "' || c.constraint_name || '"';
  END LOOP;
END $$;

ALTER TABLE lots ADD CONSTRAINT lots_statut_check
  CHECK (statut IN ('actif','termine','archive','programme'));

ALTER TABLE lots ADD CONSTRAINT lots_categorie_check
  CHECK (categorie IN (
    'smartphone','tech','gaming','audio','photo','tv',
    'maison','electromenager','mode','bijoux','montres','sacs',
    'chaussures','parfum','sport','voiture','moto','voyage',
    'gastronomie','art','luxe','enfants','culture','crypto','autre'
  ));`}</pre>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(`DO $$\nDECLARE c RECORD;\nBEGIN\n  FOR c IN\n    SELECT constraint_name FROM information_schema.table_constraints\n    WHERE table_name = 'lots' AND constraint_type = 'CHECK'\n  LOOP\n    EXECUTE 'ALTER TABLE lots DROP CONSTRAINT "' || c.constraint_name || '"';\n  END LOOP;\nEND $$;\n\nALTER TABLE lots ADD CONSTRAINT lots_statut_check\n  CHECK (statut IN ('actif','termine','archive','programme'));\n\nALTER TABLE lots ADD CONSTRAINT lots_categorie_check\n  CHECK (categorie IN ('smartphone','tech','gaming','audio','photo','tv','maison','electromenager','mode','bijoux','montres','sacs','chaussures','parfum','sport','voiture','moto','voyage','gastronomie','art','luxe','enfants','culture','crypto','autre'));`)}
              style={{
                position: "absolute", top: 8, right: 8,
                background: "#6C5CE7", color: "white", border: "none",
                borderRadius: 8, padding: "4px 12px", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
              }}
            >
              📋 Copier
            </button>
          </div>
        </div>
      )}

      {error && error !== "CONSTRAINT" && (
        <div style={{ background: "#fff3f0", border: "2px solid #E17055", borderRadius: 14, padding: "12px 16px", color: "#E17055", fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button type="submit" disabled={loading || uploading || uploadingMedia} className="btn-fun">
          {loading ? "⏳ Enregistrement..." : mode === "create" ? "🎁 Créer le lot" : "💾 Enregistrer"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Annuler</button>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .custom-datepicker-wrapper { width: 100%; }
        .datepicker-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1.5px solid #e0d9ff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .datepicker-input:focus {
          border-color: #6C5CE7;
          box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
        }
        .react-datepicker {
          font-family: 'Nunito', sans-serif !important;
          border-radius: 16px !important;
          border: 1px solid #e0d9ff !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: #f8f7ff !important;
          border-bottom: 1px solid #e0d9ff !important;
          padding-top: 12px !important;
        }
        .react-datepicker__current-month {
          color: #6C5CE7 !important;
          font-weight: 800 !important;
        }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background-color: #6C5CE7 !important;
          border-radius: 8px !important;
        }
        .react-datepicker__day:hover {
          background-color: #f0eeff !important;
          border-radius: 8px !important;
        }
        .react-datepicker__time-container {
          width: 100px !important;
        }
        .react-datepicker__time-box {
          width: 100% !important;
        }
        .react-datepicker-wrapper { width: 100%; }
      `}</style>
    </form>
  );
}
