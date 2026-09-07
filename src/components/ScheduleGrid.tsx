"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DAY_LABEL, SESSION_TYPE_LABEL } from "@/lib/categories";
import "./schedule.css";

export type ScheduleItem = {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  type: string;
  capacity: number | null;
  rsvpCount: number;
  isRsvped: boolean;
};

const DAY_FILTERS = ["All days", "0", "1", "2", "3", "4"];
const TYPE_FILTERS = ["All types", "PLENARY", "BREAKOUT", "WORKSHOP", "MARKETPLACE", "NETWORKING", "CEREMONY"];

/** Polls capacity counts so the public grid reflects RSVPs made elsewhere. */
function useLiveCounts(initial: ScheduleItem[], enabled: boolean) {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(initial.map((s) => [s.id, s.rsvpCount])),
  );

  useEffect(() => {
    setCounts(Object.fromEntries(initial.map((s) => [s.id, s.rsvpCount])));
  }, [initial]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/sessions", { cache: "no-store" });
        if (!res.ok) return;
        const data: Array<{ id: string; rsvpCount: number }> = await res.json();
        if (!cancelled) setCounts(Object.fromEntries(data.map((d) => [d.id, d.rsvpCount])));
      } catch {
        // Transient network failure — keep showing the last known counts.
      }
    };
    const id = setInterval(tick, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled]);

  return counts;
}

export function ScheduleGrid({
  sessions,
  isLoggedIn,
  variant = "public",
}: {
  sessions: ScheduleItem[];
  isLoggedIn: boolean;
  variant?: "public" | "compact";
}) {
  const [day, setDay] = useState("All days");
  const [type, setType] = useState("All types");
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const counts = useLiveCounts(sessions, variant === "public");

  const filtered = useMemo(
    () =>
      sessions.filter(
        (s) =>
          (day === "All days" || String(s.day) === day) &&
          (type === "All types" || s.type === type),
      ),
    [sessions, day, type],
  );

  async function toggleRsvp(item: ScheduleItem) {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: item.id, action: item.isRsvped ? "remove" : "add" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Could not update your schedule. Please try again.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className={`schedule${variant === "compact" ? " schedule--compact" : ""}`}>
      <div className="schedule__filters">
        <fieldset className="schedule__filter-group">
          <legend className="schedule__filter-legend">Day</legend>
          <div className="schedule__chips">
            {DAY_FILTERS.map((d) => (
              <button
                key={d}
                type="button"
                className={`chip${day === d ? " is-on" : ""}`}
                aria-pressed={day === d}
                onClick={() => setDay(d)}
              >
                {d === "All days" ? d : DAY_LABEL[Number(d)]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="schedule__filter-group">
          <legend className="schedule__filter-legend">Type</legend>
          <div className="schedule__chips">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip${type === t ? " is-on" : ""}`}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t === "All types" ? t : SESSION_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="schedule__count" aria-live="polite">
        Showing {filtered.length} of {sessions.length} session{sessions.length === 1 ? "" : "s"}
      </p>

      {error && <p className="schedule__error" role="alert">{error}</p>}

      {filtered.length === 0 ? (
        <p className="schedule__empty">
          No sessions match that combination. Try a different day or session type.
        </p>
      ) : (
        <div className={`schedule__grid${variant === "compact" ? " schedule__grid--compact" : ""}`}>
          {filtered.map((s) => {
            const count = counts[s.id] ?? s.rsvpCount;
            const remaining = s.capacity === null ? null : Math.max(0, s.capacity - count);
            const isFull = remaining !== null && remaining === 0 && !s.isRsvped;
            const busy = busyId === s.id || pending;

            return (
              <article key={s.id} className="scard">
                <div className="scard__meta">
                  <span className="scard__day">{DAY_LABEL[s.day]}</span>
                  <span className="scard__time">{s.time}</span>
                </div>
                <h3 className="scard__title">{s.title}</h3>
                <p className="scard__desc">{s.description}</p>
                <div className="scard__foot">
                  <span className={`tag tag--${s.type.toLowerCase()}`}>{SESSION_TYPE_LABEL[s.type]}</span>
                  {remaining !== null && (
                    <span className={`scard__cap${isFull ? " is-full" : ""}`}>
                      {isFull ? "Fully booked" : `${remaining} of ${s.capacity} spots left`}
                    </span>
                  )}
                </div>
                {isLoggedIn && (
                  <button
                    type="button"
                    className={`scard__rsvp${s.isRsvped ? " is-on" : ""}`}
                    onClick={() => toggleRsvp(s)}
                    disabled={busy || isFull}
                    aria-label={
                      isFull
                        ? `${s.title} is fully booked`
                        : s.isRsvped
                          ? `Remove ${s.title} from my schedule`
                          : `Add ${s.title} to my schedule`
                    }
                  >
                    {busy ? "Saving…" : isFull ? "Fully booked" : s.isRsvped ? "✓ On my schedule" : "Add to my schedule"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
