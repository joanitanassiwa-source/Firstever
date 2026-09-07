import Link from "next/link";
import { auth } from "@/lib/auth";
import { AULogo } from "./Logo";
import "./nav.css";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#speakers", label: "Speakers" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#attends", label: "Who Attends" },
  { href: "/#declaration", label: "Declaration" },
  { href: "/#venue", label: "Venue" },
];

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__brand" aria-label="Africa Volunteering Conference 2026 — home">
          <AULogo variant="light" />
          <span className="nav__divider" aria-hidden="true" />
          <span className="nav__wordmark">
            Africa Volunteering<br />Conference
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav__link">{l.label}</Link>
          ))}
        </nav>

        <div className="nav__actions">
          {user ? (
            <Link href="/dashboard" className="nav__link nav__link--account">
              {user.name?.split(" ")[0] ?? "My dashboard"}
            </Link>
          ) : (
            <Link href="/login" className="nav__link">Log in</Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="nav__link">Admin</Link>
          )}
          <Link href="/#register" className="btn btn--gold btn--sm">Register</Link>
        </div>
      </div>
    </header>
  );
}
