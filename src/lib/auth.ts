import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { prisma } from "./prisma";
import { magicLinkEmail, sendMail } from "./email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // The email provider requires database sessions; it has no JWT equivalent.
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login",
  },
  providers: [
    Nodemailer({
      // Unused: sendVerificationRequest below owns delivery entirely, so the
      // dev console fallback works with no SMTP configured.
      server: process.env.EMAIL_SERVER || { host: "localhost", port: 587 },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        // A user who has never verified is completing their registration, so
        // they get the "you're registered" framing rather than a bare sign-in.
        const user = await prisma.user.findUnique({
          where: { email: identifier },
          select: { emailVerified: true },
        });
        const isNewRegistration = !user?.emailVerified;
        const { html, text, subject } = magicLinkEmail({ url, isNewRegistration });
        await sendMail({ to: identifier, subject, html, text });
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role: Role }).role;
      }
      return session;
    },
  },
});

/** Throws-free helper: the current user row, or null. */
export async function currentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

/** Server-side admin gate. Returns null when the caller is not an admin. */
export async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
