"use client";

import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { usePresence } from "@/hooks/usePresence";

interface PresenceContextType {
  onlineCount: number;
}

const PresenceContext = createContext<PresenceContextType>({ onlineCount: 0 });

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const onlineCount = usePresence("platform", isAdmin ? "admin" : "user");

  return (
    <PresenceContext.Provider value={{ onlineCount }}>
      {children}
    </PresenceContext.Provider>
  );
}

export const useOnlineCount = () => useContext(PresenceContext).onlineCount;
