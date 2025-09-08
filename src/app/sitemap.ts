import { getSsgBlogPosts, getSsgDestinationPageDestinations, getSsgTourPageTours } from '@/lib/firebase/firestore';
import { siteConfig } from '@/config/site';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSsgBlogPosts();
  const destinations = await getSsgDestinationPageDestinations();
  const tours = await getSsgTourPageTours();

  const postRoutes = posts.map(post => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt as Date).toISOString(),
  }));

  const destinationRoutes = destinations.map(destination => ({
    url: `${siteConfig.url}/destinations/${destination.id}`,
    lastModified: new Date().toISOString(), 
  }));

  const tourRoutes = tours.map(tour => ({
    url: `${siteConfig.url}/tours/${tour.id}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = [
    '', 
    '/about', 
    '/contact', 
    '/destinations', 
    '/faq', 
    '/gallery', 
    '/privacy-policy', 
    '/rent-a-car', 
    '/services', 
    '/tours',
    '/blog',
    '/cookie-policy',
  ].map(route => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...postRoutes, ...destinationRoutes, ...tourRoutes];
}
