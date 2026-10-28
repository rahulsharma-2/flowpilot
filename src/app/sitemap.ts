import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL;
  if (!base) return [];
  return [
    { url: new URL('/', base).href },
    { url: new URL('/privacy', base).href },
  ];
}
