# Session handoff — 7 Sept 2026

Working notes for picking this back up. Delete once the project settles.

Branch: `claude/install-ui-ux-pro-max-skill-uixau0` — everything is committed
and pushed. Nothing lives only on a machine.

## Where things stand

Done and verified in a real browser:

- Public site, 14 sections, all content served from Postgres.
- Registration → magic-link email → sign-in → delegate dashboard → RSVP.
- Admin dashboard: speakers, sessions, site copy, registrations + CSV, stats.
- Admin edits reach the public site with no redeploy (tested by editing the
  hero headline and reverting it).
- Capacity enforced in a transaction: over-capacity RSVP returns 409 even when
  POSTed directly past the disabled button. Anonymous returns 401. A delegate
  hitting `/admin` is redirected.
- Production build passes. No horizontal overflow at 375px.

## Picking up next

1. **AU logo — blocked on the file.** The wiring is done: drop the official
   lockup at `public/au-logo.png` and it appears in the nav, footer, dashboard
   bars and partners badge automatically. See `public/README.md`. It was
   attached in chat but chat attachments do not reach the container
   filesystem, so it has to be committed to the repo or fetched from a URL the
   environment can reach.
2. **A second change was queued** and never described — ask what it was.
3. **Suggested content edits**, raised but not applied, since they need AUCVLP
   sign-off:
   - Reference the AU Youth Volunteer Corps (AU-YVC). It is the AU's flagship
     volunteer programme across all 55 member states and currently appears
     nowhere on the site.
   - Attribute AUCVLP to the AU Youth Development and Engagement Division.
   - Make `volunteer.africa` a real outbound link in the footer. It is the
     genuine AU-VLP platform, not a placeholder domain.

## Getting running again from a cold container

```bash
pg_ctlcluster 16 main start
su postgres -c "psql -c \"CREATE ROLE avc WITH LOGIN PASSWORD 'devpassword' CREATEDB;\""
su postgres -c "createdb -O avc avc2026"

npm install
cp .env.example .env        # DATABASE_URL, then AUTH_SECRET=$(openssl rand -base64 32)
npx prisma db push
npm run db:seed
npm run dev
```

The database is not in git. Re-seeding restores all conference content; only
throwaway test registrations are lost, which is fine.

Sign in as **`admin@volunteer.africa`** via `/login` to reach `/admin`. With
`EMAIL_SERVER` unset the magic link is printed to the dev server console
rather than emailed.

Do not run `npm run build` while `npm run dev` is running — they share
`.next` and the build breaks the running dev server.

## Environment constraints hit today

- **Outbound network is allowlisted.** `au.int`, `volunteer.africa` and
  `unbound.hubspot.com` are all blocked by the egress proxy. Web *search*
  works; direct fetching mostly does not. Anything needed from those sites has
  to be pasted in, or the environment's network policy widened.
- **No browser access to the running app.** The dev server is inside the
  container. Review happens by driving headless Chromium here and sending
  screenshots.
- **The 21st.dev MCP server is configured but unauthorised.** `.mcp.json` is
  committed; it needs `/mcp` in an interactive session plus `API_KEY_21ST`.
