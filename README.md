# Africa Volunteering Conference 2026

Full-stack site for the inaugural continental conference on volunteerism, convened by the
African Union's Continental Volunteer Linkage Platform (AUCVLP).
**10–14 November 2026 · Gaborone, Botswana.**

Public marketing site, delegate accounts with a personal schedule, and an admin dashboard for
the AU comms/events team — all content served from the database, editable without a redeploy.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript) |
| Database | PostgreSQL via Prisma 6 |
| Auth | Auth.js v5 (NextAuth), passwordless email magic links |
| Email | Any SMTP provider (Resend, Postmark, SendGrid, Mailgun) via nodemailer |
| Styling | Plain CSS with custom properties — no CSS framework, no web fonts |

## Getting started

```bash
npm install
cp .env.example .env          # then fill in DATABASE_URL and AUTH_SECRET
npx prisma db push            # create the schema
npm run db:seed               # load the conference content
npm run dev                   # http://localhost:3000
```

Requires PostgreSQL 14+. `AUTH_SECRET` can be generated with `openssl rand -base64 32`.

### Signing in during development

With `EMAIL_SERVER` unset, magic-link emails are **printed to the server console** instead of
being sent, so the whole sign-in flow works without SMTP credentials. Register on the public
form, then copy the link from the terminal.

The seed creates one admin: **`admin@volunteer.africa`**. Sign in as that address via `/login`
to reach `/admin`. Change it before deploying anywhere real.

To send real email, set `EMAIL_SERVER` to an SMTP URL, e.g.
`smtp://resend:re_xxxxxxxx@smtp.resend.com:587`.

> Note: don't run `npm run build` while `npm run dev` is running — they share `.next` and the
> build will break the running dev server. Stop dev first.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | Seed speakers, sessions and copy blocks |
| `npm run db:reset` | Drop, recreate and re-seed (destructive) |

## Data model

- **User** — delegate *and* admin accounts, separated by `role` (`delegate` \| `admin`).
- **ConferenceSession** — the programme. Named to avoid colliding with Auth.js's `Session`
  (browser session) table.
- **SessionRSVP** — join table; powers "My Schedule" and live remaining capacity.
  Unique on `(userId, sessionId)`.
- **Speaker** — placeholder lineup with `avatarColor` + `initials` (no photography).
- **SiteContent** — key/value copy blocks the admin can edit. Only content that plausibly
  changes before or during the event; nav and footer boilerplate stay in code.

Seeding is idempotent and **preserves admin edits** to `SiteContent` on re-run.

## Live data

Nothing on the public site is a hardcoded number:

- The About stat is a real `COUNT` of delegates, shown against the 400+ goal.
- Session capacity shows remaining spots from live `SessionRSVP` counts, and the public grid
  re-polls every 30s.
- Capacity is enforced **inside a transaction** on the server, so two delegates racing for the
  last seat cannot both be admitted. The disabled button is a convenience, not the control.

## Security notes

- No secrets in the repo; everything is env-driven. `.env` is gitignored.
- All input is validated server-side with Zod, in addition to client-side validation.
- Registration and login are rate-limited per IP; RSVP per user.
  The limiter is **in-memory** — on multi-instance hosting (Vercel included) swap
  `src/lib/rate-limit.ts` for a shared store such as Upstash Redis.
- `/admin` is gated in the layout *and* re-checked inside every admin server action.
  Hiding the nav link is not a security control.
- The login form never reveals whether an address is registered.

## Brand system

African Union brand colours as CSS custom properties in `src/app/globals.css`. **Arial only** —
Univers is print-only and licensed, so the AU digital guide mandates Arial for all web text.
No Google Fonts, no stock photography.

Two derived tints are defined for contrast reasons and are documented in the CSS: brand gold on
corporate green is 3.4:1, fine for large text and borders but short of AA for body copy, so a
lighter gold is used for small text on dark grounds.

Every illustration is original inline SVG built on the kgotla circle motif — the Ubuntu hero
circle, the crowd strip, five volunteering vignettes and the Gaborone skyline.

## Before production

- [ ] **Replace the placeholder logo.** `src/components/Logo.tsx` draws a neutral ring mark, not
      the AU emblem. Swap in the official files from AU comms, served from `/public`.
- [ ] **Replace the speaker lineup.** The nine seeded speakers are illustrative; edit them in
      `/admin/speakers` once names are confirmed.
- [ ] Change the seeded admin email and add the real AUCVLP administrators.
- [ ] Set `EMAIL_SERVER` and verify deliverability (SPF/DKIM on the sending domain).
- [ ] Move rate limiting to a shared store.
- [ ] Replace `prisma db push` with proper migrations (`prisma migrate`).
