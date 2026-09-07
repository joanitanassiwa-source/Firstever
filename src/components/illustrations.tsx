/* =========================================================================
   Original line-art illustrations. No stock photography anywhere on the site:
   every figure here is drawn from primitives in the AU brand palette, which
   keeps the illustration language consistent and avoids licensing exposure.

   The recurring motif is the kgotla — Botswana's community meeting circle —
   rendered as concentric rings of small abstract figures.
   ========================================================================= */

const GOLD = "#B4A269";
const GREEN = "#348F41";
const DEEP = "#1A5632";

/** One abstract person: circle head over a trapezoid body. */
function Figure({ scale = 1, color = GOLD, opacity = 1 }: { scale?: number; color?: string; opacity?: number }) {
  return (
    <g transform={`scale(${scale})`} opacity={opacity}>
      <circle cx="0" cy="-17.5" r="6.2" fill={color} />
      <path d="M -7 0 L -4.6 -10.5 L 4.6 -10.5 L 7 0 Z" fill={color} />
    </g>
  );
}

/**
 * Hero illustration — the "Ubuntu circle".
 * Two concentric rings of figures (10 outer, 8 inner) radiating from a filled
 * centre dot, over faint ring outlines for depth.
 */
export function UbuntuCircle({ className }: { className?: string }) {
  const cx = 260;
  const cy = 258;
  const rings = [
    { radius: 196, count: 10, scale: 1.5, opacity: 1 },
    { radius: 118, count: 8, scale: 1.15, opacity: 0.9 },
  ];

  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label="An Ubuntu circle: two concentric rings of abstract figures gathered around a central point, echoing Botswana's kgotla meeting circle."
    >
      {/* faint depth rings behind the figures */}
      {[246, 158, 92, 46].map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth="1" opacity={0.3 - i * 0.05} />
      ))}

      {rings.map((ring) =>
        Array.from({ length: ring.count }).map((_, i) => {
          const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * ring.radius;
          const y = cy + Math.sin(angle) * ring.radius;
          // Figures stay upright wherever they sit on the ring: a kgotla is a
          // circle of people standing, not a pinwheel.
          return (
            <g key={`${ring.radius}-${i}`} transform={`translate(${x} ${y})`}>
              <Figure scale={ring.scale} color={GOLD} opacity={ring.opacity} />
            </g>
          );
        }),
      )}

      {/* centre: the point consensus gathers around */}
      <circle cx={cx} cy={cy} r="13" fill={GOLD} />
      <circle cx={cx} cy={cy} r="24" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

/**
 * About section — a thin horizontal strip of standing figures, varying in
 * height, a few wearing a simple arc headwrap, cycling through the palette.
 */
export function CrowdStrip({ className }: { className?: string }) {
  const count = 14;
  const palette = [GOLD, GREEN, DEEP, GOLD, GREEN];

  return (
    <svg
      viewBox="0 0 620 120"
      className={className}
      role="img"
      aria-label="A strip of fourteen abstract standing figures representing the breadth of Africa's volunteer community."
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = 26 + i * 42;
        // Deterministic pseudo-variation keeps server and client render identical.
        const h = 58 + ((i * 37) % 5) * 9;
        const color = palette[i % palette.length]!;
        const headwrap = i % 4 === 1;
        const headY = 120 - h;
        return (
          <g key={i}>
            <path d={`M ${x - 11} 118 L ${x - 7} ${headY + 14} L ${x + 7} ${headY + 14} L ${x + 11} 118 Z`} fill={color} opacity="0.9" />
            <circle cx={x} cy={headY + 3} r="7" fill={color} />
            {headwrap && (
              <path
                d={`M ${x - 9} ${headY + 1} A 9 9 0 0 1 ${x + 9} ${headY + 1}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

const vignetteProps = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Five everyday volunteering scenes, two-tone and geometric. */
export function TreePlanting({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} role="img" aria-label="A volunteer planting a young tree.">
      <g {...vignetteProps} stroke={GREEN}>
        <path d="M92 96 L92 66" />
        <path d="M92 66 C 78 64, 74 50, 84 44 C 88 34, 104 34, 108 44 C 118 50, 112 66, 92 66 Z" stroke={GOLD} />
        <path d="M92 78 L82 70 M92 84 L102 76" />
      </g>
      <g {...vignetteProps} stroke={GOLD}>
        <circle cx="44" cy="34" r="9" />
        <path d="M44 43 L44 72" />
        <path d="M44 50 L62 60 M44 50 L30 62" />
        <path d="M44 72 L34 96 M44 72 L54 96" />
      </g>
      <line x1="16" y1="96" x2="124" y2="96" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function YouthMentorship({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} role="img" aria-label="An experienced volunteer mentoring a young person.">
      <g {...vignetteProps} stroke={GOLD}>
        <circle cx="46" cy="30" r="10" />
        <path d="M46 40 L46 72 M46 72 L36 96 M46 72 L56 96" />
        <path d="M46 52 L72 58" />
      </g>
      <g {...vignetteProps} stroke={GREEN}>
        <circle cx="96" cy="48" r="8" />
        <path d="M96 56 L96 78 M96 78 L88 96 M96 78 L104 96" />
        <path d="M96 64 L74 58" />
      </g>
      <line x1="16" y1="96" x2="124" y2="96" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HealthOutreach({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} role="img" aria-label="A community health volunteer reaching a household, shown as a heart with a cross above a seated figure.">
      <g {...vignetteProps} stroke={GOLD}>
        <path d="M70 40 C 62 28, 44 30, 44 44 C 44 56, 62 64, 70 72 C 78 64, 96 56, 96 44 C 96 30, 78 28, 70 40 Z" />
        <path d="M70 42 L70 56 M63 49 L77 49" stroke={GREEN} />
      </g>
      <g {...vignetteProps} stroke={GREEN}>
        <circle cx="70" cy="84" r="7" />
        <path d="M56 108 C 58 96, 82 96, 84 108" />
      </g>
      <line x1="16" y1="108" x2="124" y2="108" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StreetCleanup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} role="img" aria-label="Volunteers clearing a shared neighbourhood space.">
      <g {...vignetteProps} stroke={GOLD}>
        <circle cx="46" cy="30" r="9" />
        <path d="M46 39 L46 70 M46 70 L38 96 M46 70 L54 96" />
        <path d="M46 50 L70 42" />
        <path d="M70 42 L70 30" stroke={GREEN} />
      </g>
      <g {...vignetteProps} stroke={GREEN}>
        <path d="M88 96 L92 62 L118 62 L114 96 Z" />
        <path d="M86 62 L120 62" />
        <path d="M99 54 L107 54" />
      </g>
      <line x1="16" y1="96" x2="124" y2="96" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CommunityOutreach({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} role="img" aria-label="Volunteers running a community drive from a shared table.">
      <g {...vignetteProps} stroke={GOLD}>
        <circle cx="40" cy="34" r="8" />
        <path d="M40 42 L40 66" />
        <path d="M40 50 L58 56" />
      </g>
      <g {...vignetteProps} stroke={GREEN}>
        <circle cx="100" cy="34" r="8" />
        <path d="M100 42 L100 66" />
        <path d="M100 50 L82 56" />
      </g>
      <g {...vignetteProps} stroke={GOLD}>
        <path d="M26 72 L114 72" />
        <path d="M36 72 L36 96 M104 72 L104 96" />
        <rect x="56" y="60" width="12" height="12" stroke={GREEN} />
        <rect x="72" y="60" width="12" height="12" stroke={GREEN} />
      </g>
      <line x1="16" y1="96" x2="124" y2="96" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Venue section — an abstract Gaborone skyline. Deliberately generic
 * varied-height forms: no real building is depicted or implied.
 */
export function GaboroneSkyline({ className }: { className?: string }) {
  const bars = [
    { x: 10, w: 34, h: 62 }, { x: 48, w: 26, h: 96 }, { x: 78, w: 40, h: 74 },
    { x: 122, w: 24, h: 116 }, { x: 150, w: 36, h: 88 }, { x: 190, w: 28, h: 132 },
    { x: 222, w: 44, h: 70 }, { x: 270, w: 26, h: 104 }, { x: 300, w: 38, h: 82 },
    { x: 342, w: 24, h: 120 }, { x: 370, w: 40, h: 66 }, { x: 414, w: 30, h: 94 },
    { x: 448, w: 36, h: 76 },
  ];
  const baseline = 168;

  return (
    <svg viewBox="0 0 500 200" className={className} role="img" aria-label="An abstract skyline silhouette representing Gaborone, with Kgale Hill behind it.">
      {/* Kgale Hill, behind the city */}
      <path d="M 0 168 L 96 96 L 168 138 L 236 84 L 330 168 Z" fill={DEEP} opacity="0.14" />
      <path d="M 250 168 L 356 78 L 440 132 L 500 100 L 500 168 Z" fill={DEEP} opacity="0.1" />

      {bars.map((b, i) => (
        <g key={b.x}>
          <rect x={b.x} y={baseline - b.h} width={b.w} height={b.h} fill={i % 3 === 0 ? DEEP : GREEN} opacity={i % 2 ? 0.82 : 0.66} />
          {/* window band */}
          <rect x={b.x + 6} y={baseline - b.h + 12} width={b.w - 12} height="3" fill={GOLD} opacity="0.5" />
          <rect x={b.x + 6} y={baseline - b.h + 26} width={b.w - 12} height="3" fill={GOLD} opacity="0.32" />
        </g>
      ))}

      {/* the Notwane, as a single line */}
      <path d="M 0 182 C 120 174, 200 192, 320 182 S 460 172, 500 180" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
      <line x1="0" y1={baseline} x2="500" y2={baseline} stroke={DEEP} strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export const ACTION_VIGNETTES = {
  tree: TreePlanting,
  mentorship: YouthMentorship,
  health: HealthOutreach,
  cleanup: StreetCleanup,
  outreach: CommunityOutreach,
} as const;
