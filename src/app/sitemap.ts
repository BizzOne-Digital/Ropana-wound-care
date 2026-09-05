import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/booking`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${site.url}/testimonials`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((entry) => ({
    ...entry,
    lastModified: now,
  }));

  const slugs = await getServiceSlugs();
  const serviceRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${site.url}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
