import { RegistrationCategory } from "@prisma/client";

/**
 * Single source of truth for registration categories. The "Who Attends"
 * section and the registration dropdown both read from here, so the copy
 * can never drift between them.
 */
export const CATEGORIES: Array<{
  value: RegistrationCategory;
  label: string;
  blurb: string;
}> = [
  {
    value: RegistrationCategory.DELEGATE,
    label: "Delegates",
    blurb: "General conference delegates from governments, agencies and institutions.",
  },
  {
    value: RegistrationCategory.CORPORATE_INTERNATIONAL,
    label: "Corporate & international organizations",
    blurb: "ESG leaders, multinational partners and international bodies.",
  },
  {
    value: RegistrationCategory.NATIONAL_ORGANIZATION,
    label: "National organizations",
    blurb: "Volunteer-involving organizations operating at national level.",
  },
  {
    value: RegistrationCategory.LOCAL_ORGANIZATION,
    label: "Local organizations",
    blurb: "Locally rooted volunteer groups and civil society actors.",
  },
  {
    value: RegistrationCategory.COMMUNITY_BASED_ORGANIZATION,
    label: "Community-based organizations",
    blurb: "CBOs delivering volunteer programmes at grassroots level.",
  },
  {
    value: RegistrationCategory.YOUTH,
    label: "Youth",
    blurb: "Youth leaders and volunteer networks shaping the continental agenda.",
  },
];

export const CATEGORY_LABEL: Record<RegistrationCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
) as Record<RegistrationCategory, string>;

export const SESSION_TYPE_LABEL: Record<string, string> = {
  PLENARY: "Plenary",
  BREAKOUT: "Breakout",
  WORKSHOP: "Workshop",
  MARKETPLACE: "Marketplace",
  NETWORKING: "Networking",
  CEREMONY: "Ceremony",
};

export const DAY_LABEL: Record<number, string> = {
  0: "Day 0",
  1: "Day 1",
  2: "Day 2",
  3: "Day 3",
  4: "Day 4",
};

/** Calendar dates for each conference day, for dashboard grouping headers. */
export const DAY_DATE: Record<number, string> = {
  0: "Mon 9 Nov 2026",
  1: "Tue 10 Nov 2026",
  2: "Wed 11 Nov 2026",
  3: "Thu 12 Nov 2026",
  4: "Fri 13 Nov 2026",
};
