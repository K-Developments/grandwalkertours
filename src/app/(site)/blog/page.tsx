// src/app/(site)/blog/page.tsx
import { getBlogPosts, getBlogPageHeroContent } from '@/lib/firebase/firestore';
import BlogPageClient from './blog-page-client';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Explore our latest articles, travel guides, and stories from around the world. Get inspired for your next journey with Grand Walker Tours.',
};

export default async function BlogPage() {
    const posts = await getBlogPosts();
    const heroContent = await getBlogPageHeroContent();

    return <BlogPageClient posts={posts} heroContent={heroContent} />;
}
