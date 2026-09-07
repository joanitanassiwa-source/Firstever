# Static assets

## `au-logo.png` — required, not yet supplied

Drop the official African Union lockup here as **`au-logo.png`** and it is picked
up automatically by `src/components/Logo.tsx` — in the nav, footer, dashboard
bars and the "convened by" badge. No code change needed.

Until that file exists, a neutral placeholder ring mark renders instead. The
placeholder deliberately does **not** reproduce the AU emblem.

Notes:

- The full-colour lockup is a dark maroon wordmark on a white ground. On the
  corporate-green surfaces the maroon type is close to invisible, so the
  component sets it in a white card there. On light sections it is placed
  directly. That split is handled by the `variant` prop.
- A transparent PNG is fine; the white card is applied regardless.
- The existence check runs **once per server process**, so restart the dev
  server (or redeploy) after adding the file — a hot reload alone will not
  pick it up.
- If AU comms also supplies the white/reversed lockup, add it as
  `au-logo-reversed.png` and use it in place of the white card on dark
  surfaces — that is the tidier treatment, but it needs the reversed artwork.
