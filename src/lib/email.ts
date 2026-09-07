import { createTransport } from "nodemailer";

const BRAND = {
  green: "#1A5632",
  gold: "#B4A269",
  offWhite: "#F5F6F4",
  greyText: "#58595B",
};

/**
 * Branded magic-link email. Doubles as the registration confirmation: a
 * delegate signing up for the first time gets the "you're registered" framing,
 * a returning delegate gets the plain sign-in framing.
 */
export function magicLinkEmail({ url, isNewRegistration }: { url: string; isNewRegistration: boolean }) {
  const heading = isNewRegistration ? "You're registered." : "Sign in to your dashboard";
  const intro = isNewRegistration
    ? "Thank you for registering for the Africa Volunteering Conference 2026 in Gaborone, Botswana. Your place is confirmed."
    : "Use the button below to sign in to your Africa Volunteering Conference dashboard.";
  const cta = isNewRegistration ? "Access your dashboard" : "Sign in";

  const text = [
    heading,
    "",
    intro,
    "",
    `${cta}: ${url}`,
    "",
    "This link can only be used once and expires in 24 hours.",
    "",
    "Africa Volunteering Conference 2026",
    "10–14 November 2026 · Gaborone, Botswana",
    "Convened under the AU Continental Volunteer Linkage Platform.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:${BRAND.offWhite};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.offWhite};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E1E3DF;">
        <tr><td style="background:${BRAND.green};padding:28px 32px;">
          <div style="color:${BRAND.gold};font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Africa Volunteering Conference 2026</div>
          <div style="color:${BRAND.offWhite};font-family:'Arial Black',Arial,sans-serif;font-weight:900;font-size:22px;line-height:1.25;margin-top:10px;">${heading}</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;color:${BRAND.greyText};font-size:15px;line-height:1.65;">${intro}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${BRAND.gold};">
            <a href="${url}" style="display:inline-block;padding:14px 28px;color:#0F3320;font-weight:bold;font-size:14px;text-decoration:none;letter-spacing:.02em;">${cta}</a>
          </td></tr></table>
          <p style="margin:24px 0 0;color:${BRAND.greyText};font-size:13px;line-height:1.6;">
            This link can only be used once and expires in 24 hours. If the button doesn't work, paste this into your browser:<br>
            <span style="color:${BRAND.green};word-break:break-all;">${url}</span>
          </p>
        </td></tr>
        <tr><td style="border-top:1px solid #E1E3DF;padding:20px 32px;color:${BRAND.greyText};font-size:12px;line-height:1.6;">
          10–14 November 2026 · Gaborone, Botswana<br>
          Convened under the AU Continental Volunteer Linkage Platform.<br>
          <span style="color:#8A8B8C;">If you didn't request this, you can safely ignore this email.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { html, text, subject: isNewRegistration ? "You're registered — Africa Volunteering Conference 2026" : "Sign in — Africa Volunteering Conference 2026" };
}

/**
 * Sends mail via SMTP when EMAIL_SERVER is configured. With no SMTP
 * configured (local development) the message is logged to the server console
 * instead, so the whole magic-link flow stays testable without credentials.
 */
export async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const server = process.env.EMAIL_SERVER;
  const from = process.env.EMAIL_FROM ?? "no-reply@volunteer.africa";

  if (!server) {
    console.log(
      [
        "",
        "──────────────────────────────────────────────────────────────",
        " EMAIL_SERVER is not set — email logged instead of sent.",
        ` To:      ${opts.to}`,
        ` Subject: ${opts.subject}`,
        "",
        opts.text,
        "──────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  const transport = createTransport(server);
  const result = await transport.sendMail({ to: opts.to, from, subject: opts.subject, html: opts.html, text: opts.text });
  const failed = [...(result.rejected ?? []), ...(result.pending ?? [])].filter(Boolean);
  if (failed.length) throw new Error(`Email (${failed.join(", ")}) could not be sent`);
}
