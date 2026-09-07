"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registrationSchema, loginSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  email?: string;
};

/**
 * Public registration. Creates the delegate if the email is new, then sends a
 * magic link either way — an existing email gets a fresh sign-in link rather
 * than an error, so the form can never be used to probe who is registered.
 */
export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  const limited = rateLimit(`register:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limited.ok) {
    return { ok: false, message: `Too many attempts. Please try again in ${limited.retryAfter} seconds.` };
  }

  const parsed = registrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    registrationCategory: formData.get("registrationCategory"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const { name, email, organization, registrationCategory } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: { name, email, organization, registrationCategory, role: "delegate" },
    });
  } else {
    // Refresh their details from this submission, but never change their role.
    await prisma.user.update({
      where: { email },
      data: { name, organization, registrationCategory },
    });
  }

  try {
    await signIn("nodemailer", { email, redirect: false });
  } catch (err) {
    console.error("Magic link send failed:", err);
    return {
      ok: false,
      message: "We saved your registration but couldn't send the confirmation email. Please try logging in shortly.",
    };
  }

  return { ok: true, email };
}

/** Returning-delegate sign-in. Sends a magic link to any address given. */
export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  const limited = rateLimit(`login:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limited.ok) {
    return { ok: false, message: `Too many attempts. Please try again in ${limited.retryAfter} seconds.` };
  }

  const parsed = loginSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please enter a valid email address." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success: revealing whether an address is registered would
  // turn this form into an account-enumeration oracle.
  if (!user) return { ok: true, email };

  try {
    await signIn("nodemailer", { email, redirect: false });
  } catch (err) {
    console.error("Magic link send failed:", err);
    return { ok: false, message: "We couldn't send your sign-in link. Please try again shortly." };
  }

  return { ok: true, email };
}
