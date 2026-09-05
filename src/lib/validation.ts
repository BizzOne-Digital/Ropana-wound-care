import { z } from "zod";

const trimmed = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

/**
 * Images are stored by URL. A managed upload is a relative
 * `/api/uploads/<folder>/<file>` path, so a plain `.url()` check would reject
 * it; absolute URLs stay valid for anything hosted elsewhere.
 */
export const mediaUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/api/uploads/") ||
      /^https?:\/\//.test(value),
    "Must be an uploaded image or an absolute URL."
  );

export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid identifier.");

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only."
  );

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(25)
  .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number.");

export const contactSchema = z.object({
  name: trimmed(2, 100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: phoneSchema,
  message: trimmed(10, 2000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please acknowledge before submitting." }),
  }),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  name: trimmed(2, 100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: phoneSchema,
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date."),
  preferredTime: z.enum(["morning", "midday", "afternoon", "flexible"], {
    errorMap: () => ({ message: "Choose a preferred time." }),
  }),
  service: trimmed(2, 120),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please acknowledge before submitting." }),
  }),
});
export type BookingInput = z.infer<typeof bookingSchema>;

/** Must stay in step with MIN_PASSWORD_LENGTH in scripts/seed-admin.ts. */
export const MIN_ADMIN_PASSWORD_LENGTH = 10;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(
      MIN_ADMIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`
    ),
});

export const CONTACT_STATUSES = ["new", "contacted", "resolved"] as const;
export const BOOKING_STATUSES = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export const contactStatusSchema = z.object({
  status: z.enum(CONTACT_STATUSES),
});
export const bookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});

export const serviceSchema = z.object({
  title: trimmed(2, 120),
  slug: slugSchema,
  shortDescription: trimmed(10, 300),
  description: trimmed(20, 8000),
  features: z.array(trimmed(2, 200)).max(12).default([]),
  image: mediaUrl.default(""),
  published: z.boolean().default(true),
  order: z.number().int().min(0).max(999).default(0),
});
export const serviceUpdateSchema = serviceSchema.partial();

export const testimonialSchema = z.object({
  name: trimmed(2, 80),
  content: trimmed(10, 1000),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  location: z.string().trim().max(80).default(""),
  published: z.boolean().default(false),
});
export const testimonialUpdateSchema = testimonialSchema.partial();

export const faqSchema = z.object({
  question: trimmed(5, 250),
  answer: trimmed(10, 4000),
  published: z.boolean().default(true),
  order: z.number().int().min(0).max(999).default(0),
});
export const faqUpdateSchema = faqSchema.partial();

export const settingSchema = z.object({
  key: trimmed(2, 60),
  value: z.string().trim().max(2000),
});

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
