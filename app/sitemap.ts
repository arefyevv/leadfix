import type { MetadataRoute } from "next";

const baseUrl = "https://leadfix.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/offer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/personal-data-consent`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];
}
