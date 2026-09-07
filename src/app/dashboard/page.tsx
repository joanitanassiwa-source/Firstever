import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORY_LABEL, DAY_LABEL, DAY_DATE, SESSION_TYPE_LABEL } from "@/lib/categories";
import { DashboardBar } from "@/components/DashboardBar";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import "@/components/dashboard.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "My dashboard — Africa Volunteering Conference 2026" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      rsvps: {
        include: { session: true },
        orderBy: { session: { day: "asc" } },
      },
    },
  });
  if (!user) redirect("/login");

  const allSessions = await prisma.conferenceSession.findMany({
    orderBy: [{ day: "asc" }, { order: "asc" }],
    include: { _count: { select: { rsvps: true } } },
  });

  const mine = new Set(user.rsvps.map((r) => r.sessionId));

  // Group the delegate's own sessions by conference day.
  const byDay = new Map<number, typeof user.rsvps>();
  for (const r of [...user.rsvps].sort((a, b) => a.session.day - b.session.day || a.session.time.localeCompare(b.session.time))) {
    const list = byDay.get(r.session.day) ?? [];
    list.push(r);
    byDay.set(r.session.day, list);
  }

  const browseItems = allSessions.map((s) => ({
    id: s.id, day: s.day, time: s.time, title: s.title, description: s.description,
    type: s.type, capacity: s.capacity, rsvpCount: s._count.rsvps, isRsvped: mine.has(s.id),
  }));

  const memberSince = user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="dash">
      <DashboardBar label="Delegate dashboard" isAdmin={user.role === "admin"} />
      <main id="main" className="dash__main">
        <div className="dash__head">
          <p className="dash__eyebrow">Africa Volunteering Conference 2026</p>
          <h1 className="dash__h1">Welcome, {user.name?.split(" ")[0] ?? "delegate"}.</h1>
          <p className="dash__lede">
            Gaborone, Botswana · 10–14 November 2026. Build your personal schedule below — it's saved
            to your account and you can change it any time before the conference.
          </p>
        </div>

        <div className="dash__cols">
          <section className="panel" aria-labelledby="reg-title">
            <h2 className="panel__title" id="reg-title">Your registration</h2>
            <div className="deets">
              <div className="deets__row"><span className="deets__key">Name</span><span className="deets__val">{user.name ?? "—"}</span></div>
              <div className="deets__row"><span className="deets__key">Email</span><span className="deets__val">{user.email}</span></div>
              <div className="deets__row"><span className="deets__key">Organization</span><span className="deets__val">{user.organization ?? "—"}</span></div>
              <div className="deets__row"><span className="deets__key">Category</span><span className="deets__val">{CATEGORY_LABEL[user.registrationCategory]}</span></div>
              <div className="deets__row"><span className="deets__key">Member since</span><span className="deets__val">{memberSince}</span></div>
              <div className="deets__row"><span className="deets__key">Sessions booked</span><span className="deets__val">{user.rsvps.length}</span></div>
            </div>
          </section>

          <section className="panel" aria-labelledby="sched-title">
            <h2 className="panel__title" id="sched-title">My schedule</h2>
            {byDay.size === 0 ? (
              <p className="dash__empty">
                You haven't added any sessions yet. Browse the programme below and add the ones you'd like to attend.
              </p>
            ) : (
              [...byDay.entries()].map(([day, items]) => (
                <div key={day} className="myday">
                  <p className="myday__label">
                    {DAY_LABEL[day]}<span className="myday__date">{DAY_DATE[day]}</span>
                  </p>
                  {items.map((r) => (
                    <div key={r.id} className="myitem">
                      <span className="myitem__time">{r.session.time}</span>
                      <span>
                        <span className="myitem__title">{r.session.title}</span>
                        <span className="myitem__type" style={{ display: "block" }}>{SESSION_TYPE_LABEL[r.session.type]}</span>
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </section>
        </div>

        <section className="panel" style={{ marginTop: 24 }} aria-labelledby="browse-title">
          <h2 className="panel__title" id="browse-title">Browse the programme</h2>
          <ScheduleGrid sessions={browseItems} isLoggedIn variant="compact" />
        </section>
      </main>
    </div>
  );
}
