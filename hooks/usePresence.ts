"use client";
import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "@/lib/supabase";

const HEARTBEAT_INTERVAL = 1_000; // 1s pour un temps réel instantané (ultra agressif)

function getSessionId(): string {
  let uid = sessionStorage.getItem("gowingo_uid");
  if (!uid) {
    uid = crypto.randomUUID();
    sessionStorage.setItem("gowingo_uid", uid);
  }
  return uid;
}

export function usePresence(channel: string, role: "user" | "admin" = "user"): number {
  const [count, setCount] = useState(0);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    sessionId.current = getSessionId();
    const sid = sessionId.current;

    // Heartbeat : UPSERT en base + retourne le count
    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid, channel, role }),
        });
        if (res.ok) {
          const data = await res.json();
          setCount(data.count ?? 0);
        }
      } catch {
        // silencieux si réseau indisponible
      }
    };

    // Fetch count seul (sans UPSERT) — utilisé par le realtime
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/presence?channel=${encodeURIComponent(channel)}`);
        if (res.ok) {
          const data = await res.json();
          setCount(data.count ?? 0);
        }
      } catch {
        // silencieux
      }
    };

    // Premier heartbeat immédiat
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Realtime : écoute les changements sur la table presence_sessions
    const supabase = supabaseClient;
    const sub = supabase
      .channel(`presence_realtime_${channel}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "presence_sessions",
          filter: `channel=eq.${channel}`,
        },
        fetchCount // pas de heartbeat ici pour éviter une boucle
      )
      .subscribe();

    // Déconnexion propre quand l'onglet se ferme
    const handleUnload = () => {
      navigator.sendBeacon(
        "/api/presence",
        new Blob(
          [JSON.stringify({ session_id: sid, channel, role })],
          { type: "application/json" }
        )
      );
    };
    // sendBeacon ne supporte pas DELETE, on utilise un flag dans le body
    // → la route DELETE gère la suppression
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleUnload();
    });

    return () => {
      clearInterval(interval);
      supabase.removeChannel(sub);
      // Suppression propre de la session
      fetch("/api/presence", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, channel, role }),
        keepalive: true,
      }).catch(() => {});
    };
  }, [channel]);

  return count;
}
