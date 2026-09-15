// lib/plans.ts
export const TOOL_IDS = [
  "phone-validator",
  "ip-checker",
  "email-validator",
  "domain-checker",
  "device-fingerprint",
  "link-scanner",
] as const;

export type ToolId = (typeof TOOL_IDS)[number];
interface AvailableTool {
  id: ToolId;
  label: string;
  icon: string;
  defaultLimit: number;
}
export const AVAILABLE_TOOLS: AvailableTool[] = [
  {
    id: "phone-validator",
    label: "Phone Validator",
    icon: "📱",
    defaultLimit: 100,
  },
  { id: "ip-checker", label: "IP Checker", icon: "🌐", defaultLimit: 100 },
  {
    id: "email-validator",
    label: "Email Validator",
    icon: "✉️",
    defaultLimit: 50,
  },
  {
    id: "domain-checker",
    label: "Domain Checker",
    icon: "🔍",
    defaultLimit: 50,
  },
  {
    id: "device-fingerprint",
    label: "Device Fingerprint",
    icon: "🖥️",
    defaultLimit: 50,
  },
  { id: "link-scanner", label: "Link Scanner", icon: "🔗", defaultLimit: 50 },
];

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      "phone-validator": 100,
      "ip-checker": 100,
      "email-validator": 50,
      "domain-checker": 50,
      "device-fingerprint": 50,
      "link-scanner": 50,
    },
  },
  pro: {
    name: "Pro",
    price: 29,
    limits: {
      "phone-validator": 1000,
      "ip-checker": 1000,
      "email-validator": 500,
      "domain-checker": 500,
      "device-fingerprint": 500,
      "link-scanner": 500,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    limits: {
      "phone-validator": 10000,
      "ip-checker": 10000,
      "email-validator": 5000,
      "domain-checker": 5000,
      "device-fingerprint": 5000,
      "link-scanner": 5000,
    },
  },
};

export function getToolLimit(toolId: ToolId, tier: string = "free"): number {
  const plan = PLANS[tier as keyof typeof PLANS];
  return plan.limits[toolId] || 100;
}
