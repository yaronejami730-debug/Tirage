"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export function usePresence(channelName: string): number {
  // Commence à 1 : le visiteur actuel est toujours "en ligne" dès le montage
  const [count, setCount] = useState(1);

  useEffect(() => {
    const supabase = supabaseClient();

    let uid = sessionStorage.getItem("gowingo_uid");
    if (!uid) {
      uid = crypto.randomUUID();
      sessionStorage.setItem("gowingo_uid", uid);
    }

    const channel = supabase.channel(channelName, {
      config: { presence: { key: uid } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const n = Object.keys(state).length;
        // Garantit au minimum 1 (soi-même)
        setCount(Math.max(n, 1));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ joined_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return count;
}
