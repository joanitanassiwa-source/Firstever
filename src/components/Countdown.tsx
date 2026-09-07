"use client";

import { useEffect, useState } from "react";
import "./countdown.css";

// Opening ceremony: 10 Nov 2026, 09:00 Gaborone time (CAT, UTC+2).
const TARGET = new Date("2026-11-10T09:00:00+02:00").getTime();

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

function remaining(now: number) {
  const diff = Math.max(0, TARGET - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
}

export function Countdown() {
  // Null until mounted so server and client markup agree on first paint.
  const [t, setT] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    setT(remaining(Date.now()));
    const id = setInterval(() => setT(remaining(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="countdown">
      <p className="countdown__label">
        {t?.done ? "The conference is under way" : "Counting down to the opening ceremony"}
      </p>
      <div className="countdown__units">
        {UNITS.map((u) => (
          <div key={u.key} className="countdown__unit">
            <span className="countdown__value">
              {t ? String(t[u.key]).padStart(2, "0") : "––"}
            </span>
            <span className="countdown__unit-label">{u.label}</span>
          </div>
        ))}
      </div>
      {/* Screen readers get one calm summary rather than a per-second barrage. */}
      <p className="sr-only" aria-live="polite">
        {t ? `${t.days} days, ${t.hours} hours and ${t.minutes} minutes until the opening ceremony.` : ""}
      </p>
    </div>
  );
}
