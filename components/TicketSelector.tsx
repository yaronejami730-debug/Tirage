"use client";

interface TicketSelectorProps {
  max: number;
  value: number;
  onChange: (value: number) => void;
  prixTicket: number;
}

const QUICK = [1, 2, 3, 5, 10];

export default function TicketSelector({ max, value, onChange, prixTicket }: TicketSelectorProps) {
  const total = value * prixTicket;

  return (
    <div style={{ background: "#f8f7ff", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Compteur − valeur + */}
      <div>
        <label style={{ display: "block", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#2D3436", marginBottom: 10 }}>
          Nombre de tickets
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            style={{
              width: 44, height: 44, borderRadius: 14,
              border: "2px solid #e0d9ff", background: "white",
              fontSize: 20, fontWeight: 800, color: "#6C5CE7",
              cursor: value <= 1 ? "not-allowed" : "pointer",
              opacity: value <= 1 ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all .15s",
            }}
          >−</button>

          <input
            type="number"
            min={1}
            max={max}
            value={value}
            onChange={e => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v >= 1 && v <= max) onChange(v);
            }}
            style={{
              flex: 1, textAlign: "center", fontSize: 26, fontWeight: 900,
              fontFamily: "'Fredoka One', cursive", color: "#2D3436",
              border: "2px solid #e0d9ff", borderRadius: 14, padding: "8px",
              background: "white", outline: "none",
            }}
          />

          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            style={{
              width: 44, height: 44, borderRadius: 14,
              border: "2px solid #e0d9ff", background: "white",
              fontSize: 20, fontWeight: 800, color: "#6C5CE7",
              cursor: value >= max ? "not-allowed" : "pointer",
              opacity: value >= max ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all .15s",
            }}
          >+</button>
        </div>
        <p style={{ fontSize: 11, color: "#b2bec3", textAlign: "center", marginTop: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          Maximum {max} ticket{max > 1 ? "s" : ""} par commande
        </p>
      </div>

      {/* Sélection rapide */}
      {max >= 3 && (
        <div>
          <p style={{ fontSize: 12, color: "#636E72", fontWeight: 700, fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>
            Sélection rapide :
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUICK.filter(n => n <= max).map(n => {
              const active = value === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(n)}
                  style={{
                    padding: "8px 18px", borderRadius: 12,
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                    cursor: "pointer", transition: "all .15s",
                    border: active ? "2px solid #FF7043" : "2px solid #e0d9ff",
                    background: active ? "linear-gradient(135deg, #FF7043, #FF8C42)" : "white",
                    color: active ? "white" : "#636E72",
                    boxShadow: active ? "0 4px 14px rgba(255,112,67,0.35)" : "none",
                    transform: active ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Récapitulatif prix */}
      <div style={{ borderTop: "1.5px solid #e0d9ff", paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#636E72", fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginBottom: 6 }}>
          <span>{value} ticket{value > 1 ? "s" : ""} × {Number(prixTicket).toFixed(2)} €</span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#2D3436" }}>Total</span>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#6C5CE7" }}>
            {total.toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
}
