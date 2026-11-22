import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  // Generated at build time, so lastModified reflects the latest deploy.
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/terminal`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ]
}
