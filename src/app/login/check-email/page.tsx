import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Check your email — Africa Volunteering Conference 2026" };

export default function CheckEmailPage() {
  return (
    <>
      <Nav />
      <main id="main" className="section section--dark" style={{ minHeight: "70vh" }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <div className="form-confirm">
            <span className="dot-ring" aria-hidden="true" />
            <h1 className="form-confirm__title">Check your email.</h1>
            <p className="form-confirm__body">
              A secure sign-in link is on its way. Open it on this device to reach your delegate dashboard.
            </p>
            <p className="form-confirm__note">
              The link expires in 24 hours and can only be used once.{" "}
              <Link href="/login" style={{ color: "var(--au-gold-text)" }}>Request another</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
