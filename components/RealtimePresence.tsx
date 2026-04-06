"use client";

import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabase";

export default function RealtimePresence() {
  useEffect(() => {
    const supabase = supabaseClient();
    const channel = supabase.channel("global-presence", {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7), // UNIQUE KEY PER TAB
        },
      },
    });

    channel
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return null;
}
