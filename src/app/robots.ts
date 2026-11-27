import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://expertomemories.shop").replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/gifts",
          "/gifts/",
          "/weddings",
          "/birthdays",
          "/how-it-works",
          "/faq",
          "/terms",
          "/privacy",
          "/refund",
          "/demo/",
        ],
        disallow: [
          "/studio/",
          "/editor/",
          "/dashboard/",
          "/admin/",
          "/api/",
          "/checkout/",
          "/order/",
          "/customer/",
          "/gift/", // Private customer gifts strictly protected from search crawlers
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
