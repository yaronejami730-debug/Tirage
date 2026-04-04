"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  dateFin: string;
}

export default function CountdownTimer({ dateFin }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dateFin).getTime() - Date.now();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return { d, h, m, s, expired: false };
    };

    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [dateFin]);

  if (timeLeft.expired) {
    return <span className="text-xs font-semibold text-red-500">Terminé</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {timeLeft.d > 0 && (
        <>
          <Block value={timeLeft.d} label="j" />
          <Dot />
        </>
      )}
      <Block value={timeLeft.h} label="h" />
      <Dot />
      <Block value={timeLeft.m} label="m" />
      <Dot />
      <Block value={timeLeft.s} label="s" />
    </div>
  );
}

function Block({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold text-white tabular-nums">{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] text-white/70">{label}</span>
    </div>
  );
}

function Dot() {
  return <span className="text-white/50 text-xs font-bold">:</span>;
}
