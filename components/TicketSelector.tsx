"use client";

interface TicketSelectorProps {
  max: number;
  value: number;
  onChange: (value: number) => void;
  prixTicket: number;
}

export default function TicketSelector({
  max,
  value,
  onChange,
  prixTicket,
}: TicketSelectorProps) {
  const total = value * prixTicket;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
      <div>
        <label className="label">Nombre de tickets</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-sm"
          >
            −
          </button>

          <div className="flex-1">
            <input
              type="number"
              min={1}
              max={max}
              value={value}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 1 && v <= max) {
                  onChange(v);
                }
              }}
              className="w-full text-center text-2xl font-bold text-gray-900 border border-gray-200 rounded-xl py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-sm"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Maximum {max} ticket{max > 1 ? "s" : ""} par commande
        </p>
      </div>

      {/* Quick select buttons */}
      {max >= 3 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Sélection rapide :</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 5, 10]
              .filter((n) => n <= max)
              .map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    value === n
                      ? "bg-primary-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Price summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
          <span>
            {value} ticket{value > 1 ? "s" : ""} × {Number(prixTicket).toFixed(2)} €
          </span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            {total.toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
}
