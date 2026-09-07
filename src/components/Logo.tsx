import fs from "node:fs";
import path from "node:path";

/* =========================================================================
   AU lockup.

   Drop the official file at  public/au-logo.png  and it is used everywhere
   automatically. Until then a neutral placeholder ring mark renders instead —
   it deliberately does NOT reproduce the AU emblem.

   Contrast note: the official lockup is a dark maroon wordmark with a gold
   emblem and green laurel on a white ground. Placed straight onto the
   corporate-green sections the maroon type all but disappears, so on dark
   surfaces it is set in a white card — which is what the AU digital guide
   asks for with the full-colour emblem anyway.
   ========================================================================= */

const LOGO_FILE = "au-logo.png";

// Resolved once per server process rather than per render.
const hasOfficialLogo = (() => {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", LOGO_FILE));
  } catch {
    return false;
  }
})();

function PlaceholderMark({ ink, accent }: { ink: string; accent: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke={accent} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="12.5" fill="none" stroke={ink} strokeWidth="1.4" opacity="0.75" />
        <circle cx="20" cy="20" r="5" fill={accent} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={20 + Math.cos(a) * 15.5} cy={20 + Math.sin(a) * 15.5} r="2.1" fill={ink} opacity="0.9" />;
        })}
      </svg>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: "0.04em", color: ink }}>
          AFRICAN UNION
        </span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: accent, textTransform: "uppercase" }}>
          Placeholder mark
        </span>
      </span>
    </span>
  );
}

export function AULogo({
  variant = "light",
  className,
  height = 30,
}: {
  /** "light" = for dark backgrounds; "dark" = for light backgrounds. */
  variant?: "light" | "dark";
  className?: string;
  height?: number;
}) {
  if (!hasOfficialLogo) {
    return (
      <span className={className}>
        <PlaceholderMark ink={variant === "light" ? "#F5F6F4" : "#1A5632"} accent="#B4A269" />
      </span>
    );
  }

  const img = (
    <img
      src={`/${LOGO_FILE}`}
      alt="African Union"
      style={{ height, width: "auto", display: "block" }}
    />
  );

  // On dark grounds the white-backed lockup needs its own white surface.
  if (variant === "light") {
    return (
      <span className={className} style={{ display: "inline-flex" }}>
        <span style={{ background: "#FFFFFF", padding: "6px 10px", display: "inline-flex", alignItems: "center" }}>
          {img}
        </span>
      </span>
    );
  }

  return <span className={className} style={{ display: "inline-flex" }}>{img}</span>;
}
