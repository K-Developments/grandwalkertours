// src/app/homepage-components/tours-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTours, getHomepageSectionTitles } from '@/lib/firebase/firestore';
import type { Tour, HomepageSectionTitles } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { IconDisplay } from '@/components/icon-display';

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
      <section id="tours" className="w-full h-[90vh] flex">
        <div className="w-[30%] bg-card p-8 flex items-center">
          <div className="w-full">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="w-[70%] relative">
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
    <section id="tours" className="w-full md:h-[90vh] flex flex-col md:flex-row bg-card overflow-hidden text-white">
      {/* Mobile Layout: Title -> Image -> Description */}
      <div className="md:hidden flex flex-col ">
        {/* Mobile Title */}
        <div className="p-6 bg-black order-1">
          <h2 className="font-body text-3xl uppercase">{activeTour.name}</h2>
          <Separator className="my-4" />
        </div>
        
        {/* Image */}
        <div className="relative h-60 w-full order-2">
           <Image
              src={activeTour.image}
              alt={activeTour.name}
              fill
              className="object-cover"
              sizes="100vw"
              data-ai-hint={activeTour.imageHint}
              quality={95}
            />
        </div>

        {/* Mobile Description & Button */}
        <div className="p-6 bg-black order-3 flex flex-col justify-center items-center text-center">
          <p className="text-white">{activeTour.description}</p>
           {activeTour.activities && activeTour.activities.length > 0 && (
            <div className="w-full max-w-xs mx-auto mt-6">
                <Carousel opts={{ align: 'start', loop: true }} className="w-full">
                    <CarouselContent>
                    {activeTour.activities.map((activity) => (
                        <CarouselItem key={activity.id} className="basis-1/3">
                            <div className="flex flex-col items-center text-center gap-2">
                                <IconDisplay iconName={activity.icon} className="w-6 h-6 text-primary" />
                                <span className="text-xs text-muted-foreground">{activity.name}</span>
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
            </div>
          )}
          <Button className="mt-6" asChild={!!activeTour.link}>
            {activeTour.link ? <Link href={activeTour.link}>View Tour</Link> : <>View Tour</>}
          </Button>
        </div>
      </div>


      {/* Desktop Layout */}
      {/* Left Column (Image & Navigation) */}
      <div className="hidden md:flex md:w-[65%] relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={activeTour.image}
              alt={activeTour.name}
              fill
              className="object-cover"
              sizes="70vw"
              data-ai-hint={activeTour.imageHint}
              quality={95}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10" />

        {/* Desktop Navigation */}
        <div className="absolute top-10 right-10 z-10 hidden md:block">
          <div className="flex flex-col items-end gap-2">
            {tours.map((tour, index) => (
              <button
                key={tour.id}
                onClick={() => setActiveIndex(index)}
                className="flex items-center gap-4 text-primary-foreground focus:outline-none"
              >
                <span className={cn(
                  "font-mono text-sm transition-opacity",
                  activeIndex !== index && "opacity-60"
                )}>
                  0{index + 1}
                </span>
                <div className="w-16 h-10 border border-primary-foreground/50 flex items-center justify-center p-1">
                  <motion.div
                    className="w-full h-0.5 bg-primary-foreground"
                    initial={{ y: 0 }}
                    animate={{ y: activeIndex === index ? 12 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Column (Details) */}
      <div className="hidden md:flex md:w-[35%] p-8 md:p-12 flex-col justify-center bg-black text-white">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex flex-col h-full"
            >
              <div>
                <h2 className="font-body text-3xl uppercase">{activeTour.name}</h2>
                <Separator className="my-4" />
              </div>
              <div>
                <p className="text-white">{activeTour.description}</p>
              </div>

              {activeTour.activities && activeTour.activities.length > 0 && (
                <div className="mt-8">
                    <Carousel opts={{ align: 'start' }} className="w-full">
                        <CarouselContent>
                        {activeTour.activities.map((activity) => (
                            <CarouselItem key={activity.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <IconDisplay iconName={activity.icon} className="w-8 h-8 text-primary" />
                                    <span className="text-sm text-muted-foreground">{activity.name}</span>
                                </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
              )}
              
              <div className="mt-auto pt-4">
                <Button asChild={!!activeTour.link}>
                  {activeTour.link ? <Link href={activeTour.link}>View Tour</Link> : <>View Tour</>}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

       {/* Mobile Navigation */}
      <div className="md:hidden flex justify-center items-center gap-3 py-4 order-4 bg-card">
          {tours.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/50'
              )}
              aria-label={`Go to tour ${index + 1}`}
            />
          ))}
        </div>
    </section>
  );
};
