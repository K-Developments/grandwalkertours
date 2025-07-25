// src/app/tours/(components)/hero.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTourPageHeroContent } from '@/lib/firebase/firestore';
import type { TourPageHeroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const ToursHero = () => {
  const [content, setContent] = useState<TourPageHeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getTourPageHeroContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const heroImage = content?.image || 'https://placehold.co/1920x400.png';
  const imageHint = content?.imageHint || 'adventure travel collage';

  if (loading) {
    return (
       <section className="relative h-[60vh] md:h-[120vh] w-full bg-muted">
         <Skeleton className="w-full h-full" />
       </section>
    );
  }

  return (
    <section className="relative h-[60vh] md:h-[120vh] w-full bg-black">
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Image
          src={heroImage}
          alt="A collage of exciting tour destinations"
          fill
          className="w-full h-full object-cover opacity-80"
          data-ai-hint={imageHint}
          priority
          sizes="100vw"
          quality={95}
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
          Our Tours
        </motion.h1>
      </div>
    </section>
  );
};

export default ToursHero;
