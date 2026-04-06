"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";

interface PresenceContextType {
  onlineCount: number;
}

const PresenceContext = createContext<PresenceContextType>({ onlineCount: 0 });

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [onlineCount, setOnlineCount] = useState(0);
  const pathname = usePathname();
  const [channel, setChannel] = useState<any>(null);

  // 1. Initialisation du canal
  useEffect(() => {
    const ch = supabaseClient.channel("global-presence", {
      config: { presence: { key: Math.random().toString(36).substring(7) } }
    });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const visitors = Object.values(state).filter((presences: any) =>
        presences.some((p: any) => p.role === "user")
      ).length;
      setOnlineCount(visitors);
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setChannel(ch);
      }
    });

    return () => { ch.unsubscribe(); };
  }, []);

  // 2. Mise à jour du tracking quand l'URL change ou que le canal est prêt
  useEffect(() => {
    if (!channel) return;
    
    const isAdmin = pathname?.startsWith("/admin");
    channel.track({
      online_at: new Date().toISOString(),
      role: isAdmin ? "admin" : "user",
    });
  }, [channel, pathname]);

  return (
    <PresenceContext.Provider value={{ onlineCount }}>
      {children}
    </PresenceContext.Provider>
  );
}

export const useOnlineCount = () => useContext(PresenceContext).onlineCount;
