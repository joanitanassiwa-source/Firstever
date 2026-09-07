import { cache } from "react";
import { prisma } from "./prisma";

/**
 * Loads every editable copy block in one query and returns a lookup helper.
 * Wrapped in React.cache so a single render reuses one round-trip across all
 * the server components that need copy.
 */
export const getContent = cache(async () => {
  const rows = await prisma.siteContent.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return (key: string, fallback = "") => map.get(key) ?? fallback;
});

export type ContentFn = Awaited<ReturnType<typeof getContent>>;
