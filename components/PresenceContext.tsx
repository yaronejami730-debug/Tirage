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
  const channelRef = React.useRef<any>(null);

  // 1. INITIALISATION DU CANAL (UNE SEULE FOIS)
  useEffect(() => {
    const channel = supabaseClient.channel("global-presence", {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7),
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const visitors = Object.values(state).filter((presences: any) =>
          presences.some((p: any) => p.role === "user")
        ).length;
        setOnlineCount(visitors);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // 2. MISE À JOUR DU TRACKING LORS DU CHANGEMENT DE PAGE
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;

    const updateTracking = async () => {
      const isAdmin = pathname?.startsWith("/admin");
      // On attend que la souscription soit prête avant de tracker (si premier chargement)
      await channel.track({
        online_at: new Date().toISOString(),
        role: isAdmin ? "admin" : "user",
      });
    };

    updateTracking();
  }, [pathname]);

  return (
    <PresenceContext.Provider value={{ onlineCount }}>
      {children}
    </PresenceContext.Provider>
  );
}

export const useOnlineCount = () => useContext(PresenceContext).onlineCount;
