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
    <div style={{ background: "#f5f5f7", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 18, border: "1px solid rgba(0,0,0,0.06)" }}>

      {/* Compteur − valeur + */}
      <div>
        <label style={{ display: "block", fontFamily: "inherit", fontWeight: 500, fontSize: 11, color: "#a1a1a6", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Nombre de tickets
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            style={{
              width: 44, height: 44, borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff",
              fontSize: 20, fontWeight: 500, color: "#1d1d1f",
              cursor: value <= 1 ? "not-allowed" : "pointer",
              opacity: value <= 1 ? 0.3 : 1,
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
              flex: 1, textAlign: "center",
              fontSize: 24, fontWeight: 700,
              fontFamily: "inherit",
              color: "#1d1d1f", letterSpacing: "-0.02em",
              border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "10px",
              background: "#ffffff", outline: "none",
            }}
          />

          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            style={{
              width: 44, height: 44, borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff",
              fontSize: 20, fontWeight: 500, color: "#1d1d1f",
              cursor: value >= max ? "not-allowed" : "pointer",
              opacity: value >= max ? 0.3 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all .15s",
            }}
          >+</button>
        </div>
        <p style={{ fontSize: 11, color: "#a1a1a6", textAlign: "center", marginTop: 6, fontFamily: "inherit", fontWeight: 400 }}>
          Maximum {max} ticket{max > 1 ? "s" : ""} par commande
        </p>
      </div>

      {/* Sélection rapide */}
      {max >= 3 && (
        <div>
          <p style={{ fontSize: 11, color: "#a1a1a6", fontWeight: 500, fontFamily: "inherit", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Sélection rapide
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
                    padding: "8px 18px", borderRadius: 10,
                    fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                    cursor: "pointer", transition: "all .15s",
                    border: "1px solid",
                    borderColor: active ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.09)",
                    background: active ? "#1d1d1f" : "#ffffff",
                    color: active ? "#ffffff" : "#6e6e73",
                    letterSpacing: "-0.01em",
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
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#a1a1a6", fontFamily: "inherit", fontWeight: 400, marginBottom: 6 }}>
          <span>{value} ticket{value > 1 ? "s" : ""} × {Number(prixTicket).toFixed(2)} €</span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "inherit", fontWeight: 500, fontSize: 13, color: "#6e6e73" }}>Total</span>
          <span style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 24, color: "#1d1d1f", letterSpacing: "-0.02em" }}>
            {total.toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
}
