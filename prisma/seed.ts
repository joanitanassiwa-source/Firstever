import { PrismaClient, SessionType, Role, RegistrationCategory } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder admin for development. Replace with a real AUCVLP address
// before this goes anywhere near production.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@volunteer.africa";

const speakers = [
  {
    name: "Naledi Mokoena",
    title: "Commissioner, AU Continental Volunteer Linkage Platform",
    bio: "Naledi leads the AUCVLP's push to register and connect volunteer-involving organizations across all 55 member states. Before joining the Commission, she spent a decade building national service programmes in Southern Africa.",
    avatarColor: "#B4A269",
    initials: "NM",
  },
  {
    name: "Kwame Asante",
    title: "Executive Director, Pan-African Youth Volunteer Network",
    bio: "Kwame founded the Network in 2019 to give young volunteers a seat in policy conversations that used to happen without them. He'll be pushing hard for the youth mobility commitments in the Declaration.",
    avatarColor: "#348F41",
    initials: "KA",
  },
  {
    name: "Farida Hassan",
    title: "Regional Director, UN Volunteers Africa",
    bio: "Farida oversees UNV's country programmes across East and Central Africa and co-authored the forthcoming State of Volunteerism in Africa Report. She's spoken at the last three UN General Assembly side events on volunteerism.",
    avatarColor: "#1A5632",
    initials: "FH",
  },
  {
    name: "Thabo Nkosi",
    title: "Chief Sustainability Officer, Sable Group Holdings",
    bio: "Thabo built Sable Group's employee volunteering programme from a pilot into a continent-wide initiative logging over 40,000 hours a year. He's a vocal advocate for treating volunteer time as a measurable ESG asset.",
    avatarColor: "#9F2241",
    initials: "TN",
  },
  {
    name: "Amara Diallo",
    title: "Founder, Sahel Community Health Corps",
    bio: "Amara started the Corps as a single mobile clinic in rural Mali; it now trains and deploys community health volunteers across four countries. Her session focuses on financing models that outlast donor cycles.",
    avatarColor: "#B4A269",
    initials: "AD",
  },
  {
    name: "Chipo Marufu",
    title: "Dean, School of Public Policy, University of Botswana",
    bio: "Dr. Marufu researches the legal recognition of volunteer labour across African jurisdictions and advised on the Issues Paper's policy sections. She's chairing the Conference's technical validation sessions.",
    avatarColor: "#348F41",
    initials: "CM",
  },
  {
    name: "Emeka Okafor",
    title: "Diaspora Engagement Lead, African Union Foundation",
    bio: "Emeka builds bridges between diaspora professionals and volunteer opportunities back home, having placed over 2,000 skilled volunteers in the last three years. He'll unpack what sustainable diaspora resource mobilization actually looks like.",
    avatarColor: "#1A5632",
    initials: "EO",
  },
  {
    name: "Grace Lekoma",
    title: "Youth & Volunteerism Advocate, Host Committee Botswana",
    bio: "Grace coordinates Botswana's national volunteer corps and is part of the local host committee shaping the Conference's cultural programme. She's especially focused on making the event genuinely accessible to grassroots organizations.",
    avatarColor: "#B4A269",
    initials: "GL",
  },
  {
    name: "Samuel Owusu",
    title: "Programme Lead, Africa Climate Volunteers Coalition",
    bio: "Samuel coordinates reforestation and climate-resilience volunteer programmes spanning twelve countries. He'll be speaking on where green volunteering fits into Africa's broader climate finance conversation.",
    avatarColor: "#348F41",
    initials: "SO",
  },
];

const sessions: Array<{
  day: number;
  time: string;
  title: string;
  description: string;
  type: SessionType;
  capacity?: number;
}> = [
  { day: 0, time: "19:00–21:30", title: "Opening Gala Dinner & Cultural Showcase", description: "Welcome by host-country representatives, cultural performances, continental networking, and Ubuntu storytelling.", type: SessionType.CEREMONY },
  { day: 1, time: "09:00–10:00", title: "Official Opening Ceremony", description: "Welcome remarks, institutional addresses, host-country opening.", type: SessionType.CEREMONY },
  { day: 1, time: "10:00–11:30", title: "Opening Plenary — The Africa We Want", description: "Volunteerism as social infrastructure, and as a strategic imperative for Agenda 2063.", type: SessionType.PLENARY },
  { day: 1, time: "11:30–13:00", title: "Breakouts — Public Policy & Volunteer Ecosystems", description: "National ecosystems, peacebuilding, gender & inclusion, institutionalizing volunteerism.", type: SessionType.BREAKOUT, capacity: 60 },
  { day: 1, time: "14:30–16:00", title: "Strategic Workshop — Drafting the Declaration", description: "Policy harmonization, legal recognition, youth frameworks, volunteer mobility.", type: SessionType.WORKSHOP, capacity: 40 },
  { day: 1, time: "16:00–18:00", title: "Volunteer Pods & Ecosystem Marketplace", description: "Policy-to-Practice Lab, Pan-African Showcase, regional innovation corners.", type: SessionType.MARKETPLACE },
  { day: 1, time: "19:00–21:00", title: "Continental Networking Reception", description: "Building Africa's volunteer alliances.", type: SessionType.NETWORKING },
  { day: 2, time: "09:00–10:30", title: "High-Level Plenary — The Future of Volunteerism Financing", description: "Sustainable financing, ESG, blended finance, philanthropy, public–private models.", type: SessionType.PLENARY },
  { day: 2, time: "11:00–13:00", title: "Breakouts — Corporate Engagement", description: "Employee volunteering, blended finance, measuring SROI, diaspora resource mobilization.", type: SessionType.BREAKOUT, capacity: 50 },
  { day: 2, time: "14:30–16:00", title: "Innovation & Investment Showcase", description: "Digital volunteering platforms and impact-driven initiatives, scaled for investment.", type: SessionType.MARKETPLACE },
  { day: 2, time: "16:00–18:00", title: "Volunteer Pods & Marketplace", description: "Capital Meets Commitment, Corporate Partnership Hub, Philanthropy Forum.", type: SessionType.MARKETPLACE },
  { day: 2, time: "19:00–21:30", title: "ESG & Corporate Leadership Dinner", description: "Investing in Africa's social capital.", type: SessionType.NETWORKING },
  { day: 3, time: "09:00–10:30", title: "Continental Plenary — Volunteering in the Digital Era", description: "AI, digital citizenship, future skills, green and climate volunteerism.", type: SessionType.PLENARY },
  { day: 3, time: "11:00–13:00", title: "Breakouts — Emerging Volunteer Models", description: "Civic tech, intergenerational volunteering, South–South exchanges.", type: SessionType.BREAKOUT, capacity: 45 },
  { day: 3, time: "14:30–15:00", title: "Policy Session — African Youth Charter @20", description: "Recognition of volunteer experience and a Pan-African Volunteer Corps vision.", type: SessionType.WORKSHOP },
  { day: 3, time: "15:00–Evening", title: "Pan-African Identity & Volunteer Showcase", description: "Country showcases, cultural immersion, and the volunteer marketplace.", type: SessionType.MARKETPLACE },
  { day: 4, time: "09:00–10:30", title: "Global Leadership Plenary — Africa on the Global Stage", description: "Volunteer diplomacy and multilateral cooperation.", type: SessionType.PLENARY },
  { day: 4, time: "11:00–13:00", title: "Strategic Sessions — Legacy & Commitments", description: "IVY2026 global call to action, humanitarian resilience, institutional sustainability.", type: SessionType.WORKSHOP },
  { day: 4, time: "14:30–16:00", title: "Continental Legacy Ceremony", description: "Launch of the Continental Volunteer Award Scheme and Pan-African Volunteer Collaboration Platform.", type: SessionType.CEREMONY },
  { day: 4, time: "16:00–17:30", title: "Continental Call to Action & Adoption Ceremony", description: "Adoption of the Africa Declaration on Volunteerism.", type: SessionType.CEREMONY },
  { day: 4, time: "20:00", title: "Closing Gala Dinner", description: "Ubuntu celebration and continental legacy night.", type: SessionType.CEREMONY },
];

const siteContent: Array<{ key: string; value: string; label: string; group: string; multiline?: boolean }> = [
  // Hero
  { key: "hero.eyebrow", value: "Inaugural continental gathering · AUCVLP", label: "Hero eyebrow", group: "Hero", multiline: false },
  { key: "hero.headline", value: "The Africa We Want, Built By Volunteers", label: "Hero headline", group: "Hero", multiline: false },
  { key: "hero.subhead", value: "A continental compact for volunteerism — {i}Ubuntu Spirit, ESG Leadership, Continental Transformation.{/i} Held under the AU Continental Volunteer Linkage Platform, in the year Africa adopts its Declaration on Volunteerism.", label: "Hero subhead ({i}…{/i} renders italic)", group: "Hero" },
  { key: "hero.meta.dates", value: "10 – 14 November 2026", label: "Hero meta — dates", group: "Hero", multiline: false },
  { key: "hero.meta.venue", value: "Gaborone, Botswana", label: "Hero meta — venue", group: "Hero", multiline: false },
  { key: "hero.meta.format", value: "Hybrid — in person & virtual", label: "Hero meta — format", group: "Hero", multiline: false },

  // About
  { key: "about.heading", value: "A fragmented ecosystem, and a continental answer.", label: "About heading", group: "About", multiline: false },
  { key: "about.para1", value: "Across Africa, volunteers carry humanitarian action, peacebuilding, climate adaptation, public health, youth empowerment and community development forward every day. Yet the ecosystem around them is fragmented: policy recognition is uneven, financing is scarce, and there is no single continental home for coordination.", label: "About paragraph 1", group: "About" },
  { key: "about.para2", value: "The Africa Volunteering Conference 2026 brings governments, the African Union, UN Volunteers, civil society, philanthropy, academia and the private sector together in Gaborone to close that gap — and to adopt Africa's first continental Declaration on Volunteerism.", label: "About paragraph 2", group: "About" },
  { key: "about.stat.registrations.label", value: "Registered so far · goal 400+", label: "About — registration stat label", group: "About", multiline: false },
  { key: "about.stat.days.label", value: "Days, from the Ubuntu welcome dinner to the closing gala", label: "About — days stat label", group: "About", multiline: false },
  { key: "about.stat.declaration.label", value: "Africa Declaration on Volunteerism, adopted on the final day", label: "About — declaration stat label", group: "About", multiline: false },

  // Why 2026
  { key: "why.heading", value: "Three continental moments meet at once.", label: "Why 2026 heading", group: "Why 2026", multiline: false },
  { key: "why.item1.title", value: "Agenda 2063 implementation", label: "Why 2026 — item 1 title", group: "Why 2026", multiline: false },
  { key: "why.item1.body", value: "Africa is moving from aspiration to delivery on Agenda 2063, and volunteerism is proposed as a strategic lever for that transformation — not a side activity to it.", label: "Why 2026 — item 1 body", group: "Why 2026" },
  { key: "why.item2.title", value: "International Year of Volunteers for Sustainable Development", label: "Why 2026 — item 2 title", group: "Why 2026", multiline: false },
  { key: "why.item2.body", value: "2026 is IVY2026, the global year the UN has set aside to recognise volunteerism's role in sustainable development — giving this Conference a natural global stage.", label: "Why 2026 — item 2 body", group: "Why 2026" },
  { key: "why.item3.title", value: "African Youth Charter, 20 years on", label: "Why 2026 — item 3 title", group: "Why 2026", multiline: false },
  { key: "why.item3.body", value: "The Charter turns 20 in 2026. The Conference uses the anniversary to anchor youth leadership and volunteer recognition inside the Charter's next chapter.", label: "Why 2026 — item 3 body", group: "Why 2026" },

  // Speakers
  { key: "speakers.heading", value: "Speakers.", label: "Speakers heading", group: "Speakers", multiline: false },
  { key: "speakers.sub", value: "An illustrative first look — the confirmed lineup will be announced as sessions are finalised. Tap a face to jump to their bio.", label: "Speakers subheading", group: "Speakers" },

  // Objectives
  { key: "objectives.heading", value: "Four objectives.", label: "Objectives heading", group: "Objectives", multiline: false },
  { key: "objectives.item1.title", value: "Strengthen the AUCVLP", label: "Objective 1 title", group: "Objectives", multiline: false },
  { key: "objectives.item1.body", value: "As the continental platform for volunteerism — growing registration and active engagement of volunteer-involving organizations and volunteers, and opening access to knowledge, networks and opportunity across borders.", label: "Objective 1 body", group: "Objectives" },
  { key: "objectives.item2.title", value: "Adopt the Africa Declaration on Volunteerism", label: "Objective 2 title", group: "Objectives", multiline: false },
  { key: "objectives.item2.body", value: "As the continent's common position, informed by the State of Volunteerism in Africa Report and dedicated sessions with UN Volunteers.", label: "Objective 2 body", group: "Objectives" },
  { key: "objectives.item3.title", value: "Validate the Issues Paper on Volunteerism in Africa", label: "Objective 3 title", group: "Objectives", multiline: false },
  { key: "objectives.item3.body", value: "Drawing on input from VIOs, Member States, youth, partners and technical experts — and set up the AUCVLP as the continental repository for the evidence and practice this generates.", label: "Objective 3 body", group: "Objectives" },
  { key: "objectives.item4.title", value: "Publish a Post-Conference Action Roadmap", label: "Objective 4 title", group: "Objectives", multiline: false },
  { key: "objectives.item4.body", value: "That turns the Report, the validated Issues Paper and the Conference's outcomes into concrete pressure on national volunteering policy and institutions.", label: "Objective 4 body", group: "Objectives" },

  // Volunteers in action
  { key: "action.heading", value: "What volunteering looks like across Africa.", label: "Volunteers in Action heading", group: "Volunteers in Action", multiline: false },
  { key: "action.sub", value: "Five everyday scenes from the volunteer ecosystem the Conference exists to strengthen.", label: "Volunteers in Action subheading", group: "Volunteers in Action" },

  // Schedule
  { key: "schedule.heading", value: "Conference schedule.", label: "Schedule heading", group: "Schedule", multiline: false },
  { key: "schedule.sub", value: "Draft programme — subject to confirmation. Filter by day or session type to build your own picture of the week.", label: "Schedule subheading", group: "Schedule" },

  // Who attends
  { key: "attends.heading", value: "Who the conference is for.", label: "Who Attends heading", group: "Who Attends", multiline: false },

  // Declaration
  { key: "declaration.heading", value: "The Africa Declaration on Volunteerism.", label: "Declaration heading", group: "Declaration", multiline: false },
  { key: "declaration.body", value: "Adopted on the closing day, the Declaration is a continental framework setting out Africa's common position on volunteerism and its commitments on enabling policy, institutional support, financing and international cooperation.", label: "Declaration body", group: "Declaration" },
  { key: "declaration.quote", value: "More than a conference — a long-term continental movement to make volunteerism a recognised, institutionalized, sustainably financed pillar of Africa's future.", label: "Declaration pull-quote", group: "Declaration" },

  // Venue
  { key: "venue.heading", value: "Gaborone, Botswana.", label: "Venue heading", group: "Venue", multiline: false },
  { key: "venue.para1", value: "The inaugural Africa Volunteering Conference gathers in Gaborone — home to the tradition of the {i}kgotla{/i}, Botswana's community meeting circle, where consensus is built through open dialogue. It's a fitting host for a conference built the same way.", label: "Venue paragraph 1 ({i}…{/i} renders italic)", group: "Venue" },
  { key: "venue.para2", value: "A hybrid participation model keeps the conference open to delegates who can't travel, alongside in-person sessions, cultural evenings and a volunteer marketplace running throughout the week.", label: "Venue paragraph 2", group: "Venue" },
  { key: "venue.caption", value: "Gaborone, on the edge of the Kgale Hill and the Notwane River.", label: "Venue illustration caption", group: "Venue", multiline: false },

  // Partners
  { key: "partners.heading", value: "Organizing partners.", label: "Partners heading", group: "Partners", multiline: false },
  { key: "partners.note", value: "Campaign logos — Agenda 2063, International Year of Volunteers 2026 — will be added here once confirmed.", label: "Partners note", group: "Partners" },

  // Register
  { key: "register.heading", value: "Register your interest.", label: "Register heading", group: "Register", multiline: false },
  { key: "register.body", value: "Leave your details below and we'll send you a confirmation with everything you need — including a link to your personal dashboard.", label: "Register body copy", group: "Register" },

  // Closing band
  { key: "closing.kicker", value: "10–14 NOV 2026", label: "Closing band kicker", group: "Closing CTA", multiline: false },
  { key: "closing.heading", value: "Ubuntu starts in Gaborone.", label: "Closing band heading", group: "Closing CTA", multiline: false },
  { key: "closing.body", value: "Five days, one continent, and a Declaration that puts volunteerism where it belongs — at the centre of Africa's future. Be part of the room where it's written.", label: "Closing band body", group: "Closing CTA" },
];

async function main() {
  console.log("Seeding Africa Volunteering Conference 2026…");

  // Speakers — clearly swappable placeholders until AUCVLP confirms the lineup.
  await prisma.speaker.deleteMany();
  for (const [i, s] of speakers.entries()) {
    await prisma.speaker.create({ data: { ...s, order: i } });
  }
  console.log(`  ${speakers.length} speakers`);

  await prisma.conferenceSession.deleteMany();
  for (const [i, s] of sessions.entries()) {
    await prisma.conferenceSession.create({
      data: {
        day: s.day,
        time: s.time,
        title: s.title,
        description: s.description,
        type: s.type,
        capacity: s.capacity ?? null,
        order: i,
      },
    });
  }
  console.log(`  ${sessions.length} conference sessions`);

  for (const [i, c] of siteContent.entries()) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      // Preserve admin edits on re-seed; only fill in metadata.
      update: { label: c.label, group: c.group, multiline: c.multiline ?? true, order: i },
      create: { ...c, multiline: c.multiline ?? true, order: i },
    });
  }
  console.log(`  ${siteContent.length} site content blocks`);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: Role.admin },
    create: {
      email: ADMIN_EMAIL,
      name: "AUCVLP Administrator",
      organization: "African Union — Continental Volunteer Linkage Platform",
      registrationCategory: RegistrationCategory.DELEGATE,
      role: Role.admin,
    },
  });
  console.log(`  admin user: ${ADMIN_EMAIL}`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
