import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Countdown } from "@/components/Countdown";
import { SpeakerRail } from "@/components/SpeakerRail";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { RegisterForm } from "@/components/RegisterForm";
import { RichText } from "@/components/RichText";
import { AULogo } from "@/components/Logo";
import {
  UbuntuCircle, CrowdStrip, GaboroneSkyline,
  TreePlanting, YouthMentorship, HealthOutreach, StreetCleanup, CommunityOutreach,
} from "@/components/illustrations";
import "./page.css";

// Copy blocks, speakers and sessions all come from the database so the admin
// dashboard can change them without a redeploy.
export const dynamic = "force-dynamic";

const PILLARS = ["Ubuntu Spirit", "ESG Leadership", "Continental Transformation"];

const ACTIONS = [
  { Art: TreePlanting, title: "Tree planting", body: "Restoring green cover, one community lot at a time." },
  { Art: YouthMentorship, title: "Youth mentorship", body: "Experienced volunteers passing on skills to the next generation." },
  { Art: HealthOutreach, title: "Health outreach", body: "Community health workers reaching households that clinics can't." },
  { Art: StreetCleanup, title: "Street clean-ups", body: "Neighbourhood teams keeping shared spaces liveable." },
  { Art: CommunityOutreach, title: "Community outreach", body: "Volunteers showing up for health drives, food banks and elder care." },
];

const COMMITMENTS = [
  "Enabling frameworks", "Sustainable financing", "Continental coordination",
  "Recognition & protection of volunteers", "Inclusive participation", "Global positioning",
];

const PARTNER_CHIPS = [
  "Volunteer-Involving Organizations", "Civil Society Organizations", "Government institutions",
  "United Nations agencies", "Development partners", "Academia", "Private sector & philanthropy",
];

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [c, speakers, sessions, delegateCount, myRsvps] = await Promise.all([
    getContent(),
    prisma.speaker.findMany({ orderBy: { order: "asc" } }),
    prisma.conferenceSession.findMany({
      orderBy: [{ day: "asc" }, { order: "asc" }],
      include: { _count: { select: { rsvps: true } } },
    }),
    prisma.user.count({ where: { role: "delegate" } }),
    userId
      ? prisma.sessionRSVP.findMany({ where: { userId }, select: { sessionId: true } })
      : Promise.resolve([]),
  ]);

  const mine = new Set(myRsvps.map((r) => r.sessionId));
  const scheduleItems = sessions.map((s) => ({
    id: s.id, day: s.day, time: s.time, title: s.title, description: s.description,
    type: s.type, capacity: s.capacity, rsvpCount: s._count.rsvps, isRsvped: mine.has(s.id),
  }));

  return (
    <>
      <Nav />
      <main id="main">

        {/* ---------- 1. Hero ---------- */}
        <section className="section section--dark hero">
          <div className="glow glow--gold" style={{ width: 520, height: 520, top: -180, left: -140 }} />
          <div className="glow glow--green" style={{ width: 460, height: 460, bottom: -220, right: 60 }} />
          <div className="container hero__inner">
            <div className="hero__text">
              <p className="eyebrow">{c("hero.eyebrow")}</p>
              <h1 className="h-hero">{c("hero.headline")}</h1>
              <p className="lede hero__sub"><RichText text={c("hero.subhead")} /></p>

              <ul className="hero__pillars">
                {PILLARS.map((p) => (
                  <li key={p}><span className="dot-ring" aria-hidden="true" />{p}</li>
                ))}
              </ul>

              <hr className="rule-gold hero__rule" />

              <dl className="hero__meta">
                <div><dt>Dates</dt><dd>{c("hero.meta.dates")}</dd></div>
                <div><dt>Venue</dt><dd>{c("hero.meta.venue")}</dd></div>
                <div><dt>Format</dt><dd>{c("hero.meta.format")}</dd></div>
              </dl>

              <div className="hero__actions">
                <Link href="#register" className="btn btn--gold">Register your interest</Link>
                <Link href="#schedule" className="btn btn--outline">See the schedule</Link>
              </div>

              <Countdown />
            </div>

            <div className="hero__art" aria-hidden="false">
              <UbuntuCircle className="hero__circle" />
            </div>
          </div>
        </section>

        {/* ---------- 2. About ---------- */}
        <section className="section section--light" id="about">
          <div className="container about">
            <div className="about__main">
              <p className="eyebrow">About the conference</p>
              <h2 className="h-section">{c("about.heading")}</h2>
              <div className="about__copy">
                <p><RichText text={c("about.para1")} /></p>
                <p><RichText text={c("about.para2")} /></p>
              </div>
            </div>

            <aside className="about__stats">
              <div className="stat">
                <span className="stat__value">{delegateCount}</span>
                <span className="stat__label">{c("about.stat.registrations.label")}</span>
              </div>
              <hr className="rule-hair" />
              <div className="stat">
                <span className="stat__value">5</span>
                <span className="stat__label">{c("about.stat.days.label")}</span>
              </div>
              <hr className="rule-hair" />
              <div className="stat">
                <span className="stat__value">1</span>
                <span className="stat__label">{c("about.stat.declaration.label")}</span>
              </div>
            </aside>
          </div>
          <div className="container">
            <CrowdStrip className="about__crowd" />
          </div>
        </section>

        {/* ---------- 3. Why 2026 ---------- */}
        <section className="section section--dark" id="why">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Why 2026</p>
              <h2 className="h-section">{c("why.heading")}</h2>
            </div>
            <div className="grid-shared cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="why__item">
                  <span className="why__num">0{n}</span>
                  <h3 className="why__title">{c(`why.item${n}.title`)}</h3>
                  <p className="why__body">{c(`why.item${n}.body`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 4. Speakers ---------- */}
        <section className="section section--dark" id="speakers">
          <div className="glow glow--gold" style={{ width: 420, height: 420, top: -100, right: -80 }} />
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Voices</p>
              <h2 className="h-section">{c("speakers.heading")}</h2>
              <p className="sub">{c("speakers.sub")}</p>
            </div>
            <SpeakerRail speakers={speakers} />
          </div>
        </section>

        {/* ---------- 5. Objectives ---------- */}
        <section className="section section--light" id="objectives">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Objectives</p>
              <h2 className="h-section">{c("objectives.heading")}</h2>
            </div>
            <ol className="objectives">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="objective">
                  <span className="objective__num">{String(n).padStart(2, "0")}</span>
                  <div>
                    <h3 className="objective__title">{c(`objectives.item${n}.title`)}</h3>
                    <p className="objective__body">{c(`objectives.item${n}.body`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- 6. Volunteers in Action ---------- */}
        <section className="section section--offwhite" id="action">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">On the ground</p>
              <h2 className="h-section">{c("action.heading")}</h2>
              <p className="sub">{c("action.sub")}</p>
            </div>
            <div className="grid-shared action__grid">
              {ACTIONS.map(({ Art, title, body }) => (
                <div key={title} className="action__item">
                  <Art className="action__art" />
                  <h3 className="action__title">{title}</h3>
                  <p className="action__body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 7. Schedule ---------- */}
        <section className="section section--dark" id="schedule">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Programme</p>
              <h2 className="h-section">{c("schedule.heading")}</h2>
              <p className="sub">{c("schedule.sub")}</p>
            </div>
            <ScheduleGrid sessions={scheduleItems} isLoggedIn={Boolean(userId)} />
          </div>
        </section>

        {/* ---------- 8. Who Attends ---------- */}
        <section className="section section--light" id="attends">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Participation</p>
              <h2 className="h-section">{c("attends.heading")}</h2>
            </div>
            <div className="grid-shared cols-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="attend">
                  <span className="dot-ring" aria-hidden="true" />
                  <h3 className="attend__title">{cat.label}</h3>
                  <p className="attend__body">{cat.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 9. Declaration ---------- */}
        <section className="section section--dark declaration" id="declaration">
          <div className="container declaration__inner">
            <div>
              <p className="eyebrow declaration__eyebrow">The outcome</p>
              <h2 className="h-section">{c("declaration.heading")}</h2>
              <p className="lede declaration__body">{c("declaration.body")}</p>
              <blockquote className="declaration__quote">
                <p className="italic-quote">{c("declaration.quote")}</p>
              </blockquote>
            </div>
            <div className="declaration__commitments">
              <h3 className="declaration__sub">Six commitments</h3>
              <ul className="ring-list declaration__list">
                {COMMITMENTS.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- 10. Venue ---------- */}
        <section className="section section--light" id="venue">
          <div className="container venue">
            <div className="venue__main">
              <p className="eyebrow">Host city</p>
              <h2 className="h-section">{c("venue.heading")}</h2>
              <p><RichText text={c("venue.para1")} /></p>
              <p><RichText text={c("venue.para2")} /></p>
              <figure className="venue__figure">
                <GaboroneSkyline className="venue__skyline" />
                <figcaption className="venue__caption">{c("venue.caption")}</figcaption>
              </figure>
            </div>
            <aside className="venue__panel">
              <h3 className="venue__panel-title">Practical details</h3>
              <ul className="ring-list venue__list">
                <li>Accommodation options — to be published</li>
                <li>Virtual tour — coming soon</li>
                <li>Cultural evening included in full-week registration</li>
                <li>Visa card &amp; alternative payment methods supported</li>
              </ul>
            </aside>
          </div>
        </section>

        {/* ---------- 11. Partners ---------- */}
        <section className="section section--offwhite" id="partners">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Convened with</p>
              <h2 className="h-section">{c("partners.heading")}</h2>
            </div>
            <div className="partners">
              {/* The full-colour AU emblem carries a white background, so it is
                  only ever placed on a white card like this one. */}
              <div className="partners__badge">
                <AULogo variant="dark" height={48} />
                <div>
                  <p className="partners__badge-name">African Union</p>
                  <p className="partners__badge-role">Lead convener, through the Continental Volunteer Linkage Platform</p>
                </div>
              </div>
              <ul className="partners__chips">
                {PARTNER_CHIPS.map((p) => <li key={p} className="partners__chip">{p}</li>)}
              </ul>
            </div>
            <p className="partners__note">{c("partners.note")}</p>
          </div>
        </section>

        {/* ---------- 12. Register ---------- */}
        <section className="section section--dark" id="register">
          <div className="container register">
            <div className="register__intro">
              <p className="eyebrow">Registration</p>
              <h2 className="h-section">{c("register.heading")}</h2>
              <p className="sub">{c("register.body")}</p>
            </div>
            <RegisterForm />
          </div>
        </section>

        {/* ---------- 13. Closing band ---------- */}
        <section className="section section--dark closing">
          <div className="glow glow--gold" style={{ width: 460, height: 460, top: -140, left: "12%" }} />
          <div className="glow glow--red" style={{ width: 380, height: 380, bottom: -160, right: "14%" }} />
          <div className="container closing__inner">
            <p className="closing__kicker">{c("closing.kicker")}</p>
            <h2 className="closing__heading">{c("closing.heading")}</h2>
            <p className="closing__body">{c("closing.body")}</p>
            <Link href="#register" className="btn btn--gold">Register your interest</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
