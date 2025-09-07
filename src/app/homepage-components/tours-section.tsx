// src/app/homepage-components/tours-section.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getTours, getHomepageSectionTitles } from '@/lib/firebase/firestore';
import type { Tour, HomepageSectionTitles } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ToursSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [titles, setTitles] = useState<HomepageSectionTitles | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

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

  useEffect(() => {
    if (!api) return;
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);
  
  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  if (loading) {
    return (
      <section id="tours" className="relative w-full h-[90vh] bg-muted">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  if (tours.length === 0) {
    return null;
  }

  const activeTour = tours[activeIndex];

  const handleTourNameClick = (index: number) => {
    setActiveIndex(index);
    api?.scrollTo(index);
  };

  return (
    <section id="tours" className="relative w-full h-[90vh] bg-background text-foreground overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <Image
            src={activeTour.image}
            alt={activeTour.name}
            fill
            className="object-cover"
            sizes="100vw"
            data-ai-hint={activeTour.imageHint}
            quality={95}
            priority={activeIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Left Content Box */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 p-8 md:p-12 z-20">
        <motion.div
          className="bg-fafa-80 backdrop-blur-sm p-8 rounded-md max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-light text-black mb-4">
            {titles?.toursTitle || 'Featured Tours'}
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {activeTour.description}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Slider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-[#FAFAFA] py-6 relative">
          <div className="container mx-auto px-4 flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                className="hidden md:inline-flex"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Carousel
                setApi={setApi}
                opts={{
                align: 'start',
                containScroll: 'keepSnaps',
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                {tours.map((tour, index) => (
                    <CarouselItem key={tour.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <button
                        onClick={() => handleTourNameClick(index)}
                        className="w-full text-left focus:outline-none"
                    >
                        <div className="p-4 rounded-md transition-colors duration-300">
                        <h3
                            className={cn(
                            'font-headline text-lg font-light transition-colors duration-300',
                            activeIndex === index ? 'text-foreground' : 'text-muted-foreground'
                            )}
                        >
                            {tour.name}
                        </h3>
                        </div>
                    </button>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
            <Button
                variant="ghost"
                size="icon"
                onClick={scrollNext}
                className="hidden md:inline-flex"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
