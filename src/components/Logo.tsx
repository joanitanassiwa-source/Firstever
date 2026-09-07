/* =========================================================================
   PLACEHOLDER LOCKUP — swap before production.

   The AU brand guide specifies these official assets:
     white / reversed lockup (dark grounds):
       https://au.int/sites/default/files/auweblogo-w-en.png
     full-colour emblem (light grounds only — has a white background baked in):
       https://au.int/sites/default/files/pages/31823-img-au_logo.jpg

   They are intentionally NOT hotlinked here. Hotlinking au.int makes the site
   depend on a third-party origin that can rate-limit, move or block the asset,
   and it was unreachable from the build environment. This local placeholder is
   a neutral ring mark in the brand palette — it does not reproduce the AU
   emblem. Production must replace this component with the official files once
   AU comms supplies them, served from /public.
   ========================================================================= */

export function AULogo({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  // "light" = light ink for dark backgrounds; "dark" = dark ink for light ones.
  const ink = variant === "light" ? "#F5F6F4" : "#1A5632";
  const accent = "#B4A269";

  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke={accent} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="12.5" fill="none" stroke={ink} strokeWidth="1.4" opacity="0.75" />
        <circle cx="20" cy="20" r="5" fill={accent} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={20 + Math.cos(a) * 15.5}
              cy={20 + Math.sin(a) * 15.5}
              r="2.1"
              fill={ink}
              opacity="0.9"
            />
          );
        })}
      </svg>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span
          style={{
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: "0.04em",
            color: ink,
          }}
        >
          AFRICAN UNION
        </span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: accent, textTransform: "uppercase" }}>
          Placeholder mark
        </span>
      </span>
    </span>
  );
}
