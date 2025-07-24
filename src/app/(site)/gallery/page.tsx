// src/app/(site)/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGalleryItems, getGalleryPageHeroContent } from '@/lib/firebase/firestore';
import type { GalleryItem, GalleryPageHeroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"


// MasonryLayout Component
const MasonryLayout = ({ items }: { items: GalleryItem[] }) => {
  // Simple masonry-like effect with CSS columns
  return (
    <motion.div 
      layout
      className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="break-inside-avoid"
          >
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative overflow-hidden rounded-lg cursor-pointer group">
                  <Image
                    src={item.image}
                    alt={item.category || 'Gallery Image'}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-headline text-lg">{item.category}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 border-0">
                  <Image
                    src={item.image}
                    alt={item.category || 'Gallery Image'}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain rounded-lg"
                     data-ai-hint={item.imageHint}
                  />
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};


export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [heroContent, setHeroContent] = useState<GalleryPageHeroContent | null>(null);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeItems = getGalleryItems((data) => {
      setItems(data);
      const uniqueCategories = ['All', ...Array.from(new Set(data.map(item => item.category).filter(Boolean) as string[]))];
      setCategories(uniqueCategories);
      if (heroContent) setLoading(false);
    });
    
    const unsubscribeHero = getGalleryPageHeroContent((data) => {
        setHeroContent(data);
        // Set loading to false only when both data sources are potentially loaded
        setLoading(false); 
    });

    return () => {
      unsubscribeItems();
      unsubscribeHero();
    };
  }, [heroContent]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  const heroImage = heroContent?.image || 'https://placehold.co/1920x600.png';
  const imageHint = heroContent?.imageHint || 'travel collage landscape';

  return (
    <>
       <section className="relative h-[60vh] w-full bg-black">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
        >
            <Image
                src={heroImage}
                alt="A collage of beautiful travel photos"
                fill
                className="w-full h-full object-cover opacity-70"
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
            Our Gallery
            </motion.h1>
        </div>
      </section>

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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Gallery</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
             <Skeleton className="h-96 w-full" />
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex justify-center flex-wrap gap-2 mb-12">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? 'default' : 'outline'}
                      onClick={() => setActiveCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
              
              {filteredItems.length > 0 ? (
                <MasonryLayout items={filteredItems} />
              ) : (
                 <div className="text-center text-muted-foreground py-16">
                    <h3 className="text-2xl font-light">No Images Found</h3>
                    <p>There are no images in this category yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
