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

  useEffect(() => {
    const isAdmin = pathname?.startsWith("/admin");
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
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            role: isAdmin ? "admin" : "user",
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [pathname]);

  return (
    <PresenceContext.Provider value={{ onlineCount }}>
      {children}
    </PresenceContext.Provider>
  );
}

export const useOnlineCount = () => useContext(PresenceContext).onlineCount;
