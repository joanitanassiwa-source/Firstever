"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { speakerSchema, conferenceSessionSchema, siteContentSchema } from "@/lib/validation";

export type AdminState = { ok: boolean; message?: string };

/**
 * Every action re-checks the role server-side. Hiding the nav link is not a
 * security control; this is.
 */
async function gate(): Promise<AdminState | null> {
  const admin = await requireAdmin();
  return admin ? null : { ok: false, message: "Not authorised." };
}

/** Public pages are force-dynamic, but revalidate anyway so any cached
 *  segment picks up admin edits without a redeploy. */
function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/dashboard");
}

// ---------- Speakers ----------

export async function saveSpeaker(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;

  const id = formData.get("id");
  const parsed = speakerSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    bio: formData.get("bio"),
    avatarColor: formData.get("avatarColor"),
    initials: formData.get("initials"),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  if (typeof id === "string" && id) {
    await prisma.speaker.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.speaker.create({ data: parsed.data });
  }

  revalidatePath("/admin/speakers");
  refreshPublic();
  return { ok: true, message: id ? "Speaker updated." : "Speaker added." };
}

export async function deleteSpeaker(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { ok: false, message: "Missing speaker." };

  await prisma.speaker.delete({ where: { id } });
  revalidatePath("/admin/speakers");
  refreshPublic();
  return { ok: true, message: "Speaker deleted." };
}

// ---------- Conference sessions ----------

export async function saveSession(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;

  const id = formData.get("id");
  const parsed = conferenceSessionSchema.safeParse({
    day: formData.get("day"),
    time: formData.get("time"),
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    capacity: formData.get("capacity"),
    order: formData.get("order"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { capacity, ...rest } = parsed.data;

  if (typeof id === "string" && id) {
    // Lowering capacity below the seats already taken would silently
    // over-book the room, so refuse it and say by how much.
    if (capacity !== null) {
      const taken = await prisma.sessionRSVP.count({ where: { sessionId: id } });
      if (capacity < taken) {
        return { ok: false, message: `${taken} delegates have already booked this session. Capacity cannot be set below ${taken}.` };
      }
    }
    await prisma.conferenceSession.update({ where: { id }, data: { ...rest, capacity } });
  } else {
    await prisma.conferenceSession.create({ data: { ...rest, capacity } });
  }

  revalidatePath("/admin/sessions");
  refreshPublic();
  return { ok: true, message: id ? "Session updated." : "Session added." };
}

export async function deleteSession(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { ok: false, message: "Missing session." };

  // RSVPs cascade on delete (see schema), so delegates' schedules stay consistent.
  await prisma.conferenceSession.delete({ where: { id } });
  revalidatePath("/admin/sessions");
  refreshPublic();
  return { ok: true, message: "Session deleted." };
}

// ---------- Site content ----------

export async function saveContent(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;

  const parsed = siteContentSchema.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });
  if (!parsed.success) return { ok: false, message: "Please check the form." };

  const existing = await prisma.siteContent.findUnique({ where: { key: parsed.data.key } });
  if (!existing) return { ok: false, message: "Unknown content key." };

  await prisma.siteContent.update({
    where: { key: parsed.data.key },
    data: { value: parsed.data.value },
  });

  revalidatePath("/admin/content");
  refreshPublic();
  return { ok: true, message: "Saved. The public site now shows this copy." };
}
