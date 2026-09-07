import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { rsvpSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to be signed in to build a schedule." }, { status: 401 });
  }

  const limited = rateLimit(`rsvp:${session.user.id}:${clientIp(request.headers)}`, {
    limit: 40,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many changes at once. Try again in ${limited.retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "That request wasn't valid." }, { status: 400 });
  }

  const { sessionId, action } = parsed.data;
  const userId = session.user.id;

  if (action === "remove") {
    await prisma.sessionRSVP.deleteMany({ where: { userId, sessionId } });
    return NextResponse.json({ ok: true, rsvped: false });
  }

  const conferenceSession = await prisma.conferenceSession.findUnique({
    where: { id: sessionId },
    select: { capacity: true },
  });
  if (!conferenceSession) {
    return NextResponse.json({ error: "That session no longer exists." }, { status: 404 });
  }

  try {
    // Capacity is checked inside a transaction and the row is re-counted there,
    // so two delegates racing for the last seat cannot both be admitted.
    await prisma.$transaction(async (tx) => {
      if (conferenceSession.capacity !== null) {
        const taken = await tx.sessionRSVP.count({ where: { sessionId } });
        if (taken >= conferenceSession.capacity) {
          throw new Error("SESSION_FULL");
        }
      }
      await tx.sessionRSVP.create({ data: { userId, sessionId } });
    });
  } catch (err) {
    if (err instanceof Error && err.message === "SESSION_FULL") {
      return NextResponse.json({ error: "That session is now fully booked." }, { status: 409 });
    }
    // Unique constraint: the delegate already holds a seat, which is a no-op.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ ok: true, rsvped: true });
    }
    console.error("RSVP failed:", err);
    return NextResponse.json({ error: "Could not update your schedule." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rsvped: true });
}
