import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Africa Volunteering Conference 2026 — Gaborone, Botswana",
  description:
    "The inaugural continental conference on volunteerism, convened by the African Union's Continental Volunteer Linkage Platform. 10–14 November 2026, Gaborone, Botswana.",
  openGraph: {
    title: "Africa Volunteering Conference 2026",
    description: "The Africa We Want, Built By Volunteers. 10–14 November 2026, Gaborone, Botswana.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
