import { MetadataRoute } from 'next';
import { consumerIssues } from "@/content/data/consumerIssues";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://moreways.io'; // REPLACE THIS with your actual domain

  // Static Pages
  const routes = [
    '',
    '/about',
    '/how-it-works',
    '/for-law-firms',
    '/start',
    '/faq',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  // Dynamic Issue Pages
  const issues = consumerIssues.map((issue) => ({
    url: `${baseUrl}/issue/${issue.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...issues];
}