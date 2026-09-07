import { prisma } from "@/lib/prisma";
import { CATEGORIES, CATEGORY_LABEL, DAY_LABEL } from "@/lib/categories";

export default async function AdminOverview() {
  const [delegateCount, speakerCount, sessionCount, rsvpCount, byCategory, sessions] = await Promise.all([
    prisma.user.count({ where: { role: "delegate" } }),
    prisma.speaker.count(),
    prisma.conferenceSession.count(),
    prisma.sessionRSVP.count(),
    prisma.user.groupBy({ by: ["registrationCategory"], where: { role: "delegate" }, _count: true }),
    prisma.conferenceSession.findMany({
      orderBy: [{ day: "asc" }, { order: "asc" }],
      include: { _count: { select: { rsvps: true } } },
    }),
  ]);

  const counts = new Map(byCategory.map((r) => [r.registrationCategory, r._count]));
  const maxCat = Math.max(1, ...byCategory.map((r) => r._count));
  const maxRsvp = Math.max(1, ...sessions.map((s) => s._count.rsvps));

  return (
    <>
      <div className="dash__head">
        <p className="dash__eyebrow">Admin</p>
        <h1 className="dash__h1">Overview.</h1>
        <p className="dash__lede">Live figures straight from the database. Everything here updates as delegates register and RSVP.</p>
      </div>

      <div className="astat-grid">
        <div className="astat"><span className="astat__value">{delegateCount}</span><span className="astat__label">Registered delegates</span></div>
        <div className="astat"><span className="astat__value">{rsvpCount}</span><span className="astat__label">Session RSVPs</span></div>
        <div className="astat"><span className="astat__value">{sessionCount}</span><span className="astat__label">Programme sessions</span></div>
        <div className="astat"><span className="astat__value">{speakerCount}</span><span className="astat__label">Speakers listed</span></div>
      </div>

      <section className="panel" style={{ marginTop: 24 }} aria-labelledby="cat-title">
        <h2 className="panel__title" id="cat-title">Registrations by category</h2>
        {delegateCount === 0 ? (
          <p className="dash__empty">No delegates have registered yet.</p>
        ) : (
          CATEGORIES.map((c) => {
            const n = counts.get(c.value) ?? 0;
            return (
              <div className="abar" key={c.value}>
                <span className="abar__label">{c.label}</span>
                <span className="abar__track"><span className="abar__fill" style={{ width: `${(n / maxCat) * 100}%` }} /></span>
                <span className="abar__num">{n}</span>
              </div>
            );
          })
        )}
      </section>

      <section className="panel" style={{ marginTop: 24 }} aria-labelledby="rsvp-title">
        <h2 className="panel__title" id="rsvp-title">RSVPs per session</h2>
        {sessions.map((s) => (
          <div className="abar" key={s.id}>
            <span className="abar__label" title={s.title}>
              <strong style={{ color: "var(--au-gold)" }}>{DAY_LABEL[s.day]}</strong>{" "}
              {s.title.length > 42 ? `${s.title.slice(0, 42)}…` : s.title}
            </span>
            <span className="abar__track"><span className="abar__fill" style={{ width: `${(s._count.rsvps / maxRsvp) * 100}%` }} /></span>
            <span className="abar__num">{s._count.rsvps}{s.capacity ? `/${s.capacity}` : ""}</span>
          </div>
        ))}
      </section>
    </>
  );
}
