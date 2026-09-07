import { prisma } from "@/lib/prisma";
import { ContentAdmin, type ContentRow } from "./ContentAdmin";

export default async function ContentAdminPage() {
  const rows = await prisma.siteContent.findMany({ orderBy: [{ order: "asc" }] });

  // Preserve first-seen group order rather than sorting alphabetically, so the
  // panel reads top-to-bottom in the same order as the public page.
  const groups: Array<[string, ContentRow[]]> = [];
  for (const r of rows) {
    const entry = groups.find(([g]) => g === r.group);
    const row: ContentRow = { key: r.key, value: r.value, label: r.label, group: r.group, multiline: r.multiline };
    if (entry) entry[1].push(row);
    else groups.push([r.group, [row]]);
  }

  return (
    <>
      <div className="dash__head">
        <p className="dash__eyebrow">Admin</p>
        <h1 className="dash__h1">Site content.</h1>
        <p className="dash__lede">
          The copy blocks that change before or during the event. Saving updates the public site
          immediately — no redeploy. Wrap text in <code>{"{i}…{/i}"}</code> to italicise it.
        </p>
      </div>
      <ContentAdmin groups={groups} />
    </>
  );
}
