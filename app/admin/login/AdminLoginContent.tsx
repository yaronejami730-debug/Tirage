"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Mode = "login" | "register";

export default function AdminLoginContent() {
  const [mode, setMode] = useState<Mode>("login");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password, code }),
      });

      if (res.ok) {
        window.location.href = redirect;
      } else {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FF", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6C5CE7, #FD79A8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 12px", boxShadow: "0 8px 24px rgba(108,92,231,0.3)"
          }}>🔐</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, background: "linear-gradient(135deg, #6C5CE7, #FD79A8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            Administration
          </h1>
          <p style={{ color: "#b2bec3", fontSize: 13, marginTop: 4 }}>Espace réservé</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(108,92,231,0.08)", border: "1px solid #f0eeff" }}>

          {/* Toggle */}
          <div style={{ display: "flex", background: "#f8f7ff", borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif",
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? "#6C5CE7" : "#b2bec3",
                  boxShadow: mode === m ? "0 2px 8px rgba(108,92,231,0.12)" : "none",
                  transition: "all .2s",
                }}
              >
                {m === "login" ? "Se connecter" : "Créer un compte"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Code secret (register only) */}
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#636e72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Code d&apos;accès
                </label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••"
                  required
                  autoFocus
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 12, border: "2px solid #f0eeff",
                    fontFamily: "'Nunito', sans-serif", fontSize: 15, outline: "none",
                    boxSizing: "border-box", transition: "border-color .2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#6C5CE7"}
                  onBlur={(e) => e.target.style.borderColor = "#f0eeff"}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#636e72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus={mode === "login"}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 12, border: "2px solid #f0eeff",
                  fontFamily: "'Nunito', sans-serif", fontSize: 15, outline: "none",
                  boxSizing: "border-box", transition: "border-color .2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#6C5CE7"}
                onBlur={(e) => e.target.style.borderColor = "#f0eeff"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#636e72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 12, border: "2px solid #f0eeff",
                  fontFamily: "'Nunito', sans-serif", fontSize: 15, outline: "none",
                  boxSizing: "border-box", transition: "border-color .2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#6C5CE7"}
                onBlur={(e) => e.target.style.borderColor = "#f0eeff"}
              />
            </div>

            {error && (
              <div style={{ background: "#fff3f0", border: "1px solid #fab1a0", borderRadius: 10, padding: "10px 14px", color: "#E17055", fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "#dfe6e9" : "linear-gradient(135deg, #6C5CE7, #FD79A8)",
                color: "white", fontWeight: 800, fontSize: 15, fontFamily: "'Nunito', sans-serif",
                boxShadow: loading ? "none" : "0 4px 15px rgba(108,92,231,0.3)",
                transition: "all .2s",
              }}
            >
              {loading ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
