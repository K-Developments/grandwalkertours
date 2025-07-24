// src/app/tours/(components)/tours-list.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTourPageTours, getTourPageIntroContent } from '@/lib/firebase/firestore';
import type { Tour, TourPageIntroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type ToursListProps = {
  onTourSelect: (id: string, name: string) => void;
};


const ToursList = ({ onTourSelect }: ToursListProps) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [intro, setIntro] = useState<TourPageIntroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribeTours = getTourPageTours((data) => {
      setTours(data);
      if (intro !== null) setLoading(false);
    });
    const unsubscribeIntro = getTourPageIntroContent((data) => {
      setIntro(data);
      if (tours.length > 0 || data) setLoading(false);
    });
    return () => {
      unsubscribeTours();
      unsubscribeIntro();
    };
  }, [tours.length, intro]);

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 space-y-24">
          <Skeleton className="h-10 w-1/2 mx-auto mb-12" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <Skeleton className="h-[400px] w-full" />
              </div>
              <div className="w-full md:w-1/2">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-32 mt-6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {intro?.title && (
          <MotionWrapper className="text-center mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-light">{intro.title}</h2>
          </MotionWrapper>
        )}
        
        <div className="max-w-md mx-auto mb-16 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
            />
        </div>


        {tours.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-light">No Tours Available</h2>
            <p className="text-muted-foreground">Please check back later for our exciting tour packages.</p>
          </div>
        ) : filteredTours.length === 0 ? (
            <div className="text-center py-12">
                <h3 className="text-xl font-light">No Tours Found</h3>
                <p className="text-muted-foreground">Your search for "{searchQuery}" did not return any results.</p>
            </div>
        ) : (
          <div className="space-y-24">
            {filteredTours.map((tour, index) => (
              <MotionWrapper key={tour.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">
                  
                  {/* Image Column */}
                  <div className={`relative w-full h-[350px] md:h-[500px] ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover w-full h-full"
                      data-ai-hint={tour.imageHint}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute inset-4 border-2 border-white/80 pointer-events-none" />

                    {/* Title with vertical line */}
                     <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center">
                        <div className="flex flex-col items-center">
                            <motion.div 
                                className="w-px bg-white/80"
                                initial={{ height: '40px' }}
                                whileHover={{ height: '60px' }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                            <h3 className="mt-2 text-center text-xl font-light uppercase tracking-wider text-white">
                                {tour.name}
                            </h3>
                       </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`text-foreground p-8 md:p-0 z-10 text-center md:text-left ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Separator className="my-6" />
                        <p className="mb-6 text-muted-foreground">{tour.description}</p>
                        {tour.id && (
                        <Button variant="outline" onClick={() => onTourSelect(tour.id!, tour.name)}>
                            Read More
                        </Button>
                        )}
                    </motion.div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ToursList;
