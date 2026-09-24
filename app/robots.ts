import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep crawlers off the JSON API; /api/og stays open so link previews work.
    rules: { userAgent: "*", allow: "/", disallow: "/api/report/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
