// src/app/(site)/blog/page.tsx
import { getSsgBlogPosts, getBlogPageHeroContentSSG } from '@/lib/firebase/firestore';
import BlogPageClient from './blog-page-client';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Explore our latest articles, travel guides, and stories from around the world. Get inspired for your next journey with Grand Walker Tours.',
};

export default async function BlogPage() {
    const posts = await getSsgBlogPosts();
    const heroContent = await getBlogPageHeroContentSSG();

    return <BlogPageClient posts={posts} heroContent={heroContent} />;
}
