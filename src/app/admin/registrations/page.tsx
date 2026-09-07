import { prisma } from "@/lib/prisma";
import { CATEGORY_LABEL } from "@/lib/categories";
import { ExportCsvButton } from "./ExportCsvButton";

export default async function RegistrationsPage() {
  const delegates = await prisma.user.findMany({
    where: { role: "delegate" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rsvps: true } } },
  });

  const rows = delegates.map((d) => ({
    name: d.name ?? "",
    email: d.email,
    organization: d.organization ?? "",
    category: CATEGORY_LABEL[d.registrationCategory],
    sessions: d._count.rsvps,
    registered: d.createdAt.toISOString().slice(0, 10),
  }));

  return (
    <>
      <div className="dash__head">
        <p className="dash__eyebrow">Admin</p>
        <h1 className="dash__h1">Registrations.</h1>
        <p className="dash__lede">
          {delegates.length} registered delegate{delegates.length === 1 ? "" : "s"}. This view is read-only —
          delegate records are created by the public registration form.
        </p>
      </div>

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
          <h2 className="panel__title" style={{ margin: 0 }}>All delegates</h2>
          <ExportCsvButton rows={rows} />
        </div>

        {rows.length === 0 ? (
          <p className="dash__empty">No delegates have registered yet.</p>
        ) : (
          <div className="atable__scroll">
            <table className="atable">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Organization</th><th>Category</th><th>Sessions</th><th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.email}>
                    <td className="atable__strong">{r.name || "—"}</td>
                    <td>{r.email}</td>
                    <td>{r.organization || "—"}</td>
                    <td>{r.category}</td>
                    <td>{r.sessions}</td>
                    <td>{r.registered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
