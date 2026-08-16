import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/articles", "/tracking", "/roles", "/policy", "/logs", "/login", "/admin"],
    },
    sitemap: "https://perpustakaan.example.com/sitemap.xml",
  };
}
