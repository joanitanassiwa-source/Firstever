import { prisma } from "@/lib/prisma";
import { SessionAdmin } from "./SessionAdmin";

export default async function SessionsAdminPage() {
  const sessions = await prisma.conferenceSession.findMany({
    orderBy: [{ day: "asc" }, { order: "asc" }],
    include: { _count: { select: { rsvps: true } } },
  });

  return (
    <>
      <div className="dash__head">
        <p className="dash__eyebrow">Admin</p>
        <h1 className="dash__h1">Sessions.</h1>
        <p className="dash__lede">
          The conference programme. Setting a capacity turns on remaining-spots display and RSVP limits
          on the public schedule.
        </p>
      </div>
      <SessionAdmin
        sessions={sessions.map((s) => ({
          id: s.id, day: s.day, time: s.time, title: s.title, description: s.description,
          type: s.type, capacity: s.capacity, order: s.order, rsvpCount: s._count.rsvps,
        }))}
      />
    </>
  );
}
