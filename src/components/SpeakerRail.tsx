"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./speakers.css";

export type SpeakerCard = {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarColor: string;
  initials: string;
};

export function SpeakerRail({ speakers }: { speakers: SpeakerCard[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  const active = speakers.find((s) => s.id === activeId) ?? null;

  // Clicking the already-active photo collapses the panel back to its
  // placeholder, so only ever one bio is open — the section stays short no
  // matter how many speakers the admin adds later.
  const toggle = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setFlash(true);
    const flashTimer = setTimeout(() => setFlash(false), 1200);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bioRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });

    return () => clearTimeout(flashTimer);
  }, [activeId]);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(280, rail.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div className="speakers">
      <div className="speakers__rail-wrap">
        <div className="speakers__rail" ref={railRef} role="list">
          {speakers.map((s) => {
            const isActive = s.id === activeId;
            return (
              <div className="speakers__item" role="listitem" key={s.id}>
                <button
                  type="button"
                  className={`speakers__photo${isActive ? " is-active" : ""}`}
                  style={{
                    // Each speaker's own colour drives the fill and the hover halo.
                    ["--speaker-color" as string]: s.avatarColor,
                  }}
                  onClick={() => toggle(s.id)}
                  aria-expanded={isActive}
                  aria-controls="speaker-bio"
                  aria-label={`${isActive ? "Hide" : "Read"} the biography of ${s.name}, ${s.title}`}
                >
                  <span className="speakers__initials" aria-hidden="true">{s.initials}</span>
                </button>
                <span className="speakers__name">{s.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="speakers__controls">
        <button type="button" className="speakers__arrow" onClick={() => scrollRail(-1)} aria-label="Scroll speakers left">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2 L4 8 L10 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="speakers__arrow" onClick={() => scrollRail(1)} aria-label="Scroll speakers right">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2 L12 8 L6 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div
        id="speaker-bio"
        ref={bioRef}
        className={`speakers__bio${active ? " is-open" : ""}${flash ? " is-flash" : ""}`}
        aria-live="polite"
      >
        {active ? (
          <div className="speakers__bio-inner">
            <div className="speakers__bio-avatar" style={{ background: active.avatarColor }} aria-hidden="true">
              {active.initials}
            </div>
            <div className="speakers__bio-text">
              <h3 className="speakers__bio-name">{active.name}</h3>
              <p className="speakers__bio-title">{active.title}</p>
              <p className="speakers__bio-body">{active.bio}</p>
            </div>
          </div>
        ) : (
          <p className="speakers__placeholder">Tap a photo above to read their bio.</p>
        )}
      </div>
    </div>
  );
}
