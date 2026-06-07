import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/report", "/full-report", "/checkout", "/checkout/success", "/api/"]
      }
    ],
    sitemap: "https://leadfix.ru/sitemap.xml",
    host: "https://leadfix.ru"
  };
}
