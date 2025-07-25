// src/app/homepage-components/tours-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTours, getHomepageSectionTitles } from '@/lib/firebase/firestore';
import type { Tour, HomepageSectionTitles } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconDisplay } from '@/components/icon-display';
import { ArrowRight } from 'lucide-react';

export default function ToursSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [titles, setTitles] = useState<HomepageSectionTitles | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribeTours = getTours((data) => {
      setTours(data);
       if (titles) setLoading(false);
    });
    const unsubscribeTitles = getHomepageSectionTitles((data) => {
        setTitles(data);
        if (tours.length > 0 || data) setLoading(false);
    });

    return () => {
        unsubscribeTours();
        unsubscribeTitles();
    };
  }, [tours.length, titles]);

  if (loading) {
    return (
      <section id="tours" className="w-full h-[90vh] flex bg-background">
        <div className="w-full md:w-[40%] bg-card p-8 flex flex-col justify-center">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full opacity-70" />
                <Skeleton className="h-12 w-full opacity-50" />
            </div>
        </div>
        <div className="hidden md:block md:w-[60%] relative">
          <Skeleton className="w-full h-full" />
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return null;
  }

  const activeTour = tours[activeIndex];

  return (
    <section id="tours" className="w-full flex flex-col md:flex-row bg-background text-foreground min-h-[80vh]">
      {/* Left Column (Tour List & Title) */}
      <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
        <h2 className="font-headline text-3xl md:text-4xl font-light mb-8">
            {titles?.toursTitle || 'Featured Tours'}
        </h2>
        <div className="flex flex-col">
            {tours.map((tour, index) => (
                <button
                    key={tour.id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                        "text-left p-4 border-l-4 transition-colors duration-300",
                        activeIndex === index 
                            ? 'border-primary bg-muted' 
                            : 'border-transparent hover:bg-muted/50'
                    )}
                >
                    <h3 className="font-headline text-xl font-light">{tour.name}</h3>
                </button>
            ))}
        </div>
      </div>

      {/* Right Column (Image & Details) */}
      <div className="w-full md:w-[60%] relative h-[60vh] md:h-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Image
              src={activeTour.image}
              alt={activeTour.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              data-ai-hint={activeTour.imageHint}
              quality={95}
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
            <AnimatePresence mode="wait">
                <motion.div
                     key={activeIndex}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <h3 className="font-headline text-3xl font-light text-white mb-2">{activeTour.name}</h3>
                    <p className="max-w-xl text-white/90 mb-4 line-clamp-3">{activeTour.description}</p>
                    
                    {activeTour.activities && activeTour.activities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {activeTour.activities.map(activity => (
                                <div key={activity.id} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                                    <IconDisplay iconName={activity.icon} className="w-4 h-4 text-white" />
                                    <span>{activity.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTour.link && (
                        <Button variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                           <Link href={activeTour.link} >
                             View Tour <ArrowRight className="ml-2 w-4 h-4" />
                           </Link>
                        </Button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
