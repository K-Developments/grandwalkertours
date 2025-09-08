// src/app/(site)/blog/blog-page-client.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost, BlogPageHeroContent } from '@/lib/types';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type BlogPageClientProps = {
    posts: BlogPost[];
    heroContent: BlogPageHeroContent | null;
};

const BlogHero = ({ content }: { content: BlogPageHeroContent | null }) => {
  const heroImage = content?.image || 'https://placehold.co/1920x400.png';
  const imageHint = content?.imageHint || 'travel journal writing';

  return (
    <section className="relative h-[60vh] w-full bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Image
            src={heroImage}
            alt="Scenic view for the blog"
            fill
            className="w-full h-full object-cover opacity-80"
            data-ai-hint={imageHint}
            priority
            sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-0 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
        <motion.h1 
            className="font-headline text-4xl md:text-6xl font-light text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Blog
        </motion.h1>
      </div>
    </section>
  );
};

export default function BlogPageClient({ posts, heroContent }: BlogPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <BlogHero content={heroContent} />
            <div className="container mx-auto px-4 py-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                        Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                        <span className="mx-2 text-muted-foreground">--&gt;</span>
                        <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Blog</span>
                        </div>
                    </li>
                    </ol>
                </nav>
            </div>

            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto mb-12 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map(post => (
                                <motion.div 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Link href={`/blog/${post.slug}`} className="block group">
                                        <div className="relative w-full h-56 rounded-lg overflow-hidden mb-4 shadow-lg">
                                            <Image 
                                                src={post.featuredImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={post.featuredImageHint}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <h2 className="font-headline text-xl font-light mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                                                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{post.authorName}</span>
                                            <span>&bull;</span>
                                            <time dateTime={new Date(post.publishedAt).toISOString()}>
                                                {format(new Date(post.publishedAt), 'PP')}
                                            </time>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-light">No Posts Found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : 'Check back later for new articles.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
