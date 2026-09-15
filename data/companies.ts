// data/companies.ts
import { createElement } from "react";

export interface Company {
  name: string;
  slug: string;
  category:
    | "Government"
    | "Banking"
    | "Healthcare"
    | "Telecom"
    | "Technology"
    | "Education";
  description: string;
  location: string;
  openJobs: number;
  initials: string;
}

export const companyCategories = [
  {
    key: "Government",
    title: "Government Jobs",
    subtitle: "Federal, provincial, and public sector departments",
    icon: createElement(
      "svg",
      {
        className: "w-6 h-6",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
      },
      createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3",
      }),
    ),
  },
  {
    key: "Banking",
    title: "Banking & Finance",
    subtitle: "Top Pakistani banks and financial institutions",
    icon: createElement(
      "svg",
      {
        className: "w-6 h-6",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
      },
      createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ),
  },
  {
    key: "Healthcare",
    title: "Hospitals & Healthcare",
    subtitle: "Leading hospitals, clinics, and medical networks",
    icon: createElement(
      "svg",
      {
        className: "w-6 h-6",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "aria-hidden": "true",
      },
      createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 4v16m8-8H4",
      }),
    ),
  },
];

export const companies: Company[] = [
  // ---------- Government ----------
  {
    name: "National Database & Registration Authority (NADRA)",
    slug: "nadra",
    category: "Government",
    description:
      "Pakistan's national identity and civil registration authority.",
    location: "Islamabad, Pakistan",
    openJobs: 12,
    initials: "ND",
  },
  {
    name: "Pakistan Telecommunication Company Limited (PTCL)",
    slug: "ptcl",
    category: "Government",
    description:
      "State-owned telecommunications and internet service provider.",
    location: "Islamabad, Pakistan",
    openJobs: 8,
    initials: "PT",
  },
  {
    name: "Pakistan State Oil (PSO)",
    slug: "pso",
    category: "Government",
    description: "The largest oil marketing company in Pakistan.",
    location: "Karachi, Pakistan",
    openJobs: 6,
    initials: "PS",
  },
  {
    name: "Sui Northern Gas Pipelines Limited (SNGPL)",
    slug: "sngpl",
    category: "Government",
    description: "Public sector natural gas distribution company.",
    location: "Lahore, Pakistan",
    openJobs: 9,
    initials: "SN",
  },
  {
    name: "Pakistan Railways",
    slug: "pakistan-railways",
    category: "Government",
    description: "National railway operator of Pakistan.",
    location: "Lahore, Pakistan",
    openJobs: 15,
    initials: "PR",
  },
  {
    name: "WAPDA (Water & Power Development Authority)",
    slug: "wapda",
    category: "Government",
    description: "Federal utility managing water and hydropower resources.",
    location: "Lahore, Pakistan",
    openJobs: 7,
    initials: "WP",
  },

  // ---------- Banking ----------
  {
    name: "Meezan Bank",
    slug: "meezan-bank",
    category: "Banking",
    description:
      "Pakistan's leading Islamic bank, offering Shariah-compliant banking.",
    location: "Karachi, Pakistan",
    openJobs: 14,
    initials: "MB",
  },
  {
    name: "Habib Bank Limited (HBL)",
    slug: "hbl",
    category: "Banking",
    description: "One of Pakistan's largest and oldest commercial banks.",
    location: "Karachi, Pakistan",
    openJobs: 18,
    initials: "HB",
  },
  {
    name: "United Bank Limited (UBL)",
    slug: "ubl",
    category: "Banking",
    description: "Major Pakistani commercial bank with a wide branch network.",
    location: "Karachi, Pakistan",
    openJobs: 11,
    initials: "UB",
  },
  {
    name: "Bank Alfalah",
    slug: "bank-alfalah",
    category: "Banking",
    description:
      "Private commercial bank with strong retail and digital services.",
    location: "Karachi, Pakistan",
    openJobs: 10,
    initials: "BA",
  },
  {
    name: "Standard Chartered Pakistan",
    slug: "standard-chartered-pakistan",
    category: "Banking",
    description:
      "International bank with a strong corporate and retail presence in Pakistan.",
    location: "Karachi, Pakistan",
    openJobs: 9,
    initials: "SC",
  },
  {
    name: "Faysal Bank",
    slug: "faysal-bank",
    category: "Banking",
    description: "Islamic banking institution with nationwide branches.",
    location: "Karachi, Pakistan",
    openJobs: 8,
    initials: "FB",
  },
  {
    name: "Bank of Punjab (BOP)",
    slug: "bank-of-punjab",
    category: "Banking",
    description: "Provincial bank serving Punjab and beyond.",
    location: "Lahore, Pakistan",
    openJobs: 7,
    initials: "BP",
  },
  {
    name: "MCB Bank",
    slug: "mcb-bank",
    category: "Banking",
    description: "One of the oldest and most trusted banks in Pakistan.",
    location: "Lahore, Pakistan",
    openJobs: 12,
    initials: "MC",
  },

  // ---------- Healthcare ----------
  {
    name: "Aga Khan University Hospital",
    slug: "aga-khan-university-hospital",
    category: "Healthcare",
    description:
      "Premier academic medical center and hospital network in Pakistan.",
    location: "Karachi, Pakistan",
    openJobs: 22,
    initials: "AK",
  },
  {
    name: "Shaukat Khanum Memorial Cancer Hospital",
    slug: "shaukat-khanum",
    category: "Healthcare",
    description: "Leading cancer care and research hospital in Pakistan.",
    location: "Lahore, Pakistan",
    openJobs: 16,
    initials: "SK",
  },
  {
    name: "Indus Hospital & Health Network",
    slug: "indus-hospital",
    category: "Healthcare",
    description:
      "One of the largest free-of-cost healthcare networks in Pakistan.",
    location: "Karachi, Pakistan",
    openJobs: 19,
    initials: "IH",
  },
  {
    name: "Liaquat National Hospital",
    slug: "liaquat-national-hospital",
    category: "Healthcare",
    description: "Multi-specialty private hospital and medical college.",
    location: "Karachi, Pakistan",
    openJobs: 11,
    initials: "LN",
  },
  {
    name: "Services Hospital Lahore",
    slug: "services-hospital-lahore",
    category: "Healthcare",
    description: "Major government teaching hospital in Punjab.",
    location: "Lahore, Pakistan",
    openJobs: 8,
    initials: "SH",
  },
  {
    name: "Pakistan Institute of Medical Sciences (PIMS)",
    slug: "pims-islamabad",
    category: "Healthcare",
    description:
      "Federal tertiary care hospital and medical research institute.",
    location: "Islamabad, Pakistan",
    openJobs: 13,
    initials: "PM",
  },
];
