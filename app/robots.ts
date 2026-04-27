import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studsphere.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/superadmin/",
          "/user/dashboard/",
          "/institution-zone/dashboard/",
          "/api/",
          "/auth/",
          "/onboarding",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
