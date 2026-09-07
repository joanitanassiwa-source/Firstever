import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Log in — Africa Volunteering Conference 2026" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const { error } = await searchParams;

  return (
    <>
      <Nav />
      <main id="main" className="section section--dark" style={{ minHeight: "70vh" }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <p className="eyebrow">Delegate access</p>
          <h1 className="h-section" style={{ marginBottom: 18 }}>Log in.</h1>
          <p className="sub" style={{ marginBottom: 34 }}>
            We'll email you a secure sign-in link — no password to remember. Not registered yet?{" "}
            <Link href="/#register" style={{ color: "var(--au-gold-text)" }}>Register your interest</Link>.
          </p>
          {error && (
            <p className="form__error" role="alert">
              That sign-in link was invalid or has expired. Please request a new one below.
            </p>
          )}
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
