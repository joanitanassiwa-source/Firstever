import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { DashboardBar } from "@/components/DashboardBar";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Africa Volunteering Conference 2026" };

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/speakers", label: "Speakers" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/registrations", label: "Registrations" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gate the whole segment. Every action re-checks independently as well.
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div className="dash">
      <DashboardBar label="Admin — AUCVLP" isAdmin />
      <nav className="admin__tabs" aria-label="Admin sections">
        <div className="admin__tabs-inner">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className="admin__tab">{t.label}</Link>
          ))}
        </div>
      </nav>
      <main id="main" className="dash__main">{children}</main>
    </div>
  );
}
