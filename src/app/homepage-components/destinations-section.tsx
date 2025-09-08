// src/app/homepage-components/destinations-section.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Destination, HomepageSectionTitles } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

type DestinationsSectionProps = {
  destinations: Destination[];
  titles: HomepageSectionTitles | null;
}

export default function DestinationsSection({ destinations, titles }: DestinationsSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])
  
  return (
    <section id="destinations" className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase text-black">{titles?.destinationsTitle || 'Our Destinations'}</h2>
        </div>
        <Carousel 
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <CarouselItem key={destination.id} className="p-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group relative overflow-hidden h-[70vh] md:h-[80vh] border p-6 flex flex-col justify-between">
                    <Image 
                      src={destination.image} 
                      alt={destination.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500 -z-10" 
                      data-ai-hint={destination.imageHint} 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent -z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent -z-10" />
                    
                    {/* Top Content */}
                    <div className="w-full flex justify-center text-primary-foreground">
                        <div className="flex flex-col items-center">
                            <div className="w-px bg-white/80 h-[60px] md:h-[40px] md:group-hover:h-[80px] transition-all duration-300 ease-out"/>
                            <h3 className="mt-2 text-center text-xl font-light uppercase tracking-wider text-white">
                                {destination.name}
                            </h3>
                       </div>
                    </div>

                    {/* Bottom Content */}
                    <div
                        className="text-primary-foreground opacity-100 translate-y-0 md:opacity-0 md:translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                    >
                      <p className="text-sm max-w-xs text-primary-foreground/80 mb-4">{destination.description}</p>
                      {destination.exploreLink && (
                        <Button variant="link" asChild className="p-0 text-white hover:text-primary">
                           <Link href={destination.exploreLink} >
                             Explore <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                           </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground w-full">
                <p>No destinations available at the moment. Please check back later.</p>
              </div>
            )}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10" />
          </div>
        </Carousel>
        
        {destinations.length > 1 && (
           <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground md:hidden">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={scrollPrev}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <div className="font-mono text-center tabular-nums w-12">
              {count > 0 ? `${current} / ${count}` : '0 / 0'}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={scrollNext}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
};
