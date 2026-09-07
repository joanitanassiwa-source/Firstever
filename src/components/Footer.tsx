import Link from "next/link";
import { AULogo } from "./Logo";
import "./footer.css";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/#about", label: "About" },
      { href: "/#schedule", label: "Schedule" },
      { href: "/#declaration", label: "Declaration" },
      { href: "/#venue", label: "Venue" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/#register", label: "Register" },
      { href: "/#register", label: "Call for speakers" },
      { href: "/#register", label: "Call for exhibitors" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "https://volunteer.africa", label: "volunteer.africa" },
      { href: "mailto:info@volunteer.africa", label: "info@volunteer.africa" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <AULogo variant="light" />
            <p className="footer__title">Africa Volunteering Conference 2026</p>
            <p className="footer__meta">
              Gaborone, Botswana · 10–14 November 2026. Convened under the AU Continental Volunteer Linkage Platform.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="footer__col-title">{col.title}</h3>
              <ul className="footer__list">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link href={l.href} className="footer__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="rule-hair footer__rule" />
        <div className="footer__bottom">
          <span className="footer__hash">#AfricaVolunteers2026</span>
          <span className="footer__note">Draft site — content subject to confirmation by AUCVLP.</span>
        </div>
      </div>
    </footer>
  );
}
