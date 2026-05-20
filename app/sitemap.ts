import { MetadataRoute } from "next";
import { siteConfig, locales } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const isEn = locale === "en";
    const path = isEn ? "" : `/${locale}`;
    return {
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: isEn ? 1.0 : 0.8,
    };
  });
}
