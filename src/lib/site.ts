/**
 * Single source of truth for business facts that appear across the site.
 * Values come from environment variables so the client can change them
 * without a code edit. Fallbacks match the signed-off brief.
 */

const raw = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Ropana Wound Care",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "ropanawoundcare@gmail.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "2174042055",
  fax: process.env.NEXT_PUBLIC_BUSINESS_FAX ?? "9413400789",
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA ?? "DFW Area",
  url:
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000",
};

function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 10) return digits;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export const site = {
  name: raw.name,
  legalName: raw.name,
  clinician: "Alwin Joy, FNP-BC",
  clinicianRole: "Wound Care Specialist",
  email: raw.email,
  phoneDigits: raw.phone.replace(/\D/g, ""),
  phoneDisplay: formatPhone(raw.phone),
  phoneHref: `tel:+1${raw.phone.replace(/\D/g, "")}`,
  faxDigits: raw.fax.replace(/\D/g, ""),
  faxDisplay: formatPhone(raw.fax),
  faxHref: `fax:+1${raw.fax.replace(/\D/g, "")}`,
  emailHref: `mailto:${raw.email}`,
  serviceArea: raw.serviceArea,
  serviceAreaLong: "Dallas-Fort Worth area",
  url: raw.url.replace(/\/$/, ""),
  tagline: "Expert wound care, delivered to you.",
} as const;

/** Selling points supplied by the client. Do not extend without approval. */
export const differentiators = [
  {
    title: "Board-Certified Family Nurse Practitioner",
    body: "Care is delivered by a board-certified FNP with a wound care focus.",
    icon: "certificate",
  },
  {
    title: "Advanced Wound Care Expertise",
    body: "Assessment and management of complex and slow-to-heal wounds.",
    icon: "bandaids",
  },
  {
    title: "Mobile Visits Available",
    body: "We come to your home, so treatment fits around your day.",
    icon: "van",
  },
  {
    title: "Telehealth Consultations",
    body: "Follow-ups and check-ins by secure video where appropriate.",
    icon: "video",
  },
  {
    title: "Individualized Treatment Plans",
    body: "Every plan is built around your wound, your health and your goals.",
    icon: "clipboard",
  },
  {
    title: "Evidence-Based Care",
    body: "Treatment decisions grounded in current wound care literature.",
    icon: "book",
  },
  {
    title: "Convenient Scheduling",
    body: "Request a time that works for you and we confirm availability.",
    icon: "calendar",
  },
  {
    title: "Compassionate Patient-Centered Care",
    body: "Unhurried visits, plain language and time for your questions.",
    icon: "heart",
  },
] as const;

/** Short trust row shown directly beneath the hero. */
export const trustPoints = [
  { label: "Board-Certified FNP", icon: "certificate" },
  { label: "Advanced Wound Care", icon: "bandaids" },
  { label: "Mobile Visits", icon: "van" },
  { label: "Telehealth", icon: "video" },
  { label: "Patient-Centered", icon: "heart" },
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const MEDICAL_DISCLAIMER =
  "The information on this website is for general educational purposes and is not a substitute for professional medical advice, diagnosis or treatment, and it does not create a provider-patient relationship. If you are experiencing a medical emergency, including heavy bleeding, signs of severe infection, or difficulty breathing, call 911 or go to your nearest emergency department.";

export const PHI_NOTICE =
  "Please do not include sensitive medical details, diagnoses or health record information in this form. We will collect what we need securely once we contact you.";

/** Mission statement supplied by the client. Do not reword without approval. */
export const mission = {
  heading: `About ${site.name}`,
  paragraphs: [
    `At ${site.name}, our mission is to promote healing, prevent complications, and improve quality of life through evidence-based wound management. We provide comprehensive evaluations, advanced treatment options, and personalized care plans for patients with both acute and chronic wounds.`,
    "Whether you need in-person wound care or a virtual consultation, our goal is to deliver compassionate, convenient, and expert care.",
  ],
} as const;

/**
 * Conditions treated, grouped as supplied by the client. This is the fixed
 * clinical scope of the practice, separate from the service listings that are
 * managed from the admin dashboard.
 */
export const conditionGroups = [
  {
    title: "Chronic Wound Care",
    icon: "bandaids",
    conditions: [
      "Diabetic Foot Ulcers",
      "Venous Leg Ulcers",
      "Arterial Ulcers",
      "Pressure Injuries (Stages 1-4)",
      "Neuropathic Ulcers",
    ],
  },
  {
    title: "Acute Wound Care",
    icon: "clipboard",
    conditions: [
      "Surgical Wounds",
      "Post-Operative Wounds",
      "Skin Tears",
      "Abrasions",
      "Traumatic Wounds",
      "Lacerations",
    ],
  },
  {
    title: "Podiatry Services Offered",
    icon: "clipboard",
    conditions: [
      "At - Risk Foot Evaluation",
      "Diabetic Foot & Nail Care",
      "Corn/Callus Removal",
      "Wart Removal",
      "Pain Management Injections",
    ],
  },
] as const;
