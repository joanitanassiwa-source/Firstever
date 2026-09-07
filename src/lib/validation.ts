import { z } from "zod";
import { RegistrationCategory, SessionType } from "@prisma/client";

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(200),
  organization: z.string().trim().min(2, "Please enter your organization").max(200),
  registrationCategory: z.nativeEnum(RegistrationCategory, {
    errorMap: () => ({ message: "Please choose a registration category" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(200),
});

export const rsvpSchema = z.object({
  sessionId: z.string().min(1),
  action: z.enum(["add", "remove"]),
});

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour, e.g. #B4A269");

export const speakerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  bio: z.string().trim().min(10).max(2000),
  avatarColor: hexColor,
  initials: z.string().trim().min(1).max(3),
  order: z.coerce.number().int().min(0).max(999),
});

export const conferenceSessionSchema = z.object({
  day: z.coerce.number().int().min(0).max(4),
  time: z.string().trim().min(1).max(60),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(3).max(2000),
  type: z.nativeEnum(SessionType),
  capacity: z
    .union([z.coerce.number().int().min(1).max(100000), z.literal("")])
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  order: z.coerce.number().int().min(0).max(999),
});

export const siteContentSchema = z.object({
  key: z.string().trim().min(1).max(120),
  value: z.string().max(5000),
});
