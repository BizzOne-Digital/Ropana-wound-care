import "server-only";
import { cache } from "react";
import { dbConnect, serialize } from "@/lib/db";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";
import { Faq } from "@/models/Faq";
import { Setting, SETTING_KEYS } from "@/models/Setting";
import { resolveImageSrc } from "@/lib/uploads";

export type ServiceDTO = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
  /** Managed upload URL, or an empty string when no image has been set. */
  image: string;
  published: boolean;
  order: number;
};

export type TestimonialDTO = {
  _id: string;
  name: string;
  content: string;
  rating: number | null;
  location: string;
  createdAt: string;
};

export type FaqDTO = {
  _id: string;
  question: string;
  answer: string;
  order: number;
};

/**
 * Placeholder photography. These are stable, seeded URLs so the layout can be
 * reviewed before the client's own photography arrives; every one of them is
 * replaceable from the admin dashboard (Media) without a code change.
 * TODO(client): supply real practice photography for hero, about and mobile care.
 */
export const PLACEHOLDER = {
  hero: "https://picsum.photos/seed/ropana-clinician-home-visit/1200/1400",
  about: "https://picsum.photos/seed/ropana-fnp-portrait/900/1100",
  mobileCare: "https://picsum.photos/seed/ropana-mobile-care-doorstep/1100/800",
  service: "https://picsum.photos/seed/ropana-wound-care-service/800/600",
};

export async function getPublishedServices(): Promise<ServiceDTO[] | null> {
  try {
    await dbConnect();
    const docs = await Service.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize<ServiceDTO[]>(docs);
  } catch (error) {
    console.error("[content.getPublishedServices]", error);
    return null;
  }
}

/**
 * Wrapped in React cache() so generateMetadata and the page body share a single
 * database round trip per request instead of querying twice.
 */
export const getServiceBySlug = cache(async function getServiceBySlug(
  slug: string
): Promise<ServiceDTO | null> {
  try {
    await dbConnect();
    const doc = await Service.findOne({ slug, published: true }).lean();
    return doc ? serialize<ServiceDTO>(doc) : null;
  } catch (error) {
    console.error("[content.getServiceBySlug]", error);
    return null;
  }
});

export async function getServiceSlugs(): Promise<string[]> {
  try {
    await dbConnect();
    const docs = await Service.find({ published: true })
      .select("slug")
      .lean();
    return docs.map((d) => d.slug);
  } catch (error) {
    console.error("[content.getServiceSlugs]", error);
    return [];
  }
}

export async function getPublishedTestimonials(
  limit?: number
): Promise<TestimonialDTO[] | null> {
  try {
    await dbConnect();
    const query = Testimonial.find({ published: true }).sort({ createdAt: -1 });
    if (limit) query.limit(limit);
    return serialize<TestimonialDTO[]>(await query.lean());
  } catch (error) {
    console.error("[content.getPublishedTestimonials]", error);
    return null;
  }
}

export async function getPublishedFaqs(
  limit?: number
): Promise<FaqDTO[] | null> {
  try {
    await dbConnect();
    const query = Faq.find({ published: true }).sort({ order: 1, createdAt: 1 });
    if (limit) query.limit(limit);
    return serialize<FaqDTO[]>(await query.lean());
  } catch (error) {
    console.error("[content.getPublishedFaqs]", error);
    return null;
  }
}

export type SiteImages = {
  logo: string;
  heroImage: string;
  aboutImage: string;
  mobileCareImage: string;
};

/** Admin-managed imagery, falling back to seeded placeholders. */
export async function getSiteImages(): Promise<SiteImages> {
  const fallback: SiteImages = {
    logo: "",
    heroImage: PLACEHOLDER.hero,
    aboutImage: PLACEHOLDER.about,
    mobileCareImage: PLACEHOLDER.mobileCare,
  };

  try {
    await dbConnect();
    const docs = await Setting.find({
      key: { $in: Object.values(SETTING_KEYS) },
    }).lean();

    const map = new Map(docs.map((d) => [d.key, d.value]));

    // resolveImageSrc drops legacy disk-backed `/uploads/...` values, which no
    // longer resolve on a serverless host, back to the seeded stand-in.
    return {
      logo: resolveImageSrc(map.get(SETTING_KEYS.logo), fallback.logo),
      heroImage: resolveImageSrc(
        map.get(SETTING_KEYS.heroImage),
        fallback.heroImage
      ),
      aboutImage: resolveImageSrc(
        map.get(SETTING_KEYS.aboutImage),
        fallback.aboutImage
      ),
      mobileCareImage: resolveImageSrc(
        map.get(SETTING_KEYS.mobileCareImage),
        fallback.mobileCareImage
      ),
    };
  } catch (error) {
    console.error("[content.getSiteImages]", error);
    return fallback;
  }
}
