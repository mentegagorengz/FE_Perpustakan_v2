import type { MetadataRoute } from "next";

const baseUrl = "https://perpustakaan.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/koleksi`, lastModified: new Date() },
    { url: `${baseUrl}/koleksidaring`, lastModified: new Date() },
    { url: `${baseUrl}/artikel`, lastModified: new Date() },
    { url: `${baseUrl}/profil`, lastModified: new Date() },
  ];
}
