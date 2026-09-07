import Link from "next/link";
import { AULogo } from "./Logo";
import { SignOutButton } from "./SignOutButton";
import "./dashboard.css";

export function DashboardBar({ label, isAdmin }: { label: string; isAdmin: boolean }) {
  return (
    <header className="dash__bar">
      <div className="dash__bar-inner">
        <Link href="/" style={{ textDecoration: "none" }} aria-label="Back to the public site">
          <AULogo variant="light" />
        </Link>
        <span style={{ width: 1, height: 28, background: "var(--line-dark)" }} aria-hidden="true" />
        <span className="dash__title">{label}</span>
        <div className="dash__bar-actions">
          <Link href="/" className="dash__bar-link">Public site</Link>
          {isAdmin && <Link href="/admin" className="dash__bar-link">Admin</Link>}
          <Link href="/dashboard" className="dash__bar-link">My dashboard</Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
