import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Live RSVP counts, polled by the public schedule grid. */
export async function GET() {
  const sessions = await prisma.conferenceSession.findMany({
    select: { id: true, _count: { select: { rsvps: true } } },
  });

  return NextResponse.json(
    sessions.map((s) => ({ id: s.id, rsvpCount: s._count.rsvps })),
    { headers: { "Cache-Control": "no-store" } },
  );
}
