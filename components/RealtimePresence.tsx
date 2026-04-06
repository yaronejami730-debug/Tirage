"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";

export default function RealtimePresence() {
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname?.startsWith("/admin");
    const supabase = supabaseClient;
    const channel = supabase.channel("global-presence", {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7),
        },
      },
    });

    channel
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            role: isAdmin ? "admin" : "user",
          });
        }
      });

    return () => { channel.unsubscribe(); };
  }, [pathname]);

  return null;
}
